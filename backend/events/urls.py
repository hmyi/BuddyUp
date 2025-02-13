from django.urls import path
from .views import (
    list_user_created_events, 
    list_user_joined_events, 
    create_event, 
    event_detail, 
    join_event, 
    leave_event,
    random_events,
)



urlpatterns = [
    path('created/', list_user_created_events, name='list_user_created_events'),
    path('joined/', list_user_joined_events, name='list_user_joined_events'),
    path('new/', create_event, name='create_event'),
    path('<int:pk>/', event_detail, name='event_detail'),
    path('<int:pk>/join/', join_event, name='join_event'),
    path('<int:pk>/leave/', leave_event, name='leave_event'),
    path('fetch/random/', random_events, name='random_events'),
]