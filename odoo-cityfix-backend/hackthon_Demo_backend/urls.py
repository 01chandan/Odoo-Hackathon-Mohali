from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("register/", views.register_user, name="register_user"),
    path("login/", views.login_user, name="login_user"),
    path("check_auth/", views.check_auth, name="check_auth"),
    path("verify_user/", views.verify_email, name="verify_email"),
    path("edit-profile-data/", views.edit_profile_data, name="edit_profile_data"),
    path("forgot-password/", views.forgot_password, name="forgot_password"),
    path("reset-password/", views.reset_password, name="reset_password"),
    path("get-issue-details/", views.get_issue_details, name="get_issue_details"),
    path("report-spam/", views.report_spam, name="report_spam"),
    path("report-new-issue/", views.report_new_issue, name="report_new_issue"),
]
