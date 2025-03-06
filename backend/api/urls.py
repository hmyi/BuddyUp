from django.urls import path
from .views import facebook_login, participants_to_usernames, upload_profile_image

urlpatterns = [
    path('auth/facebook/', facebook_login, name='facebook_login'),
    path('users/idtoname/', participants_to_usernames, name='participants_to_usernames'),
    path('users/upload-profile-image/', upload_profile_image, name='upload-profile-image'),
]