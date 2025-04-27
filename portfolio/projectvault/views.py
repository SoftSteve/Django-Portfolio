from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import AboutSection, Project
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


def index(request):
    about = AboutSection.objects.first()
    return render(request, "index.html", {'about': about})

def start(request):
    return render(request, 'start.html')

def projects(request):
    projects = Project.objects.all()
    return render(request, "projects.html", {'projects': projects})

def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    content_blocks = project.content_blocks.all()
    return render(request, 'project_detail.html', {'project': project, 'content_blocks':content_blocks})

def about(request):
    about = AboutSection.objects.last()
    return render(request,'about.html', {'about': about})

def contact(request):
    return render(request, 'contact.html')