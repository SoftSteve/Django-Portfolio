# Generated by Django 5.1.7 on 2025-04-15 20:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projectvault', '0002_projects_projectcontent'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Projects',
            new_name='Project',
        ),
    ]
