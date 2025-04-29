from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from .models import AboutSection, Project
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.mail import send_mail
import os
from dotenv import load_dotenv


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

def thank_you(request):
    return render(request, 'thank_you.html')

def contact(request):
    if request.method == "POST":
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        full_message = f'message from {name}:\n{email}:\n\n{message}'

        sender_email = os.getenv('EMAIL_HOST_USER')
        recipient_email = sender_email

        send_mail(
            subject = 'New message',
            message = full_message,
            from_email = sender_email,
            recipient_list = [recipient_email]
        )

        return redirect('thank you')

    return render(request, 'contact.html')