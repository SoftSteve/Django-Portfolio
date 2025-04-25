from django.shortcuts import render
from django.http import HttpResponse
from .models import AboutSection, Project


def index(request):
    about = AboutSection.objects.first()
    return render(request, "index.html", {'about': about})

def start(request):
    return render(request, 'start.html')

def projects(request):
    project = Project.objects.first()
    return render(request, "project.html", {'project': project})

