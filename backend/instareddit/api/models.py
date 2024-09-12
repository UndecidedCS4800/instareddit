from django.db import models

# Create your models here.

class Dummy(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        db_table = 'dummy'

#TODO just for testing, wait till final model is done
class User(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, default=None)
    password_hash = models.CharField(max_length=1000)
    class Meta:
        db_table = 'user'