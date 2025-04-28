from django.contrib import admin
from .models import AboutSection, Project, ProjectContent, ProjectImage

admin.site.register(AboutSection)

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1  
    fields = ('image', 'caption')

class ProjectContentInline(admin.StackedInline):
    model = ProjectContent
    extra = 1
    fields = ('heading', 'text', 'code', 'order')
    ordering = ('order',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    inlines = [ProjectContentInline, ProjectImageInline]
    search_fields = ('title',)
    ordering = ('-created_at',)
