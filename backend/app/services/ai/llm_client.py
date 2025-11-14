"""
LLM Client - Abstraction layer for multiple LLM providers
Supports OpenAI, Anthropic, and local models
"""

from typing import Dict, List, Any, Optional
import logging
from abc import ABC, abstractmethod

from app.core.config import settings

logger = logging.getLogger(__name__)


class BaseLLMClient(ABC):
    """Abstract base class for LLM clients"""
    
    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate completion from prompt"""
        pass
    
    @abstractmethod
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding vector for text"""
        pass


class OpenAIClient(BaseLLMClient):
    """OpenAI API client"""
    
    def __init__(self):
        try:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(api_key=settings.LLM_API_KEY)
            self.model = settings.LLM_MODEL or "gpt-4"
            self.embedding_model = "text-embedding-3-small"
        except ImportError:
            logger.error("openai package not installed")
            raise
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate completion using OpenAI"""
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            )
            
            return {
                "text": response.choices[0].message.content,
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                },
                "finish_reason": response.choices[0].finish_reason
            }
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding using OpenAI"""
        try:
            response = await self.client.embeddings.create(
                model=self.embedding_model,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"OpenAI embedding error: {e}")
            raise


class AnthropicClient(BaseLLMClient):
    """Anthropic Claude API client"""
    
    def __init__(self):
        try:
            from anthropic import AsyncAnthropic
            self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            self.model = settings.ANTHROPIC_MODEL or "claude-3-sonnet-20240229"
        except ImportError:
            logger.error("anthropic package not installed")
            raise
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate completion using Claude"""
        try:
            response = await self.client.messages.create(
                model=self.model,
                system=system_prompt or "",
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            )
            
            return {
                "text": response.content[0].text,
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.input_tokens,
                    "completion_tokens": response.usage.output_tokens,
                    "total_tokens": response.usage.input_tokens + response.usage.output_tokens
                },
                "finish_reason": response.stop_reason
            }
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            raise
    
    async def generate_embedding(self, text: str) -> List[float]:
        """
        Anthropic doesn't provide embeddings API.
        Use OpenAI for embeddings even with Claude for generation.
        """
        logger.warning("Using OpenAI for embeddings (Anthropic doesn't provide embedding API)")
        openai_client = OpenAIClient()
        return await openai_client.generate_embedding(text)


class LocalLLMClient(BaseLLMClient):
    """Local LLM client (Ollama/LM Studio)"""
    
    def __init__(self):
        self.base_url = settings.LOCAL_LLM_BASE_URL or "http://localhost:11434"
        self.model = settings.LOCAL_LLM_MODEL or "llama2"
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate completion using local LLM"""
        import aiohttp
        
        full_prompt = prompt
        if system_prompt:
            full_prompt = f"{system_prompt}\n\n{prompt}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": full_prompt,
                        "temperature": temperature,
                        "max_tokens": max_tokens,
                        **kwargs
                    }
                ) as response:
                    data = await response.json()
                    
                    return {
                        "text": data.get("response", ""),
                        "model": self.model,
                        "usage": {
                            "prompt_tokens": 0,
                            "completion_tokens": 0,
                            "total_tokens": 0
                        },
                        "finish_reason": "stop"
                    }
        except Exception as e:
            logger.error(f"Local LLM error: {e}")
            raise
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding using local model"""
        import aiohttp
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/embeddings",
                    json={"model": self.model, "prompt": text}
                ) as response:
                    data = await response.json()
                    return data.get("embedding", [])
        except Exception as e:
            logger.error(f"Local embedding error: {e}")
            # Fallback to OpenAI
            openai_client = OpenAIClient()
            return await openai_client.generate_embedding(text)


class LLMClientFactory:
    """Factory for creating appropriate LLM client"""
    
    @staticmethod
    def create_client(provider: Optional[str] = None) -> BaseLLMClient:
        """Create LLM client based on provider setting"""
        provider = provider or settings.LLM_PROVIDER or "openai"
        
        if provider == "openai":
            return OpenAIClient()
        elif provider == "anthropic":
            return AnthropicClient()
        elif provider == "local":
            return LocalLLMClient()
        else:
            logger.warning(f"Unknown provider {provider}, defaulting to OpenAI")
            return OpenAIClient()


# Global client instance
def get_llm_client(provider: Optional[str] = None) -> BaseLLMClient:
    """Get LLM client instance"""
    return LLMClientFactory.create_client(provider)
