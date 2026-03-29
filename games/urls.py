from django.urls import path

from . import views

app_name = 'games';
urlpatterns = [
    path('', views.index, name='index'),
    path('halfpix', views.halfpix, name='halfpix'),
]
