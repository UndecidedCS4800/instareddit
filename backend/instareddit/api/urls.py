from django.urls import path
from . import views
from .controllers import community_views

urlpatterns = [
    #authentication routes
    path("auth/register", views.RegisterUserView.as_view()), #register new user
    path("auth/login", views.LoginView.as_view()),#login user

    #GET/POST for each table
    path("users", views.UserListCreateView.as_view()),
    path("userinfo", views.UserInfoListCreateView.as_view()),
    path("posts", views.PostListCreateView.as_view()),
    path("communities", views.CommunityListCreateView.as_view()),
    path('likes', views.LikeListCreateView.as_view()),
    path('dislikes', views.DislikeListCreateView.as_view()),
    path('comments', views.CommentListCreateView.as_view()),
    path('recentactivity', views.RecentActivityListCreateView.as_view()),

    path('community/<int:pk>', community_views.CommunityPostsView.as_view()),
    path('community/<int:pk>/about', community_views.CommunityDetailView.as_view()),
    path('community/<int:community_pk>/post/<int:post_pk>', community_views.CommunityPostDetailView.as_view())

]
