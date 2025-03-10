from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'creator', 'capacity', 'attendance', 'start_time', 'end_time')
