from django.urls import path
from .views import facebook_login, participants_to_usernames

urlpatterns = [
    path('auth/facebook/', facebook_login, name='facebook_login'),
    path('users/idtoname/', participants_to_usernames, name='participants_to_usernames')
]