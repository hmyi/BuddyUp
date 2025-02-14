from django.db import models
from django.conf import settings

from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField(blank=True)
    capacity = models.PositiveIntegerField()
    attendance = models.PositiveIntegerField(default=0)

    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_events'
    )

    participants = models.ManyToManyField(
        User,
        blank=True,
        related_name='joined_events'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
