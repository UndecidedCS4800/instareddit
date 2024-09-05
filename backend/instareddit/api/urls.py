from django.urls import path
from . import views

urlpatterns = [
    path("api/", views.DummyListCreateView.as_view())
]
