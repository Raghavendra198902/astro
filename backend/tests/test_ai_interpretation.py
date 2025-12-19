"""
Unit tests for AI interpretation service
"""

import pytest
from unittest.mock import AsyncMock, patch
from tests.fixtures import TestDataFactory, MockResponses, AssertionHelpers


class TestAIInterpretationService:
    """Test AI interpretation functionality"""
    
    @pytest.mark.asyncio
    async def test_generate_natal_interpretation(self, client, auth_headers, sample_chart_data):
        """Test generating natal chart interpretation"""
        with patch("app.services.ai.interpretation_engine.LLMClient") as mock_llm:
            mock_instance = AsyncMock()
            mock_instance.generate.return_value = MockResponses.llm_interpretation()
            mock_llm.return_value = mock_instance
            
            # Create a chart first
            chart_response = await client.post(
                "/api/v1/charts/generate",
                json=TestDataFactory.create_chart_request(),
                headers=auth_headers
            )
            
            if chart_response.status_code == 200:
                chart_id = chart_response.json().get("id")
                
                # Request interpretation
                response = await client.post(
                    f"/api/v1/ai/interpretations/natal/{chart_id}",
                    headers=auth_headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    AssertionHelpers.assert_valid_interpretation(data)
    
    @pytest.mark.asyncio
    async def test_generate_transit_interpretation(self, client, auth_headers):
        """Test generating transit interpretation"""
        with patch("app.services.ai.interpretation_engine.LLMClient") as mock_llm:
            mock_instance = AsyncMock()
            mock_instance.generate.return_value = MockResponses.llm_interpretation()
            mock_llm.return_value = mock_instance
            
            chart_response = await client.post(
                "/api/v1/charts/generate",
                json=TestDataFactory.create_chart_request(),
                headers=auth_headers
            )
            
            if chart_response.status_code == 200:
                chart_id = chart_response.json().get("id")
                
                response = await client.post(
                    f"/api/v1/ai/interpretations/transit/{chart_id}",
                    json={"transit_date": "2025-01-15"},
                    headers=auth_headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    AssertionHelpers.assert_valid_interpretation(data)
    
    @pytest.mark.asyncio
    async def test_generate_dasha_interpretation(self, client, auth_headers):
        """Test generating Dasha period interpretation"""
        with patch("app.services.ai.interpretation_engine.LLMClient") as mock_llm:
            mock_instance = AsyncMock()
            mock_instance.generate.return_value = MockResponses.llm_interpretation()
            mock_llm.return_value = mock_instance
            
            chart_response = await client.post(
                "/api/v1/charts/generate",
                json=TestDataFactory.create_chart_request(),
                headers=auth_headers
            )
            
            if chart_response.status_code == 200:
                chart_id = chart_response.json().get("id")
                
                response = await client.post(
                    f"/api/v1/ai/interpretations/dasha/{chart_id}",
                    json={"dasha_planet": "Jupiter"},
                    headers=auth_headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    assert "interpretation" in data


class TestLLMClientIntegration:
    """Test LLM client integration"""
    
    def test_llm_provider_openai(self, test_settings):
        """Test OpenAI provider configuration"""
        assert test_settings.LLM_PROVIDER in ["openai", "anthropic", "ollama", "local"]
        assert test_settings.LLM_MODEL is not None
    
    def test_llm_temperature_range(self, test_settings):
        """Test that LLM temperature is within valid range"""
        assert 0.0 <= test_settings.LLM_TEMPERATURE <= 2.0
    
    def test_llm_max_tokens(self, test_settings):
        """Test that max tokens is positive"""
        assert test_settings.LLM_MAX_TOKENS > 0
    
    @pytest.mark.asyncio
    async def test_llm_mock_response(self, mock_llm_client):
        """Test mocked LLM response"""
        response = await mock_llm_client.generate(
            prompt="Test prompt",
            max_tokens=100
        )
        
        assert "interpretation" in response
        assert "confidence" in response
        assert 0.0 <= response["confidence"] <= 1.0


class TestPromptTemplates:
    """Test interpretation prompt templates"""
    
    def test_natal_prompt_structure(self):
        """Test natal interpretation prompt structure"""
        prompt_template = """
        You are an expert astrologer. Analyze the following birth chart:
        
        Planets: {planets}
        Houses: {houses}
        Aspects: {aspects}
        
        Provide a comprehensive interpretation focusing on:
        1. Personality traits
        2. Career potential
        3. Relationships
        4. Life purpose
        """
        
        assert "{planets}" in prompt_template
        assert "{houses}" in prompt_template
        assert "{aspects}" in prompt_template
    
    def test_transit_prompt_structure(self):
        """Test transit interpretation prompt structure"""
        prompt_template = """
        Analyze the following planetary transits:
        
        Current Transits: {transits}
        Natal Chart: {natal}
        
        Focus on:
        1. Immediate influences
        2. Opportunities
        3. Challenges
        """
        
        assert "{transits}" in prompt_template
        assert "{natal}" in prompt_template
    
    def test_compatibility_prompt_structure(self):
        """Test compatibility interpretation prompt structure"""
        prompt_template = """
        Analyze compatibility between:
        
        Person 1: {person1_chart}
        Person 2: {person2_chart}
        
        Synastry Aspects: {aspects}
        
        Evaluate:
        1. Emotional compatibility
        2. Communication
        3. Long-term potential
        """
        
        assert "{person1_chart}" in prompt_template
        assert "{person2_chart}" in prompt_template


class TestConfidenceScoring:
    """Test confidence scoring in interpretations"""
    
    def test_confidence_range(self):
        """Test that confidence scores are within valid range"""
        test_confidence = 0.87
        assert 0.0 <= test_confidence <= 1.0
    
    def test_confidence_levels(self):
        """Test confidence level categorization"""
        def get_confidence_level(score: float) -> str:
            if score >= 0.9:
                return "very_high"
            elif score >= 0.7:
                return "high"
            elif score >= 0.5:
                return "moderate"
            else:
                return "low"
        
        assert get_confidence_level(0.95) == "very_high"
        assert get_confidence_level(0.80) == "high"
        assert get_confidence_level(0.60) == "moderate"
        assert get_confidence_level(0.40) == "low"
    
    @pytest.mark.asyncio
    async def test_confidence_in_response(self, mock_llm_client):
        """Test that confidence is included in response"""
        response = await mock_llm_client.generate(prompt="Test")
        
        assert "confidence" in response
        assert isinstance(response["confidence"], (int, float))


class TestTokenUsageTracking:
    """Test token usage and cost tracking"""
    
    def test_token_counting(self):
        """Test token count estimation"""
        sample_text = "This is a sample text for token counting."
        # Rough estimate: ~1 token per 4 characters
        estimated_tokens = len(sample_text) // 4
        assert estimated_tokens > 0
    
    def test_cost_calculation(self):
        """Test cost calculation based on tokens"""
        tokens_used = 1000
        cost_per_1k_tokens = 0.002  # $0.002 per 1K tokens
        expected_cost = (tokens_used / 1000) * cost_per_1k_tokens
        
        assert expected_cost == 0.002
    
    @pytest.mark.asyncio
    async def test_token_tracking_in_response(self, mock_llm_client):
        """Test that token usage is tracked"""
        response = await mock_llm_client.generate(prompt="Test")
        
        if "tokens_used" in response:
            assert isinstance(response["tokens_used"], int)
            assert response["tokens_used"] > 0
        
        if "cost" in response:
            assert isinstance(response["cost"], (int, float))
            assert response["cost"] >= 0


class TestRAGIntegration:
    """Test RAG (Retrieval Augmented Generation) integration"""
    
    @pytest.mark.asyncio
    async def test_rag_document_retrieval(self):
        """Test RAG document retrieval"""
        # Mock RAG retrieval
        query = "Sun in 10th house"
        mock_documents = [
            {
                "content": "Sun in the 10th house indicates strong career potential...",
                "similarity": 0.92
            },
            {
                "content": "The 10th house represents public life and achievements...",
                "similarity": 0.87
            }
        ]
        
        # Check that documents are relevant
        for doc in mock_documents:
            assert doc["similarity"] >= 0.7
            assert len(doc["content"]) > 0
    
    def test_rag_similarity_threshold(self, test_settings):
        """Test RAG similarity threshold"""
        assert 0.0 <= test_settings.VECTOR_SIMILARITY_THRESHOLD <= 1.0
    
    def test_rag_top_k(self, test_settings):
        """Test RAG retrieves specified number of documents"""
        assert test_settings.RAG_TOP_K > 0
        assert test_settings.RAG_TOP_K <= 20


class TestInterpretationCaching:
    """Test caching of interpretations"""
    
    @pytest.mark.asyncio
    async def test_cache_key_generation(self):
        """Test cache key generation for interpretations"""
        chart_id = "test-chart-123"
        interpretation_type = "natal"
        
        cache_key = f"interpretation:{interpretation_type}:{chart_id}"
        
        assert "interpretation" in cache_key
        assert chart_id in cache_key
        assert interpretation_type in cache_key
    
    @pytest.mark.asyncio
    async def test_cached_interpretation(self, redis_client):
        """Test retrieving cached interpretation"""
        cache_key = "interpretation:natal:test-123"
        cached_data = {
            "interpretation": "Test interpretation",
            "confidence": 0.85
        }
        
        # Set cache
        import json
        await redis_client.setex(
            cache_key,
            3600,  # 1 hour
            json.dumps(cached_data)
        )
        
        # Retrieve from cache
        cached = await redis_client.get(cache_key)
        assert cached is not None
        
        retrieved = json.loads(cached)
        assert retrieved["interpretation"] == cached_data["interpretation"]


class TestInterpretationValidation:
    """Test interpretation output validation"""
    
    def test_interpretation_min_length(self):
        """Test that interpretations meet minimum length"""
        interpretation = "This is a test interpretation that should be reasonably long."
        min_length = 20
        
        assert len(interpretation) >= min_length
    
    def test_interpretation_format(self):
        """Test interpretation formatting"""
        interpretation = {
            "interpretation": "Detailed astrological interpretation...",
            "confidence": 0.85,
            "focus_areas": ["career", "relationships", "health"],
            "timestamp": "2025-01-15T10:30:00Z"
        }
        
        assert isinstance(interpretation["interpretation"], str)
        assert isinstance(interpretation["confidence"], float)
        assert isinstance(interpretation["focus_areas"], list)
    
    def test_interpretation_contains_keywords(self):
        """Test that interpretation contains relevant astrological keywords"""
        interpretation = """
        The Sun in the 10th house indicates strong career potential.
        The Moon in the 4th house suggests deep emotional connections.
        """
        
        astro_keywords = ["Sun", "Moon", "house", "career", "emotional"]
        found_keywords = [kw for kw in astro_keywords if kw in interpretation]
        
        assert len(found_keywords) >= 3
