from django.db import models
from django.conf import settings

from django.contrib.auth import get_user_model
from .semantic_search import text_to_vector

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
    
    vector = models.JSONField(null=True, blank=True)
    cancelled = models.BooleanField(default=False)

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

    def save(self, *args, **kwargs):
        combined_text = f"{self.title} {self.description}".strip()
        if combined_text:
            self.vector = text_to_vector(combined_text)
        else:
            self.vector = None
        super().save(*args, **kwargs)
