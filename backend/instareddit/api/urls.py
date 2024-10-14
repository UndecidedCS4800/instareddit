from django.urls import path
from . import views
from .controllers import community_views, auth_views, post_views, profile_views, friendship_views

urlpatterns = [
    #authentication routes
    path("auth/register", auth_views.RegisterUserView.as_view()), #register new user
    path("auth/login", auth_views.LoginView.as_view()),#login user

    #GET/POST for each table
    # path("users", views.UserListCreateView.as_view()),
    # path("userinfo", views.UserInfoListCreateView.as_view()),
    # path("posts", views.PostListCreateView.as_view()),
    # path("communities", views.CommunityListCreateView.as_view()),
    # path('likes', views.LikeListCreateView.as_view()),
    # path('dislikes', views.DislikeListCreateView.as_view()),
    # path('comments', views.CommentListCreateView.as_view()),
    # path('recentactivity', views.RecentActivityListCreateView.as_view()),

    #communities
    path('community/<int:pk>', community_views.CommunityPostsView.as_view()),
    path('community/<int:pk>/about', community_views.CommunityDetailView.as_view()),
    path('community/<int:community_pk>/post/<int:post_pk>', community_views.CommunityPostDetailView.as_view()),
    path('communities', community_views.CommunityListCreateView.as_view()),

    #posts
    path('', post_views.RecentPostsView.as_view()),
    path('user/<str:username>/posts', post_views.UserPostsListView.as_view()),
    path('posts', post_views.PostCreateView.as_view()),
    path('posts/<int:pk>', post_views.PostGetUpdateDestroyView.as_view()),
    path('posts/<int:post_id>/like', post_views.PostLikesView.as_view()),
    path('posts/<int:post_id>/dislike',post_views.PostDislikesView.as_view()),
    path('posts/<int:post_id>/comment',post_views.PostCommentView.as_view()),
    path('posts/<int:post_id>/likes/<int:like_id>', post_views.DeleteLikesView.as_view()),
    path('posts/<int:post_id>/dislikes/<int:dislike_id>', post_views.DeleteDislikesView.as_view()),
    path('posts/<int:post_id>/comments/<int:comment_id>', post_views.DeleteCommentsView.as_view()),

    #profiles
    path('profile/<str:username>' , profile_views.ProfileView.as_view()),
    path('profile/', profile_views.SelfProfileView.as_view()),

    #friends
    path('friends/', friendship_views.FriendsIdsGetView.as_view())

]
