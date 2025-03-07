from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth import get_user_model
from .semantic_search import text_to_vector
from storages.backends.s3boto3 import S3Boto3Storage

User = get_user_model()

class Event(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField(blank=True)
    capacity = models.PositiveIntegerField(help_text="Capacity must be greater than zero")
    attendance = models.PositiveIntegerField(default=0)
    event_image = models.ImageField(upload_to='event_images/', storage=S3Boto3Storage(), null=True, blank=True)
    
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

    def clean(self):
        """
        Validate event constraints:
        1. Capacity must be greater than zero
        2. End time must be after start time
        3. Start time must be in the future
        4. Participants cannot exceed capacity
        """
        # Validate capacity
        if self.capacity <= 0:
            raise ValidationError("Event capacity must be greater than zero.")

        # Validate time consistency
        if self.end_time <= self.start_time:
            raise ValidationError("Event end time must be after start time.")

        # Validate start time is in the future
        if self.start_time <= timezone.now():
            raise ValidationError("Event start time must be in the future.")

    def add_participant(self, user):
        """
        Controlled method to add a participant with capacity check
        """
        if self.participants.count() >= self.capacity:
            raise ValidationError(f"Event has reached its maximum capacity of {self.capacity}")
        
        if not self.participants.filter(pk=user.pk).exists():
            self.participants.add(user)
            self.attendance = self.participants.count()
            self.save()

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.full_clean()
        combined_text = f"{self.title} {self.description}".strip()
        if combined_text:
            self.vector = text_to_vector(combined_text)
        else:
            self.vector = None
        super().save(*args, **kwargs)
