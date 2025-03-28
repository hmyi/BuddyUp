from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "profile_image", "location", "bio", "interests"]
        read_only_fields = ["id", "username"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        
        if not (instance.show_email or (request and request.user == instance)):
            data.pop('email', None)
            
        return data