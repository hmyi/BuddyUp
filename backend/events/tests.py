from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from events.models import Event
from events.serializers import EventSerializer
from django.core.files.uploadedfile import SimpleUploadedFile
from events.forms import ProfileImageForm
from PIL import Image
from unittest.mock import patch
from events.semantic_search import preprocess_text, text_to_vector, compute_similarities
from unittest.mock import Mock
import io
import random
import numpy as np

User = get_user_model()

class EventModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser", email="test@example.com")

    def test_event_creation_with_minimal_data(self):
        """Test creating an event with minimal required fields."""
        event = Event.objects.create(
            title="Minimal Event",
            category="Test",
            city="Test City",
            location="Test Location",
            start_time=timezone.now() + timezone.timedelta(days=30),
            end_time=timezone.now() + timezone.timedelta(days=31),
            capacity=10,
            creator=self.user
        )
        self.assertEqual(event.title, "Minimal Event")
        self.assertEqual(event.attendance, 0)

    def test_event_creation_with_optional_description(self):
        """Test creating an event with an optional description."""
        event = Event.objects.create(
            title="Descriptive Event",
            category="Test",
            city="Test City",
            location="Test Location",
            description="This is a test event with a description",
            start_time=timezone.now() + timezone.timedelta(days=30),
            end_time=timezone.now() + timezone.timedelta(days=31),
            capacity=10,
            creator=self.user
        )
        self.assertEqual(event.description, "This is a test event with a description")

    def test_event_participant_management(self):
        """Test adding and removing participants."""
        event = Event.objects.create(
            title="Participant Test Event",
            category="Test",
            city="Test City",
            location="Test Location",
            start_time=timezone.now() + timezone.timedelta(days=30),
            end_time=timezone.now() + timezone.timedelta(days=31),
            capacity=5,
            creator=self.user
        )

        # Create additional users
        users = [
            User.objects.create(username=f"user{i}", email=f"user{i}@test.com") 
            for i in range(3)
        ]

        # Add participants
        for user in users:
            event.participants.add(user)
        
        event.attendance = event.participants.count()
        event.save()

        self.assertEqual(event.attendance, 3)
        self.assertTrue(all(user in event.participants.all() for user in users))

        # Remove a participant
        event.participants.remove(users[0])
        event.attendance = event.participants.count()
        event.save()

        self.assertEqual(event.attendance, 2)
        self.assertFalse(users[0] in event.participants.all())

    def test_event_str_representation(self):
        """Test the string representation of an event."""
        event = Event.objects.create(
            title="String Representation Test",
            category="Test",
            city="Test City",
            location="Test Location",
            start_time=timezone.now() + timezone.timedelta(days=30),
            end_time=timezone.now() + timezone.timedelta(days=31),
            capacity=10,
            creator=self.user
        )
        self.assertEqual(str(event), "String Representation Test")

    def test_event_with_zero_capacity(self):
        """Test creating an event with zero capacity."""
        with self.assertRaises(ValidationError):
            Event.objects.create(
                title="Zero Capacity Event",
                category="Test",
                city="Test City",
                location="Test Location",
                start_time=timezone.now() + timezone.timedelta(days=30),
                end_time=timezone.now() + timezone.timedelta(days=31),
                capacity=0,
                creator=self.user
            )

    def test_event_with_negative_capacity(self):
        """Test creating an event with negative capacity."""
        with self.assertRaises(ValidationError):
            Event.objects.create(
                title="Negative Capacity Event",
                category="Test",
                city="Test City",
                location="Test Location",
                start_time=timezone.now() + timezone.timedelta(days=30),
                end_time=timezone.now() + timezone.timedelta(days=31),
                capacity=-5,
                creator=self.user
            )

    def test_event_with_end_time_before_start_time(self):
        """Test creating an event with end time before start time."""
        with self.assertRaises(ValidationError):
            event = Event.objects.create(
                title="Inverted Time Event",
                category="Test",
                city="Test City",
                location="Test Location",
                start_time=timezone.now() + timezone.timedelta(days=31),
                end_time=timezone.now() + timezone.timedelta(days=30),
                capacity=10,
                creator=self.user
            )
            # Force full validation
            event.full_clean()

    def test_event_with_past_start_time(self):
        """Test creating an event with a start time in the past."""
        with self.assertRaises(ValidationError):
            event = Event.objects.create(
                title="Past Time Event",
                category="Test",
                city="Test City",
                location="Test Location",
                start_time=timezone.now() - timezone.timedelta(days=1),
                end_time=timezone.now() + timezone.timedelta(days=1),
                capacity=10,
                creator=self.user
            )
            # Force full validation
            event.full_clean()

    def test_event_maximum_length_fields(self):
        """Test field length constraints."""
        # Test maximum length for title, category, city, location
        long_string = "a" * 201  # Exceeds max_length of 200
        
        with self.assertRaises(ValidationError):
            Event.objects.create(
                title=long_string,
                category="Test",
                city="Test City",
                location="Test Location",
                start_time=timezone.now() + timezone.timedelta(days=30),
                end_time=timezone.now() + timezone.timedelta(days=31),
                capacity=10,
                creator=self.user
            )

        long_category = "a" * 101  # Exceeds max_length of 100
        with self.assertRaises(ValidationError):
            Event.objects.create(
                title="Long Category Test",
                category=long_category,
                city="Test City",
                location="Test Location",
                start_time=timezone.now() + timezone.timedelta(days=30),
                end_time=timezone.now() + timezone.timedelta(days=31),
                capacity=10,
                creator=self.user
            )

    def test_event_with_extremely_long_description(self):
        """Test creating an event with an extremely long description."""
        # Django allows TextField to be very long, so we'll test a massive description
        massive_description = "a" * 100000  # 100,000 character description
        
        event = Event.objects.create(
            title="Massive Description Event",
            category="Test",
            city="Test City",
            location="Test Location",
            description=massive_description,
            start_time=timezone.now() + timezone.timedelta(days=30),
            end_time=timezone.now() + timezone.timedelta(days=31),
            capacity=10,
            creator=self.user
        )
        
        self.assertEqual(len(event.description), 100000)

    def test_event_multiple_similar_events(self):
        """Test creating multiple very similar events."""
        base_event_data = {
            "category": "Test",
            "city": "Test City",
            "location": "Test Location",
            "start_time": timezone.now() + timezone.timedelta(days=30),
            "end_time": timezone.now() + timezone.timedelta(days=31),
            "capacity": 10,
            "creator": self.user
        }

        # Create multiple events with same basic details but different titles
        events = [
            Event.objects.create(title=f"Duplicate Event {i}", **base_event_data)
            for i in range(5)
        ]

        self.assertEqual(len(events), 5)
        self.assertTrue(all(event.title != events[0].title for event in events[1:]))

    @patch("events.semantic_search.text_to_vector", return_value=[0.1, 0.2, 0.3])
    def test_event_vector_is_generated_on_save(self, mock_vectorizer):
        """Test that event vectors are generated upon saving"""
        event = Event.objects.create(
            title="AI Workshop",
            category="Tech",
            city="Waterloo",
            location="Tech Hub",
            start_time=timezone.now() + timezone.timedelta(days=5),
            end_time=timezone.now() + timezone.timedelta(days=6),
            capacity=10,
            creator=self.user
        )
        event.save()
        self.assertIsNotNone(event.vector)

    def test_add_participant_raises_error_if_event_full(self):
        """Test add_participant() prevents overbooking"""
        event = Event.objects.create(
            title="Limited Seats",
            category="Networking",
            city="New York",
            location="Central Park",
            start_time=timezone.now() + timezone.timedelta(days=10),
            end_time=timezone.now() + timezone.timedelta(days=11),
            capacity=2,  # Small capacity to test the limit
            creator=self.user
        )

        user1 = User.objects.create(username="user1", email="user1@test.com")
        user2 = User.objects.create(username="user2", email="user2@test.com")
        user3 = User.objects.create(username="user3", email="user3@test.com")

        event.add_participant(user1)
        event.add_participant(user2)

        with self.assertRaises(ValidationError):
            event.add_participant(user3)  # This should raise an error

    def test_event_vector_set_to_none_when_text_is_empty(self):
        """Test that vector is set to None when title and description are both empty"""
        event = Event(
            title=" ",  # Space-only title (bypasses blank validation)
            category="Test",
            city="Test City",
            location="Test Location",
            description=" ",  # Space-only description
            start_time=timezone.now() + timezone.timedelta(days=5),
            end_time=timezone.now() + timezone.timedelta(days=6),
            capacity=10,
            creator=self.user
        )
        
        event.save()
        self.assertIsNone(event.vector)  # Ensure vector is None

