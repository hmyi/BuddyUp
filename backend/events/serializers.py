from rest_framework import serializers
from django.utils import timezone
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Event
        read_only_fields = ('creator', 'created_at', 'updated_at', 'participants',)
        exclude = ['vector']

    def get_status(self, obj):
        """
          1) If attendance < capacity AND now < end_time => 'active'
          2) If attendance >= capacity AND now < end_time => 'full'
          3) If now >= end_time => 'expire'
        """
        now = timezone.now()
        if now < obj.end_time:
            if obj.attendance < obj.capacity:
                return 'active'
            else:
                return 'full'
        else:
            return 'expire'
