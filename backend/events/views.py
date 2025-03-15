from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Count
from django.db.models import Q
from django.utils import timezone
from django.conf import settings
import random
import numpy as np
import openai
from .models import Event
from .serializers import EventSerializer
from .semantic_search import text_to_vector, compute_similarities


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
    POST: Create a new event, including support for event_image upload.
    USE multipart/form-data
    """
    data = request.data.copy()
    data['creator'] = request.user.id
    serializer = EventSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        event = serializer.save(creator=request.user)
        return Response(EventSerializer(event, context={'request': request}).data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
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
        # Only event creator can edit
        if event.creator != request.user:
            return Response({"error": "No permission to edit this event."},
                            status=status.HTTP_403_FORBIDDEN)
        partial = (request.method == 'PATCH')
        serializer = EventSerializer(event, data=request.data, partial=partial, context={'request': request})
        if serializer.is_valid():
            updated_event = serializer.save()
            return Response(EventSerializer(updated_event, context={'request': request}).data, status=status.HTTP_200_OK)
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

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_events(request):
    """
    GET:
      - city (necessary)
      - query (optional)
      - page (optional)
    """
    city = request.GET.get('city')
    if not city:
        return Response({"error": "Missing 'city' parameter"}, status=400)

    query = request.GET.get('query')
    events_qs = Event.objects.filter(city__iexact=city, start_time__gte=timezone.now())

    if not query:
        events_qs = events_qs.order_by('start_time')
        
        page_param = request.GET.get('page')
        if page_param is not None:
            try:
                page = int(page_param)
            except ValueError:
                return Response({"error": "Invalid page parameter"}, status=400)
            page_size = 20
            start_idx = page * page_size
            end_idx = (page + 1) * page_size
            events_qs = events_qs[start_idx:end_idx]
        
        serializer = EventSerializer(events_qs, many=True)
        return Response(serializer.data, status=200)
    else:
        query_vec = text_to_vector(query)
        
        valid_events = []
        vectors = []
        for e in events_qs:
            if e.vector:
                valid_events.append(e)
                vectors.append(e.vector)
        
        # Handle the case where no events have vectors
        if not valid_events:
            serializer = EventSerializer([], many=True)
            return Response(serializer.data, status=200)

        sims = compute_similarities(query_vec, vectors)
        event_sims = list(zip(valid_events, sims))
        event_sims.sort(key=lambda x: x[1], reverse=True)
        sorted_events = [pair[0] for pair in event_sims]

        page_param = request.GET.get('page')
        if page_param is not None:
            try:
                page = int(page_param)
            except ValueError:
                return Response({"error": "Invalid page parameter"}, status=400)
            page_size = 20
            start_idx = page * page_size
            end_idx = (page + 1) * page_size
            sorted_events = sorted_events[start_idx:end_idx]

        serializer = EventSerializer(sorted_events, many=True)
        return Response(serializer.data, status=200)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def filter_events(request):
    """
    GET:
      - key=city&name=Waterloo
      - key=category&name=Food
      - key=city&name=Waterloo&key=category&name=Outdoor&page=0

      - The key and name must appear in pairs and in equal numbers; otherwise, a 400 error is thrown.
      - For each pair (key_i, name_i), both must be satisfied (logical AND).
      - By default, sorting is done in ascending order by start_time.
      - Acceptable keys are category, city, status (active or full).
      - Page is optional.
    """

    keys = request.GET.getlist('key', [])
    names = request.GET.getlist('name', [])

    if len(keys) != len(names):
        return Response({"error": "The number of 'key' and 'name' parameters must match."},
                        status=status.HTTP_400_BAD_REQUEST)
    if not keys and not names:
        return Response({"error": "At least one pair of (key, name) is required."},
                        status=status.HTTP_400_BAD_REQUEST)

    qs = Event.objects.filter(start_time__gte=timezone.now())

    for k, v in zip(keys, names):
        
        k_lower = k.lower()
        v_lower = v.lower()
        
        if k_lower == "city":
            qs = qs.filter(city__iexact=v)
        elif k_lower == "category":
            qs = qs.filter(category__iexact=v)
        elif k_lower == "status":
            # status => active/full
            if v_lower == "active":
                qs = qs.filter(attendance__lt=models.F('capacity'))
            elif v_lower == "full":
                qs = qs.filter(attendance__gte=models.F('capacity'))
            else:
                return Response({"error": f"Unsupported status value: {v}. Allowed: active, full."},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": f"Unsupported key: {k}. Allowed keys: city, category."},
                            status=status.HTTP_400_BAD_REQUEST)

    qs = qs.order_by('start_time')

    page_param = request.GET.get('page')
    if page_param is not None:
        try:
            page = int(page_param)
        except ValueError:
            return Response({"error": "Invalid page parameter"}, status=status.HTTP_400_BAD_REQUEST)

        page_size = 20
        start_idx = page * page_size
        end_idx = (page + 1) * page_size
        qs = qs[start_idx:end_idx]

    serializer = EventSerializer(qs, many=True)
    return Response(serializer.data, status=200)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_event(request, pk):
    """
    POST /api/events/<pk>/cancel/
    POST /api/events/<pk>/cancel/?reverse=true
    """
    event = get_object_or_404(Event, pk=pk)

    if event.creator != request.user:
        return Response({"error": "No permission to cancel this event."},
                        status=status.HTTP_403_FORBIDDEN)

    reverse_param = request.query_params.get('reverse', '').lower()
    if reverse_param == 'true':
        event.cancelled = False
        event.save()
        return Response({"message": f"Event {pk} activated."},
                        status=status.HTTP_200_OK)
    else:
        event.cancelled = True
        event.save()
        return Response({"message": f"Event {pk} cancelled."},
                        status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def improve_description(request):
    """
    POST /api/events/improve/
    Body JSON: {'title': 'xxx', 'description': 'xxx'}

      - If description is empty, provide only title to ChatGPT
      - If not, provide title + description
    """
    data = request.data
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()

    if not title:
        return Response({"error": "Missing 'title' or title is empty"}, status=status.HTTP_400_BAD_REQUEST)

    if description:
        user_prompt = (
            "I'm organizing an event. "
            "Here is the event title and a rough description. Please rewrite the description to make it more appealing, the description should be about 3 sentences long:\n\n"
            f"Title: {title}\n"
            f"Description: {description}\n"
        )
    else:
        user_prompt = (
            "I'm organizing an event. "
            "I only have an event title so far. Please propose a good description for it, the description should be about 3 sentences long:\n\n"
            f"Title: {title}\n"
        )

    try:
        openai.api_key = settings.OPENAI_API_KEY

        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[
                {"role": "system", "content": "You are a helpful writing assistant."},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        improved_text = response['choices'][0]['message']['content'].strip()

        return Response({"improved_description": improved_text}, status=status.HTTP_200_OK)

    except openai.error.OpenAIError as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
