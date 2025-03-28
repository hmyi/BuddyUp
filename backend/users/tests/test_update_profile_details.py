import pytest
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User

@pytest.mark.django_db
class TestUserAPIs:
    def setup_method(self):
        """Set up test client and users."""
        self.client = APIClient()
        self.user = User.objects.create(
            username="testuser",
            email="test@example.com"
        )
        self.client.force_authenticate(user=self.user)

    def test_update_profile_details_partial_update(self):
        """
        Test partially updating profile details.
        """
        # Prepare partial update data
        update_data = {
            "location": "San Francisco"
        }
        
        # Make the request
        response = self.client.post("/api/users/update/", update_data)
        
        # Refresh user from database
        self.user.refresh_from_db()
        
        # Assertions
        assert response.status_code == 200
        assert response.data["location"] == "San Francisco"

    def test_update_profile_details_invalid_data(self):
        """
        Test updating profile details with invalid data.
        """
        # Prepare invalid update data (depends on your serializer validation)
        invalid_data = {
            "email": "invalid-email"  # Assuming email validation exists
        }
        
        # Make the request
        response = self.client.post("/api/users/update/", invalid_data)
        
        # Assertions
        assert response.status_code == 400
        assert "email" in response.data
