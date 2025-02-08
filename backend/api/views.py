import requests
import jwt
from datetime import datetime, timezone, timedelta
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from users.models import User
from django.shortcuts import render

# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
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
    name = user_info.get('name')
    first_name = user_info.get('first_name')
    last_name = user_info.get('last_name')
    avatar_url = user_info.get("picture", {}).get("data", {}).get("url")
    
    # 4. Look up or create user
    try:
        user = User.objects.get(facebook_id=facebook_user_id)
        if email:
            user.email = user.email if user.email else email
        if name:
            user.username = user.username if user.username else name
        if first_name:
            user.first_name = user.first_name if user.first_name else first_name
        if last_name:
            user.last_name = user.last_name if user.last_name else last_name
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
            user = User.objects.create(
                username=username,
                email=email,
                facebook_id=facebook_user_id,
                first_name = first_name,
                last_name = last_name,
            )
            user.set_unusable_password()
            user.save()
    
    # 5. Use SimpleJWT to generate JWT
    refresh = RefreshToken.for_user(user)
    refresh['username'] = user.username
    refresh['first_name'] = user.first_name
    refresh['last_name'] = user.last_name
    refresh['email'] = user.email
    if avatar_url:
        refresh['avatar_url'] = avatar_url
    
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    return Response({
        "access": access_token,
        "refresh": refresh_token
    })
