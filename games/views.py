from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, 'games/index.html', {})

def halfpix(request):
    return render(request, 'games/halfpix.html', {})
