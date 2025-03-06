from rest_framework import serializers
from django.utils import timezone
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    event_image_url = serializers.SerializerMethodField()  # 新增字段

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

    def get_event_image_url(self, obj):
        if obj.event_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.event_image.url)
            return obj.event_image.url
        return None