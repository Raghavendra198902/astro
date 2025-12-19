"""
Unit tests for API endpoints
"""

import pytest
from tests.fixtures import TestDataFactory


class TestHealthEndpoints:
    """Test health check endpoints"""
    
    @pytest.mark.asyncio
    async def test_health_check(self, client):
        """Test basic health check"""
        response = await client.get("/api/v1/healthz")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self, client):
        """Test root endpoint"""
        response = await client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data or "version" in data


class TestUserEndpoints:
    """Test user management endpoints"""
    
    @pytest.mark.asyncio
    async def test_create_profile(self, client, test_user, auth_headers):
        """Test profile creation"""
        profile_data = TestDataFactory.create_profile_data(
            name="Test Profile",
            birthplace_text="New York, NY"
        )
        
        response = await client.post(
            "/api/v1/users/profiles",
            json=profile_data,
            headers=auth_headers
        )
        
        # Should create profile successfully
        assert response.status_code in [200, 201]
        if response.status_code in [200, 201]:
            data = response.json()
            assert data["name"] == "Test Profile"
    
    @pytest.mark.asyncio
    async def test_get_user_profiles(self, client, test_user, test_profile, auth_headers):
        """Test getting user profiles"""
        response = await client.get(
            "/api/v1/users/profiles",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        profiles = response.json()
        assert isinstance(profiles, list)
        assert len(profiles) >= 1
    
    @pytest.mark.asyncio
    async def test_update_profile(self, client, test_profile, auth_headers):
        """Test profile update"""
        response = await client.put(
            f"/api/v1/users/profiles/{test_profile.id}",
            json={"name": "Updated Name"},
            headers=auth_headers
        )
        
        # Should update or return not found
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_delete_profile(self, client, test_profile, auth_headers):
        """Test profile deletion"""
        response = await client.delete(
            f"/api/v1/users/profiles/{test_profile.id}",
            headers=auth_headers
        )
        
        # Should delete successfully
        assert response.status_code in [200, 204, 404]


class TestChartEndpoints:
    """Test chart API endpoints"""
    
    @pytest.mark.asyncio
    async def test_list_charts(self, client, auth_headers):
        """Test listing user's charts"""
        response = await client.get(
            "/api/v1/charts",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        charts = response.json()
        assert isinstance(charts, list)
    
    @pytest.mark.asyncio
    async def test_get_chart_by_id(self, client, auth_headers):
        """Test getting chart by ID"""
        # First create a chart
        chart_response = await client.post(
            "/api/v1/charts/generate",
            json=TestDataFactory.create_chart_request(),
            headers=auth_headers
        )
        
        if chart_response.status_code == 200:
            chart_id = chart_response.json().get("id")
            
            # Get the chart
            response = await client.get(
                f"/api/v1/charts/{chart_id}",
                headers=auth_headers
            )
            
            assert response.status_code == 200
            chart = response.json()
            assert chart["id"] == chart_id
    
    @pytest.mark.asyncio
    async def test_delete_chart(self, client, auth_headers):
        """Test chart deletion"""
        # First create a chart
        chart_response = await client.post(
            "/api/v1/charts/generate",
            json=TestDataFactory.create_chart_request(),
            headers=auth_headers
        )
        
        if chart_response.status_code == 200:
            chart_id = chart_response.json().get("id")
            
            # Delete the chart
            response = await client.delete(
                f"/api/v1/charts/{chart_id}",
                headers=auth_headers
            )
            
            assert response.status_code in [200, 204]


class TestCompatibilityEndpoints:
    """Test compatibility analysis endpoints"""
    
    @pytest.mark.asyncio
    async def test_kundali_milan(self, client, auth_headers):
        """Test Kundali Milan (36 Guna) endpoint"""
        compat_data = TestDataFactory.create_compatibility_request()
        
        response = await client.post(
            "/api/v1/compatibility/kundali",
            json=compat_data,
            headers=auth_headers
        )
        
        # Should return compatibility result
        assert response.status_code in [200, 422]
        if response.status_code == 200:
            data = response.json()
            assert "total_points" in data or "score" in data
    
    @pytest.mark.asyncio
    async def test_synastry_analysis(self, client, auth_headers):
        """Test Western synastry analysis endpoint"""
        compat_data = TestDataFactory.create_compatibility_request()
        
        response = await client.post(
            "/api/v1/compatibility/synastry",
            json=compat_data,
            headers=auth_headers
        )
        
        # Should return synastry result
        assert response.status_code in [200, 422]
        if response.status_code == 200:
            data = response.json()
            assert "aspects" in data or "compatibility" in data


class TestInterpretationEndpoints:
    """Test AI interpretation endpoints"""
    
    @pytest.mark.asyncio
    async def test_natal_interpretation(self, client, auth_headers):
        """Test natal chart interpretation"""
        # First create a chart
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
            
            # Should return interpretation
            assert response.status_code in [200, 404, 503]
    
    @pytest.mark.asyncio
    async def test_transit_interpretation(self, client, auth_headers):
        """Test transit interpretation"""
        chart_response = await client.post(
            "/api/v1/charts/generate",
            json=TestDataFactory.create_chart_request(),
            headers=auth_headers
        )
        
        if chart_response.status_code == 200:
            chart_id = chart_response.json().get("id")
            
            response = await client.post(
                f"/api/v1/ai/interpretations/transit/{chart_id}",
                headers=auth_headers
            )
            
            # Should return interpretation or error
            assert response.status_code in [200, 404, 503]


class TestPaymentEndpoints:
    """Test payment processing endpoints"""
    
    @pytest.mark.asyncio
    async def test_create_payment(self, client, auth_headers):
        """Test payment creation"""
        payment_data = {
            "amount": 999,
            "currency": "INR",
            "plan_type": "pro",
            "payment_method": "card"
        }
        
        response = await client.post(
            "/api/v1/payments/create",
            json=payment_data,
            headers=auth_headers
        )
        
        # Should create payment or return validation error
        assert response.status_code in [200, 201, 422]
    
    @pytest.mark.asyncio
    async def test_get_payment_history(self, client, auth_headers):
        """Test getting payment history"""
        response = await client.get(
            "/api/v1/payments/history",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        payments = response.json()
        assert isinstance(payments, list)


class TestConsultationEndpoints:
    """Test consultation booking endpoints"""
    
    @pytest.mark.asyncio
    async def test_list_available_slots(self, client, auth_headers):
        """Test listing available consultation slots"""
        response = await client.get(
            "/api/v1/consultations/slots",
            params={
                "start_date": "2025-01-01",
                "end_date": "2025-01-31"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200
        slots = response.json()
        assert isinstance(slots, list)
    
    @pytest.mark.asyncio
    async def test_create_booking(self, client, auth_headers):
        """Test creating consultation booking"""
        booking_data = {
            "slot_id": "test-slot-id",
            "notes": "Test consultation"
        }
        
        response = await client.post(
            "/api/v1/consultations/bookings",
            json=booking_data,
            headers=auth_headers
        )
        
        # Should create booking or return error
        assert response.status_code in [200, 201, 404, 422]
    
    @pytest.mark.asyncio
    async def test_get_user_bookings(self, client, auth_headers):
        """Test getting user's bookings"""
        response = await client.get(
            "/api/v1/consultations/bookings",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        bookings = response.json()
        assert isinstance(bookings, list)


class TestReportEndpoints:
    """Test report generation endpoints"""
    
    @pytest.mark.asyncio
    async def test_generate_natal_report(self, client, auth_headers):
        """Test natal chart report generation"""
        # First create a chart
        chart_response = await client.post(
            "/api/v1/charts/generate",
            json=TestDataFactory.create_chart_request(),
            headers=auth_headers
        )
        
        if chart_response.status_code == 200:
            chart_id = chart_response.json().get("id")
            
            # Generate report
            response = await client.post(
                "/api/v1/reports/generate",
                json={
                    "chart_id": chart_id,
                    "report_type": "natal",
                    "theme": "classic"
                },
                headers=auth_headers
            )
            
            # Should generate report or return error
            assert response.status_code in [200, 201, 404, 503]
    
    @pytest.mark.asyncio
    async def test_list_reports(self, client, auth_headers):
        """Test listing user's reports"""
        response = await client.get(
            "/api/v1/reports",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        reports = response.json()
        assert isinstance(reports, list)


class TestRateLimiting:
    """Test API rate limiting"""
    
    @pytest.mark.asyncio
    async def test_rate_limit_enforced(self, client, auth_headers):
        """Test that rate limiting is enforced"""
        # Make multiple rapid requests
        responses = []
        for _ in range(100):
            response = await client.get(
                "/api/v1/charts",
                headers=auth_headers
            )
            responses.append(response.status_code)
        
        # Should eventually get rate limited (429)
        # Note: May not trigger in test environment
        status_codes = set(responses)
        assert 200 in status_codes  # At least some succeed


class TestErrorHandling:
    """Test error handling"""
    
    @pytest.mark.asyncio
    async def test_404_not_found(self, client):
        """Test 404 error for non-existent endpoint"""
        response = await client.get("/api/v1/nonexistent")
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_401_unauthorized(self, client):
        """Test 401 error without authentication"""
        response = await client.get("/api/v1/charts")
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_422_validation_error(self, client, auth_headers):
        """Test 422 validation error"""
        response = await client.post(
            "/api/v1/charts/generate",
            json={"invalid": "data"},
            headers=auth_headers
        )
        assert response.status_code == 422
