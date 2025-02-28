from django.test import TestCase
from users.models import User
from django.db.utils import IntegrityError
from django.db.utils import DataError
from django.core.exceptions import ValidationError

class UserModelTest(TestCase):

    def setUp(self):
        """Set up test data before each test runs."""
        self.user1 = User.objects.create(
            username="testuser1", email="test1@example.com", facebook_id="123456789"
        )
        self.user2 = User.objects.create(
            username="testuser2", email="test2@example.com"
        )

    # Statement Coverage - Ensures all lines in `models.py` execute
    def test_user_creation(self):
        """Test if users are created correctly."""
        user_count = User.objects.count()
        self.assertEqual(user_count, 2)

    def test_user_str_method(self):
        """Test if __str__ returns the username correctly."""
        self.assertEqual(str(self.user1), "testuser1")
        self.assertEqual(str(self.user2), "testuser2")

    # Branch Coverage - Testing Facebook ID handling (null, unique, valid)
    def test_facebook_id_handling(self):
        """Test Facebook ID field allows null, blank, and uniqueness."""
        self.assertEqual(self.user1.facebook_id, "123456789")
        self.assertIsNone(self.user2.facebook_id)

        # Test uniqueness constraint
        with self.assertRaises(IntegrityError):
            User.objects.create(username="testuser3", facebook_id="123456789")

    # Path Coverage - Testing all possible updates on a User instance
    def test_user_update(self):
        """Test if a user's fields can be updated."""
        user = User.objects.get(username="testuser2")

        # Update all fields
        user.email = "updated@example.com"
        user.facebook_id = "987654321"
        user.save()

        updated_user = User.objects.get(username="testuser2")
        self.assertEqual(updated_user.email, "updated@example.com")
        self.assertEqual(updated_user.facebook_id, "987654321")

    # Testing Edge Cases
    def test_blank_username(self):
        """Test creating a user with a blank username (should fail)."""
        user = User(username="")  # Create instance but do not save
        with self.assertRaises(ValidationError):
            user.full_clean()  # Triggers Django model validation

    def test_long_facebook_id(self):
        """Test that an error is raised when Facebook ID exceeds max_length."""
        user = User(username="testuser4", facebook_id="1" * 101)  # 101 characters
        with pytest.raises(ValidationError):
            user.clean()  # This enforces model validation

    def test_duplicate_username(self):
        """Test if creating a user with an existing username raises an error."""
        with self.assertRaises(IntegrityError):
            User.objects.create(username="testuser1", email="duplicate@example.com")

    def test_user_deletion(self):
        """Test if a user can be deleted from the database."""
        self.user1.delete()
        user_count = User.objects.count()
        self.assertEqual(user_count, 1)
