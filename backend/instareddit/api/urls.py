from django.urls import path
from . import views

urlpatterns = [
    path("", views.DummyListCreateView.as_view()),
    path("auth/register", views.RegisterUserView.as_view()) #register new user
]
