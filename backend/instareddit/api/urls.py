from django.urls import path
from . import views
from .controllers import community_views, auth_views, post_views, profile_views, friendship_views, search_view

urlpatterns = [
    #authentication routes
    path("auth/register", auth_views.RegisterUserView.as_view()), #register new user
    path("auth/login", auth_views.LoginView.as_view()),#login user

    #communities
    path('community/<int:pk>', community_views.CommunityPostsView.as_view()),
    path('community/<int:pk>/about', community_views.CommunityDetailView.as_view()),
    path('community/<int:community_pk>/post/<int:post_pk>', community_views.CommunityPostDetailView.as_view()),
    path('communities', community_views.CommunityListCreateView.as_view()),
    #admins
    path('community/<int:pk>/admin', community_views.CommunityAdminCreateDestroyView.as_view),

    #posts
    path('', post_views.RecentPostsView.as_view()),
    path('user/<str:username>/posts', post_views.UserPostsListView.as_view()),
    path('posts', post_views.PostCreateView.as_view()),
    path('user/<str:username>/posts/<int:post_pk>', post_views.PostGetUpdateDestroyView.as_view()),
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
    path('friends/', friendship_views.FriendsIdsGetView.as_view()),
    path('friends/status/', friendship_views.FriendshipStatusView.as_view()),
    path('friendrequest/', friendship_views.FriendRequestCreateView.as_view()),
    path('friendrequests/accept/', friendship_views.AcceptView.as_view()),
    path('friendrequests/decline/', friendship_views.DeclineView.as_view()),
    path('friendrequests/cancel/', friendship_views.CancelView.as_view()),
    path('user/<str:username>/friendrequests', friendship_views.FriendRequestListView.as_view()),

    #search
    path('search/', search_view.SearchView.as_view())

]
