from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt,get_token
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from HandGesturesApp.models import UserConfiguration,ActionMappings,AppNameMappings
from HandGesturesApp.serializers import UserConfigSerializer,ActionMapSerializer, AppNameMapSerializer
from HandGesturesApp.codeGeneration import CodeAutomation

from random import randint

# Create your views here.
@csrf_exempt
def dataBaseApi(request):
    if request.method == 'GET':
        gesturesTable = UserConfiguration.objects.all()
        gesturesTable_serializer = UserConfigSerializer(gesturesTable, many=True)
        ActionsTable = ActionMappings.objects.all()
        ActionsTable_serializer = ActionMapSerializer(ActionsTable, many=True)
        AppNamesTable = AppNameMappings.objects.all()
        AppNamesTable_serializer = AppNameMapSerializer(AppNamesTable, many=True)
        responseObject = {
            "gestureData":gesturesTable_serializer.data,
            "actionData":ActionsTable_serializer.data,
            "appNameData":AppNamesTable_serializer.data
                        }
        return JsonResponse(responseObject, safe=False)

    if request.method=='POST':
        dataSet = JSONParser().parse(request)
        print(dataSet)
        gestureData = dataSet['gestureData']
        actionData = dataSet['actionData']
        appData = dataSet['appData'] 

        print(*gestureData, sep='\n')

        cg = CodeAutomation(gestureData,actionData,appData)
        newConfig = cg.generatePythonCode()
        return JsonResponse(newConfig, safe=False)


