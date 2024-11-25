from django.db import models

# Create your models here.

class Dummy(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        db_table = 'dummy'

class User(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, default=None)
    password_hash = models.CharField(max_length=1000)
    friends = models.ManyToManyField('self', db_table='friendship')
    class Meta:
        db_table = 'user'
        
class UserInfo(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE, related_name='user_info')
    first_name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)
    date_of_birth = models.DateField(null=True)
    profile_picture = models.ImageField(null=True) #TODO read on usage
    class Meta:
        db_table = 'user_info'

class Community(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    picture = models.ImageField(null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    admins = models.ManyToManyField(User, related_name='admin_communities', db_table='community_admin')
    members = models.ManyToManyField(User, related_name='member_communities', db_table='community_member')

    @property
    def num_members(self):
        return len(self.members.all())

    class Meta:
        db_table = 'community'
        
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    #TODO add community
    text = models.TextField()
    image = models.ImageField(null=True)
    datetime = models.DateTimeField()
    community = models.ForeignKey(Community, on_delete=models.CASCADE, default=None, null=True) #optional
    class Meta:
        db_table = 'post'
        
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    class Meta:
        db_table = 'like'
        
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    text = models.TextField()
    datetime = models.DateTimeField()
    class Meta:
        db_table = 'comment'

class Dislike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    class Meta:
        db_table = 'dislike'
        
class RecentActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    type = models.CharField(max_length= 100)
    datetime = models.DateTimeField()
    class Meta:
        db_table = 'recent_activity'

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_requests_sent')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_requests_received')
    class Meta:
        db_table = 'friend_request'
        unique_together = ['from_user', 'to_user']
