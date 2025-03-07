import requests
import jwt
from datetime import datetime, timezone, timedelta
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from users.serializers import ProfileImageSerializer
from users.models import User
from django.shortcuts import render
from django.core.files.base import ContentFile
import os

# Create your views here.
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def facebook_login(request):
    # 1. Get Facebook access token from frontend
    access_token = request.data.get('access_token')
    if not access_token:
        return Response({'error': 'Missing Facebook access token'}, status=400)
    
    # 2. Verify token with Facebook debug_token
    app_access_token = f"{settings.FACEBOOK_APP_ID}|{settings.FACEBOOK_APP_SECRET}"
    debug_url = f"https://graph.facebook.com/debug_token?input_token={access_token}&access_token={app_access_token}"
    debug_response = requests.get(debug_url)
    if debug_response.status_code != 200:
        return Response({'error': 'Cannot verify Facebook token'}, status=400)
    
    debug_data = debug_response.json()
    if not debug_data.get('data', {}).get('is_valid'):
        return Response({'error': 'Invalid Facebook token'}, status=400)
    
    facebook_user_id = debug_data.get('data', {}).get('user_id')
    
    # 3. Use Facebook Graph API to get user information
    user_info_url = f"https://graph.facebook.com/{facebook_user_id}?fields=id,first_name,last_name,name,email,picture.type(large)&access_token={access_token}"
    user_info_response = requests.get(user_info_url)
    if user_info_response.status_code != 200:
        return Response({'error': 'Cannot get Facebook user information'}, status=400)
    
    user_info = user_info_response.json()
    email = user_info.get('email')
    if not email:
        email = "dummy@dummy.com"
    name = user_info.get('name')
    first_name = user_info.get('first_name', '')  # Default empty string
    last_name = user_info.get('last_name', '')    # Default empty string
    avatar_url = user_info.get("picture", {}).get("data", {}).get("url")
    
    # 4. Look up or create user
    try:
        user = User.objects.get(facebook_id=facebook_user_id)
        # Update user fields if they exist in the response
        if email and not user.email:
            user.email = email
        if name and not user.username:
            user.username = name
        if first_name and not user.first_name:
            user.first_name = first_name
        if last_name and not user.last_name:
            user.last_name = last_name
        user.save()
    except User.DoesNotExist:
        user = None
        if email:
            try:
                user = User.objects.get(email=email)
                user.facebook_id = facebook_user_id
                user.save()
            except User.DoesNotExist:
                user = None
        
        # If user not found, create a new user
        if not user:
            username = name if name else f"fb_{facebook_user_id}"
            # Ensure first_name and last_name are never null
            user = User.objects.create(
                username=username,
                email=email if email else f"{facebook_user_id}@facebook.user",  # Ensure email is never null
                facebook_id=facebook_user_id,
                first_name=first_name if first_name else "Facebook",
                last_name=last_name if last_name else "User",
            )
            user.set_unusable_password()
            user.save()
    
    # 5. If Facebook gives avatar_url，download image and save as user profile_image
    if avatar_url and not user.profile_image:
        try:
            avatar_response = requests.get(avatar_url)
            if avatar_response.status_code == 200:
                ext = os.path.splitext(avatar_url)[-1]
                if not ext:
                    ext = ".jpg"
                filename = f"{facebook_user_id}_avatar{ext}"
                user.profile_image.save(filename, ContentFile(avatar_response.content), save=True)
        except Exception as e:
            print("Error fetching avatar image:", e)
    
    # 6. Use SimpleJWT to generate JWT
    refresh = RefreshToken.for_user(user)
    refresh['username'] = user.username
    refresh['first_name'] = user.first_name
    refresh['last_name'] = user.last_name
    refresh['email'] = user.email
    
    profile_image_url = request.build_absolute_uri(user.profile_image.url) if user.profile_image else None
    
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    return Response({
        "access": access_token,
        "refresh": refresh_token,
        "profile_image_url": profile_image_url
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def participants_to_usernames(request):
    """
    GET: Receives a list of user IDs in query params and returns their corresponding usernames.
    """
    # Fix: Get data from query params instead of request.data for GET request
    participant_ids_param = request.GET.get('participants', '')
    
    # Parse comma-separated IDs
    if not participant_ids_param:
        return Response({"error": "'participants' should not be empty"}, status=400)
    
    participant_ids = [int(id_str) for id_str in participant_ids_param.split(',') if id_str]
    
    if not participant_ids:
        return Response({"error": "'participants' should not be empty"}, status=400)
    
    usernames = []
    for user_id in participant_ids:
        try:
            user = User.objects.get(pk=user_id)
            usernames.append(user.username)
        except User.DoesNotExist:
            usernames.append(None)

    return Response({"usernames": usernames}, status=200)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_profile_image(request):
    """
    Allow authenticated user to update profile_image
    Upload as multipart/form-data
    """
    serializer = ProfileImageSerializer(instance=request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)