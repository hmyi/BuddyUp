from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.db.models import Count
import random
from .models import Event
from .serializers import EventSerializer


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_user_created_events(request):
    """
    GET: Return all events created by current user
    """
    events = Event.objects.filter(creator=request.user)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_user_joined_events(request):
    """
    GET: Return all events joined by current user
    """
    events = request.user.joined_events.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_event(request):
    """
    POST: Create a new event
    """
    data = request.data.copy()
    data['creator'] = request.user.id
    serializer = EventSerializer(data=data)
    if serializer.is_valid():
        event = serializer.save(creator=request.user)
        return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def event_detail(request, pk):
    """
    GET: Get detail of an event
    PUT: Update an event (full)
    PATCH: Update an event (partial)
    DELETE: Delete an event
    """
    event = get_object_or_404(Event, pk=pk)

    if request.method == 'GET':
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method in ['PUT', 'PATCH']:
        # Edit is only allowed for event creator
        if event.creator != request.user:
            return Response({"error": "No permission to edit this event."},
                            status=status.HTTP_403_FORBIDDEN)

        partial = (request.method == 'PATCH')
        serializer = EventSerializer(event, data=request.data, partial=partial)
        if serializer.is_valid():
            updated_event = serializer.save()
            return Response(EventSerializer(updated_event).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Delete is only allowed for event creator
        if event.creator != request.user:
            return Response({"error": "No permission to delete this event."},
                            status=status.HTTP_403_FORBIDDEN)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_event(request, pk):
    """
    User wants to join an event
    - Check if the user already joined
    - Check attendance and capacity
    """
    event = get_object_or_404(Event, pk=pk)

    # Event is full
    if event.attendance >= event.capacity:
        return Response({"error": "The event is already at full capacity."},
                        status=status.HTTP_400_BAD_REQUEST)

    # If the user already joined
    if event.participants.filter(pk=request.user.pk).exists():
        return Response({"error": "You have already joined this event."},
                        status=status.HTTP_400_BAD_REQUEST)

    event.participants.add(request.user)
    event.attendance = event.participants.count()
    event.save()

    return Response({"message": "Successfully joined the event."},
                    status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def leave_event(request, pk):
    """
    User wants to leave an event
    - Check if the user is a participant
    """
    event = get_object_or_404(Event, pk=pk)

    # If user is not in participants
    if not event.participants.filter(pk=request.user.pk).exists():
        return Response({"error": "You are not a participant of this event."},
                        status=status.HTTP_400_BAD_REQUEST)

    event.participants.remove(request.user)
    event.attendance = event.participants.count()
    event.save()

    return Response({"message": "Successfully left the event."},
                    status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def random_events(request):
    """
    GET: Return up to 20 random events from the database
    """
    total_count = Event.objects.count()
    if total_count <= 20:
        events = Event.objects.all()
    else:
        random_ids = random.sample(range(1, total_count + 1), 20)
        events = Event.objects.filter(pk__in=random_ids)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
