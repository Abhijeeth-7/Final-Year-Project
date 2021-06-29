from django.conf.urls import url
from HandGesturesApp import views

urlpatterns=[
    url(r'^HandGestures/$',views.dataBaseApi),
    url(r'^HandGestures/([0-9]+)$',views.dataBaseApi),
]