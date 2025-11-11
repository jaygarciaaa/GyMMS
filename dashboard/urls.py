from django.urls import path
from . import views

app_name = "dashboard"

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("search-active-members/", views.search_active_members, name="search_active_members"),
    path("log-checkin/", views.log_checkin, name="log_checkin"),
]
