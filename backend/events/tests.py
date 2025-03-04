import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import Event
from .serializers import EventSerializer

User = get_user_model()

class EventModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser1', email='test1@email.com', facebook_id='1')
        self.event = Event.objects.create(
            title='Test Event',
            category='Music',
            city='Test City',
            location='Test Location',
            start_time=timezone.now(),
            end_time=timezone.now() + timezone.timedelta(hours=2),
            capacity=10,
            creator=self.user
        )

    def test_event_creation(self):
        self.assertEqual(self.event.title, 'Test Event')
        self.assertEqual(self.event.capacity, 10)
        self.assertEqual(self.event.creator, self.user)

    def test_event_string_representation(self):
        self.assertEqual(str(self.event), 'Test Event')

class EventSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser2', email='test2@email.com', facebook_id='2')
        self.event = Event.objects.create(
            title='Test Event',
            category='Music',
            city='Test City',
            location='Test Location',
            start_time=timezone.now(),
            end_time=timezone.now() + timezone.timedelta(hours=2),
            capacity=10,
            creator=self.user
        )

    def test_event_serialization(self):
        serializer = EventSerializer(self.event)
        self.assertEqual(serializer.data['title'], 'Test Event')
        self.assertEqual(serializer.data['capacity'], 10)

    def test_event_status_logic(self):
        self.event.attendance = 5
        serializer = EventSerializer(self.event)
        self.assertEqual(serializer.data['status'], 'active')

@pytest.mark.django_db
class TestEventAPI:
    def setup_method(self):
        """Set up test client and create a user and event."""
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser3', email='test3@email.com', facebook_id='3')
        self.client.force_authenticate(user=self.user)  # Authenticate user for requests

        self.event = Event.objects.create(
            title='Test Event',
            category='Music',
            city='Test City',
            location='Test Location',
            start_time=timezone.now(),
            end_time=timezone.now() + timezone.timedelta(hours=2),
            capacity=10,
            creator=self.user
        )

    def test_list_user_created_events(self):
        """Test retrieving the list of events created by the user."""
        response = self.client.get('/events/created/')
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_create_event(self):
        """Test creating a new event."""
        event_data = {
            'title': 'New Event',
            'category': 'Sports',
            'city': 'New City',
            'location': 'New Location',
            'start_time': timezone.now().isoformat(),
            'end_time': (timezone.now() + timezone.timedelta(hours=2)).isoformat(),
            'capacity': 20,
        }
        response = self.client.post('/events/new/', event_data, format='json')
        assert response.status_code == 201
        assert Event.objects.count() == 2

    def test_join_event(self):
        """Test a user joining an event."""
        response = self.client.post(f'/events/{self.event.id}/join/')
        assert response.status_code == 200
        assert self.event.participants.count() == 1

    def test_leave_event(self):
        """Test a user leaving an event."""
        self.event.participants.add(self.user)  # Add user to event before leaving
        response = self.client.post(f'/events/{self.event.id}/leave/')
        assert response.status_code == 200
        assert self.event.participants.count() == 0
