from rest_framework import serializers
from HandGesturesApp.models import UserConfiguration, ActionMappings, AppNameMappings

class UserConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserConfiguration
        fields =    ('id',
                    'gestureString',
                    'swipe',
                    'direction',
                    'mode',
                    'actionName',
                    'appName',
                    'gestureName')

class ActionMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionMappings
        fields = ('actionName',
                  'action')

class AppNameMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppNameMappings
        fields = ('appName',
                  'originalName')