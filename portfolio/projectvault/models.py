from django.db import models
from django.utils.text import slugify

class AboutSection(models.Model):
    body = models.TextField()

    def __str__(self):
        return "Home Page About"
    

class Project(models.Model):
    title = models.CharField(max_length=250)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='uploads/images', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    
class ProjectContent(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='content_blocks')
    heading = models.CharField(max_length=255, blank=True)
    text = models.TextField(blank=True)
    code = models.TextField(blank=True)
    images = models.ImageField(upload_to='uploads/images', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Section {self.order} for {self.project.title}"
    
class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_images')
    image = models.ImageField(upload_to='uploads/images', blank=True, null=True)
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.caption if self.caption else f'Image for {self.project.title}'