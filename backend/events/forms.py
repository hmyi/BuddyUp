from django import forms
from .models import Event

class ProfileImageForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ['event_image']