class EventAPITestCase(APITestCase):
    def setUp(self):
        # Create users
        self.user1 = User.objects.create(username="eventcreator", email="creator@test.com")
        self.user2 = User.objects.create(username="eventjoiner", email="joiner@test.com")
        
        # Authenticate user1
        self.client.force_authenticate(user=self.user1)

        # Create a test event
        self.event = Event.objects.create(
            title="Test Event",
            category="Test Category",
            city="Test City",
            location="Test Location",
            start_time=timezone.now() + timezone.timedelta(days=30),
            end_time=timezone.now() + timezone.timedelta(days=31),
            capacity=10,
            creator=self.user1
        )

    def test_create_event_success(self):
        """Test successful event creation."""
        url = reverse('create_event')
        data = {
            'title': 'New Test Event',
            'category': 'Technology',
            'city': 'San Francisco',
            'location': 'Conference Center',
            'start_time': timezone.now() + timezone.timedelta(days=45),
            'end_time': timezone.now() + timezone.timedelta(days=46),
            'capacity': 20
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Test Event')
        self.assertEqual(response.data['creator'], self.user1.id)

    def test_create_event_missing_fields(self):
        """Test event creation with missing required fields."""
        url = reverse('create_event')
        data = {
            'title': 'Incomplete Event',
            # Missing required fields
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_event_detail(self):
        """Test retrieving event details."""
        url = reverse('event_detail', kwargs={'pk': self.event.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Event')

    def test_update_event_by_creator(self):
        """Test updating an event by its creator."""
        url = reverse('event_detail', kwargs={'pk': self.event.id})
        data = {
            'title': 'Updated Event Title',
            'capacity': 15
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Event Title')
        self.assertEqual(response.data['capacity'], 15)

    def test_update_event_by_non_creator(self):
        """Test preventing event update by a non-creator."""
        # Authenticate user2
        self.client.force_authenticate(user=self.user2)
        
        url = reverse('event_detail', kwargs={'pk': self.event.id})
        data = {
            'title': 'Unauthorized Update'
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_event_by_creator(self):
        """Test deleting an event by its creator."""
        url = reverse('event_detail', kwargs={'pk': self.event.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_event_by_non_creator(self):
        """Test preventing event deletion by a non-creator."""
        # Authenticate user2
        self.client.force_authenticate(user=self.user2)
        
        url = reverse('event_detail', kwargs={'pk': self.event.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_event_success(self):
        """Test successfully joining an event."""
        # Authenticate user2
        self.client.force_authenticate(user=self.user2)
        
        url = reverse('join_event', kwargs={'pk': self.event.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh event from database
        updated_event = Event.objects.get(id=self.event.id)
        self.assertEqual(updated_event.attendance, 1)
        self.assertTrue(self.user2 in updated_event.participants.all())

    def test_join_event_already_joined(self):
        """Test attempting to join an event already joined."""
        # First join the event
        self.event.participants.add(self.user2)
        self.event.attendance = 1
        self.event.save()

        # Authenticate user2
        self.client.force_authenticate(user=self.user2)
        
        url = reverse('join_event', kwargs={'pk': self.event.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_join_full_event(self):
        """Test attempting to join a full event."""
        # Fill the event to capacity
        for i in range(10):
            user = User.objects.create(username=f'user{i}', email=f'user{i}@test.com')
            self.event.participants.add(user)
        
        self.event.attendance = 10
        self.event.save()

        # Attempt to join as another user
        new_user = User.objects.create(username='newuser', email='newuser@test.com')
        self.client.force_authenticate(user=new_user)

        url = reverse('join_event', kwargs={'pk': self.event.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_leave_event_success(self):
        """Test successfully leaving an event."""
        # First join the event
        self.event.participants.add(self.user2)
        self.event.attendance = 1
        self.event.save()

        # Authenticate user2
        self.client.force_authenticate(user=self.user2)

        url = reverse('leave_event', kwargs={'pk': self.event.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh event from database
        updated_event = Event.objects.get(id=self.event.id)
        self.assertEqual(updated_event.attendance, 0)
        self.assertFalse(self.user2 in updated_event.participants.all())

    def test_leave_event_not_joined(self):
        """Test attempting to leave an event not joined."""
        # Authenticate user2
        self.client.force_authenticate(user=self.user2)

        url = reverse('leave_event', kwargs={'pk': self.event.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_user_created_events(self):
        """Test listing events created by the current user."""
        # Create multiple events
        for i in range(3):
            Event.objects.create(
                title=f'Created Event {i}',
                category='Test',
                city='Test City',
                location='Test Location',
                start_time=timezone.now() + timezone.timedelta(days=30+i),
                end_time=timezone.now() + timezone.timedelta(days=31+i),
                capacity=10,
                creator=self.user1
            )

        url = reverse('list_user_created_events')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)  # 3 new + 1 from setUp

    def test_list_user_joined_events(self):
        """Test listing events joined by the current user."""
        # Create events and join some
        events = [
            Event.objects.create(
                title=f'Joined Event {i}',
                category='Test',
                city='Test City',
                location='Test Location',
                start_time=timezone.now() + timezone.timedelta(days=30+i),
                end_time=timezone.now() + timezone.timedelta(days=31+i),
                capacity=10,
                creator=User.objects.create(username=f'creator{i}', email=f'creator{i}@test.com')
            ) for i in range(3)
        ]

        # Join two events
        for event in events[:2]:
            event.participants.add(self.user2)
            event.attendance += 1
            event.save()

        # Authenticate user2
        self.client.force_authenticate(user=self.user2)

        url = reverse('list_user_joined_events')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_random_events(self):
        """Test fetching random events."""
        # Create multiple events
        for i in range(30):
            Event.objects.create(
                title=f'Random Event {i}',
                category='Test',
                city='Test City',
                location='Test Location',
                start_time=timezone.now() + timezone.timedelta(days=30+i),
                end_time=timezone.now() + timezone.timedelta(days=31+i),
                capacity=10,
                creator=User.objects.create(username=f'randomuser{i}', email=f'randomuser{i}@test.com')
            )

        # Remove authentication
        self.client.force_authenticate(user=None)

        url = reverse('random_events')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) <= 20)
    
    def test_get_non_existent_event_detail(self):
        url = reverse('event_detail', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_event_by_non_creator(self):
        self.client.force_authenticate(user=self.user2)
        url = reverse('event_detail', kwargs={'pk': self.event.id})
        data = {'title': 'Unauthorized Update'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_event_already_full(self):
        user3 = User.objects.create(username="user3", email="user3@test.com")
        self.event.participants.add(self.user2, user3)
        self.event.attendance = 10
        self.event.save()
        
        self.client.force_authenticate(user=User.objects.create(username="user4", email="user4@test.com"))
        url = reverse('join_event', kwargs={'pk': self.event.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_search_events_missing_city(self):
        url = reverse('search_events')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_filter_events_invalid_key(self):
        url = reverse('filter_events') + "?key=invalid&name=value"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cancel_event_by_non_creator(self):
        self.client.force_authenticate(user=self.user2)
        url = reverse('cancel_event', kwargs={'pk': self.event.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cancel_event_and_reactivate(self):
        url = reverse('cancel_event', kwargs={'pk': self.event.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        url = reverse('cancel_event', kwargs={'pk': self.event.id}) + "?reverse=true"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_improve_description_missing_title(self):
        url = reverse('improve_description')
        response = self.client.post(url, data={})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_improve_description_with_title_only(self):
        url = reverse('improve_description')
        data = {'title': 'AI Workshop'}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])

class EventFormTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser", email="test@example.com")
        self.event = Event.objects.create(
            title="Test Event",
            category="Test",
            city="Test City",
            location="Test Location",
            start_time=timezone.now() + timezone.timedelta(days=1),
            end_time=timezone.now() + timezone.timedelta(days=2),
            capacity=10,
            creator=self.user
        )

    def test_valid_profile_image_form(self):
        """Test ProfileImageForm with a valid image file"""

        def generate_test_image():
            """Create a small in-memory image for testing."""
            img_io = io.BytesIO()
            image = Image.new("RGB", (100, 100), color=(255, 0, 0))  # Red image
            image.save(img_io, format="JPEG")
            img_io.seek(0)  # Reset file pointer
            return SimpleUploadedFile("test_image.jpg", img_io.read(), content_type="image/jpeg")

        image = generate_test_image()
        form = ProfileImageForm(data={}, files={"event_image": image}, instance=self.event)
        self.assertTrue(form.is_valid())

    def test_invalid_profile_image_form(self):
        """Test ProfileImageForm with an invalid file type"""
        invalid_file = SimpleUploadedFile("test.txt", b"file_content", content_type="text/plain")
        form = ProfileImageForm(data={}, files={"event_image": invalid_file}, instance=self.event)
        self.assertFalse(form.is_valid())

class SemanticSearchTestCase(TestCase):
    def test_preprocess_text_empty_string(self):
        """Test preprocess_text with an empty string"""
        self.assertEqual(preprocess_text(""), "")

    def test_preprocess_text_stopwords_only(self):
        """Test preprocess_text with only stopwords"""
        self.assertEqual(preprocess_text("the and of"), "")

    def test_preprocess_text_punctuation_and_case(self):
        """Test preprocess_text handles punctuation and mixed case"""
        self.assertEqual(preprocess_text("Hello, WORLD!"), "hello world")

    def test_text_to_vector_normal_case(self):
        """Test text_to_vector produces a valid vector"""
        vector = text_to_vector("This is a test sentence.")
        self.assertEqual(len(vector), 384)  # Assuming model returns 384-dim vectors
        self.assertIsInstance(vector, list)

    def test_text_to_vector_empty_string(self):
        """Test text_to_vector with an empty string"""
        vector = text_to_vector("")
        self.assertEqual(len(vector), 384)  # Should still return a valid vector

    def test_compute_similarities_empty_list(self):
        """Test compute_similarities with an empty event vector list"""
        query_vec = np.random.rand(384)  # Simulate a random query vector
        
        # Expect ValueError because cosine_similarity does not support empty inputs
        with self.assertRaises(ValueError):
            compute_similarities(query_vec, [])

    def test_compute_similarities_identical_vectors(self):
        """Test compute_similarities when all event vectors are identical"""
        query_vec = np.random.rand(384)
        event_vecs = [query_vec.tolist()] * 5  # 5 identical vectors

        similarities = compute_similarities(query_vec, event_vecs)

        # Use np.isclose to handle floating-point precision issues
        self.assertTrue(all(np.isclose(sim, 1.0, atol=1e-6) for sim in similarities))

class EventSerializerTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create(username="testuser", email="test@example.com")
        self.future_time = timezone.now() + timezone.timedelta(days=5)

        # Event 1: Active (not full, not expired)
        self.active_event = Event.objects.create(
            title="Active Event",
            category="Test",
            city="Test City",
            location="Test Location",
            start_time=self.future_time,
            end_time=self.future_time + timezone.timedelta(days=1),
            capacity=10,
            attendance=5,
            creator=self.user
        )

        # Event 2: Full (at capacity, not expired)
        self.full_event = Event.objects.create(
            title="Full Event",
            category="Test",
            city="Test City",
            location="Test Location",
            start_time=self.future_time,
            end_time=self.future_time + timezone.timedelta(days=1),
            capacity=5,
            attendance=5,  # Full capacity
            creator=self.user
        )

        # Event 3: Expired (past end_time) - Create with a future start time, then manually update to the past
        self.expired_event = Event.objects.create(
            title="Expired Event",
            category="Test",
            city="Test City",
            location="Test Location",
            start_time=timezone.now() + timezone.timedelta(days=1),  # Temporary valid start_time
            end_time=timezone.now() + timezone.timedelta(days=2),
            capacity=10,
            attendance=2,
            creator=self.user
        )

        # Manually update start_time to the past without triggering validation
        Event.objects.filter(id=self.expired_event.id).update(
            start_time=timezone.now() - timezone.timedelta(days=10),
            end_time=timezone.now() - timezone.timedelta(days=5)
        )

        # Event 4: With Image
        self.image_event = Event.objects.create(
            title="Image Event",
            category="Test",
            city="Test City",
            location="Test Location",
            start_time=self.future_time,
            end_time=self.future_time + timezone.timedelta(days=1),
            capacity=10,
            creator=self.user
        )
        self.image_event.event_image = SimpleUploadedFile(
            "test.jpg", b"file_content", content_type="image/jpeg"
        )
        self.image_event.save()

    def test_get_status_active(self):
        """Test that get_status returns 'active' for an event that is not full or expired"""
        serializer = EventSerializer(self.active_event)
        self.assertEqual(serializer.get_status(self.active_event), "active")

    def test_get_status_full(self):
        """Test that get_status returns 'full' for an event that is at capacity but not expired"""
        serializer = EventSerializer(self.full_event)
        self.assertEqual(serializer.get_status(self.full_event), "full")

    def test_get_status_expired(self):
        """Test that get_status returns 'expire' for an event that has ended"""
        
        # Refresh from DB to ensure updated values are used
        self.expired_event.refresh_from_db()

        serializer = EventSerializer(self.expired_event)
        self.assertEqual(serializer.get_status(self.expired_event), "expire")

    def test_get_event_image_url_with_request(self):
        """Test that get_event_image_url returns full URL when request is provided"""
        mock_request = Mock()
        mock_request.build_absolute_uri = lambda url: f"http://testserver{url}"

        serializer = EventSerializer(self.image_event, context={"request": mock_request})
        self.assertEqual(
            serializer.get_event_image_url(self.image_event),
            f"http://testserver{self.image_event.event_image.url}"
        )

    def test_get_event_image_url_without_request(self):
        """Test that get_event_image_url returns relative URL when no request is provided"""
        serializer = EventSerializer(self.image_event)
        self.assertEqual(serializer.get_event_image_url(self.image_event), self.image_event.event_image.url)

    def test_get_event_image_url_no_image(self):
        """Test that get_event_image_url returns None when event has no image"""
        serializer = EventSerializer(self.active_event)  # This event has no image
        self.assertIsNone(serializer.get_event_image_url(self.active_event))
