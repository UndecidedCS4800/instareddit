from django.urls import path
from . import views

urlpatterns = [
    path("dummydata/", views.DummyListCreateView.as_view())
]
