from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("start/", views.start, name="start"),
    path("projects/", views.projects, name="projects"),
    path('projects/<slug:slug>/', views.project_detail, name='project_detail'),
    path('about/', views.about, name="about"),
    path('contact/', views.contact, name='contact')
]