from django.urls import path
from .views import facebook_login

urlpatterns = [
    path('auth/facebook/', facebook_login, name='facebook_login'),
]