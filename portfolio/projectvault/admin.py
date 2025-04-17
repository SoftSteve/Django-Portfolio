from django.contrib import admin
from .models import AboutSection, Project, ProjectContent

admin.site.register(AboutSection)

class ProjectContentInline(admin.StackedInline):
    model = ProjectContent
    extra = 1
    fields = ('heading', 'text', 'image', 'order')
    ordering = ('order',)


@admin.register(Project)
class ProjectsAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    inlines = [ProjectContentInline]
    search_fields = ('title',)
    ordering = ('-created_at',)