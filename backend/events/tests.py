from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from events.models import Event
from events.serializers import EventSerializer
import random

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