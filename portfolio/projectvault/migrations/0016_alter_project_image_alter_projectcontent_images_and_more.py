# Generated by Django 5.1.7 on 2025-04-30 13:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("projectvault", "0015_rename_projectimages_projectimage"),
    ]

    operations = [
        migrations.AlterField(
            model_name="project",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="uploads/images"),
        ),
        migrations.AlterField(
            model_name="projectcontent",
            name="images",
            field=models.ImageField(blank=True, null=True, upload_to="uploads/images"),
        ),
        migrations.AlterField(
            model_name="projectimage",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="uploads/images"),
        ),
    ]
