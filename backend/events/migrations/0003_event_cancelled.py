# Generated by Django 5.1.5 on 2025-02-27 04:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_event_vector'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='cancelled',
            field=models.BooleanField(default=False),
        ),
    ]
