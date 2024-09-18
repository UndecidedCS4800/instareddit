from django.urls import path
from . import views

urlpatterns = [
    #authentication routes
    path("auth/register", views.RegisterUserView.as_view()), #register new user
    path("auth/login", views.LoginView.as_view()),

    #GET/POST for each table
    path("users", views.UserListCreateView.as_view()),
    path("userinfo", views.UserInfoListCreateView.as_view()),
    path("posts", views.PostListCreateView.as_view()),
    path("communities", views.CommunityListCreateView.as_view())

]
