from django.test import TestCase
from users.models import User

# Create your tests here.
class UserModelTest(TestCase):

    def setUp(self):
        """Set up test data before each test runs."""
        self.user1 = User.objects.create(
            username="testuser1", email="test1@example.com", facebook_id="123456789"
        )
        self.user2 = User.objects.create(
            username="testuser2", email="test2@example.com"
        )

    def test_user_creation(self):
        """Test if users are created correctly."""
        user_count = User.objects.count()
        self.assertEqual(user_count, 2)

    def test_user_retrieval(self):
        """Test if users can be retrieved from the database."""
        user = User.objects.get(username="testuser1")
        self.assertEqual(user.email, "test1@example.com")

    def test_user_facebook_id(self):
        """Test if Facebook ID is correctly stored and retrievable."""
        user = User.objects.get(username="testuser1")
        self.assertEqual(user.facebook_id, "123456789")

    def test_user_update(self):
        """Test if a user's data can be updated."""
        user = User.objects.get(username="testuser2")
        user.email = "updated@example.com"
        user.save()
        updated_user = User.objects.get(username="testuser2")
        self.assertEqual(updated_user.email, "updated@example.com")

    def test_user_deletion(self):
        """Test if a user can be deleted from the database."""
        self.user1.delete()
        user_count = User.objects.count()
        self.assertEqual(user_count, 1)

