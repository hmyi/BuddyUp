from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from storages.backends.s3boto3 import S3Boto3Storage

# Create your models here.
class User(AbstractUser):
    # Store user facebook id
    facebook_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', storage=S3Boto3Storage(), null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    interests = models.TextField(null=True, blank=True)

    def clean(self):
        """Ensure Facebook ID does not exceed max_length."""
        if self.facebook_id and len(self.facebook_id) > 100:
            raise ValidationError("Facebook ID cannot exceed 100 characters.")
    
    def __str__(self):
        return self.username