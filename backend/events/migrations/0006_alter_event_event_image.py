# Generated by Django 5.1.5 on 2025-03-08 05:03

import storages.backends.s3
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0005_event_event_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_image',
            field=models.ImageField(blank=True, null=True, storage=storages.backends.s3.S3Storage(), upload_to='event_images/'),
        ),
    ]
