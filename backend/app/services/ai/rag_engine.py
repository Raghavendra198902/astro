"""
RAG (Retrieval-Augmented Generation) Engine
Semantic search over knowledge base using pgvector
"""

from typing import List, Dict, Any, Optional
import logging
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import KnowledgeBaseDoc
from app.services.ai.llm_client import get_llm_client

logger = logging.getLogger(__name__)


class RAGEngine:
    """RAG engine for knowledge base retrieval and augmented generation"""
    
    def __init__(self):
        self.llm_client = get_llm_client()
        self.embedding_dim = 1536  # OpenAI text-embedding-3-small
    
    async def add_document(
        self,
        db: AsyncSession,
        content: str,
        category: str,
        source: str,
        metadata: Optional[Dict] = None
    ) -> KnowledgeBaseDoc:
        """
        Add document to knowledge base with embedding
        
        Args:
            db: Database session
            content: Text content to store
            category: Category (vedic_text, western_theory, etc.)
            source: Source reference
            metadata: Additional metadata
            
        Returns:
            Created knowledge base document
        """
        # Generate embedding
        embedding = await self.llm_client.generate_embedding(content)
        
        # Create document
        doc = KnowledgeBaseDoc(
            content=content,
            category=category,
            source=source,
            embedding=embedding,
            metadata_=metadata or {}
        )
        
        db.add(doc)
        await db.commit()
        await db.refresh(doc)
        
        logger.info(f"Added document to KB: {source} ({category})")
        return doc
    
    async def semantic_search(
        self,
        db: AsyncSession,
        query: str,
        category: Optional[str] = None,
        limit: int = 5,
        min_similarity: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Perform semantic search in knowledge base
        
        Args:
            db: Database session
            query: Search query
            category: Optional category filter
            limit: Maximum results
            min_similarity: Minimum cosine similarity
            
        Returns:
            List of relevant documents with similarity scores
        """
        # Generate query embedding
        query_embedding = await self.llm_client.generate_embedding(query)
        
        # Build query with cosine similarity
        # pgvector: <=> operator for cosine distance (1 - similarity)
        stmt = select(
            KnowledgeBaseDoc,
            (1 - KnowledgeBaseDoc.embedding.cosine_distance(query_embedding)).label('similarity')
        )
        
        if category:
            stmt = stmt.where(KnowledgeBaseDoc.category == category)
        
        stmt = stmt.order_by(
            KnowledgeBaseDoc.embedding.cosine_distance(query_embedding)
        ).limit(limit)
        
        result = await db.execute(stmt)
        rows = result.all()
        
        # Filter by minimum similarity and format results
        results = []
        for doc, similarity in rows:
            if similarity >= min_similarity:
                results.append({
                    "id": doc.id,
                    "content": doc.content,
                    "category": doc.category,
                    "source": doc.source,
                    "similarity": round(similarity, 4),
                    "metadata": doc.metadata_
                })
        
        logger.info(f"Semantic search found {len(results)} results for: {query[:50]}...")
        return results
    
    async def generate_with_context(
        self,
        db: AsyncSession,
        question: str,
        category: Optional[str] = None,
        max_context_chunks: int = 3
    ) -> Dict[str, Any]:
        """
        Generate response using RAG (retrieve context + generate)
        
        Args:
            db: Database session
            question: User question
            category: Optional category for context retrieval
            max_context_chunks: Maximum context chunks to retrieve
            
        Returns:
            Generated response with sources
        """
        # Retrieve relevant context
        context_docs = await self.semantic_search(
            db,
            question,
            category=category,
            limit=max_context_chunks,
            min_similarity=0.6
        )
        
        if not context_docs:
            # No relevant context found, generate without RAG
            logger.warning("No relevant context found for RAG")
            response = await self.llm_client.generate(
                prompt=question,
                system_prompt="You are an expert astrologer. Provide helpful and accurate information."
            )
            
            return {
                "answer": response["text"],
                "sources": [],
                "context_used": False,
                "usage": response.get("usage", {})
            }
        
        # Build context from retrieved documents
        context_text = "\n\n".join([
            f"Source: {doc['source']}\n{doc['content']}"
            for doc in context_docs
        ])
        
        # Generate with context
        system_prompt = """You are an expert astrologer with deep knowledge of Vedic and Western astrology.
Use the provided context from authoritative sources to answer questions accurately.
If the context doesn't contain relevant information, say so and provide your best general knowledge.
Always cite sources when using information from the context."""
        
        prompt = f"""Context from knowledge base:

{context_text}

Question: {question}

Please provide a comprehensive answer based on the context above."""
        
        response = await self.llm_client.generate(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=1500
        )
        
        return {
            "answer": response["text"],
            "sources": [
                {"source": doc["source"], "similarity": doc["similarity"]}
                for doc in context_docs
            ],
            "context_used": True,
            "usage": response.get("usage", {})
        }
    
    async def batch_add_documents(
        self,
        db: AsyncSession,
        documents: List[Dict[str, Any]]
    ) -> int:
        """
        Batch add multiple documents to knowledge base
        
        Args:
            db: Database session
            documents: List of document dicts with content, category, source
            
        Returns:
            Number of documents added
        """
        count = 0
        
        for doc_data in documents:
            try:
                await self.add_document(
                    db,
                    content=doc_data["content"],
                    category=doc_data["category"],
                    source=doc_data["source"],
                    metadata=doc_data.get("metadata")
                )
                count += 1
            except Exception as e:
                logger.error(f"Error adding document {doc_data.get('source')}: {e}")
                continue
        
        logger.info(f"Batch added {count}/{len(documents)} documents")
        return count


# Global RAG engine instance
rag_engine = RAGEngine()
