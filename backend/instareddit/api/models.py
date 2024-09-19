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
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    profile_picture = models.ImageField() #TODO read on usage
    class Meta:
        db_table = 'user_info'

class Community(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    picture = models.ImageField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    admins = models.ManyToManyField(User, related_name='admin_communities', db_table='community_admin')
    class Meta:
        db_table = 'community'
        
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    #TODO add community
    text = models.TextField()
    image = models.ImageField()
    datetime = models.DateTimeField()
    community = models.ForeignKey(Community, on_delete=models.CASCADE, default=None) #optional
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
