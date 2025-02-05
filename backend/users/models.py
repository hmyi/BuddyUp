from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    # Store user facebook id
    facebook_id = models.CharField(max_length=100, unique=True, null=True, blank=True)

    def __str__(self):
        return self.username