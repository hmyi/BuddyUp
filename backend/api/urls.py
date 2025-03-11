from django.urls import path
from .views import facebook_login, participants_to_usernames, upload_profile_image, user_profile, update_profile_details

urlpatterns = [
    path('auth/facebook/', facebook_login, name='facebook_login'),
    path('users/idtoname/', participants_to_usernames, name='participants_to_usernames'),
    path('users/upload-profile-image/', upload_profile_image, name='upload-profile-image'),
    path('users/<int:pk>/', user_profile, name='user_profile'),
    path('users/update/', update_profile_details, name='update_profile_details'),
]