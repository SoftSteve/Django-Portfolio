from django.db import models

class AboutSection(models.Model):
    body = models.TextField()

    def __str__(self):
        return "Home Page About"
    

class Project(models.Model):
    title = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    
class ProjectContent(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='content_blocks')
    heading = models.CharField(max_length=255, blank=True)
    text = models.TextField(blank=True)
    image = models.ImageField(upload_to='static/assets/images', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Block {self.order} for {self.project.title}"