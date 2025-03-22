from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "profile_image", "location", "bio", "interests"]
        read_only_fields = ["id", "username"]
