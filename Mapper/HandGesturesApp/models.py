from django.db import models

# Create your models here.

class UserConfiguration(models.Model):
    id = models.AutoField(primary_key=True)
    gestureString = models.CharField(max_length=5)
    swipe = models.BooleanField()
    direction = models.CharField(max_length=20)
    actionName = models.CharField(max_length=100)
    mode = models.IntegerField()
    appName = models.CharField(max_length=100)
    gestureName = models.CharField(max_length=100)

class ActionMappings(models.Model):
    actionName = models.CharField(max_length=100, primary_key=True)
    action = models.CharField(max_length=100)

class AppNameMappings(models.Model):
    appName = models.CharField(max_length=100, primary_key=True)
    originalName = models.CharField(max_length=100)
