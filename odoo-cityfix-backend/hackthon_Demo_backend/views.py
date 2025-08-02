from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json, requests
from django.conf import settings
from supabase import create_client

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email").lower()
        password = data.get("password")

        if not all([first_name, email, password]):
            return JsonResponse(
                {"error": "First name, email and password are required"}, status=201
            )

        try:
            existing_user = (
                supabase.table("users_table").select("*").eq("email", email).execute()
            )
            if existing_user.data:
                return JsonResponse({"error": "User already exists"}, status=201)
        except Exception as auth_error:
            pass

        try:
            supabase.table("users_table").select("*").limit(1).execute()
        except Exception as e:
            print(e)

        auth_response = supabase.auth.sign_up(
            {
                "email": email,
                "password": password,
                "options": {
                    "data": {"first_name": first_name, "last_name": last_name},
                    "email_redirect_to": "http://localhost:5173/verify_user",
                },
            }
        )

        if auth_response.user and not auth_response.user.email_confirmed_at:
            supabase.table("users_table").insert(
                {
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "created_at": "now()",
                    "updated_at": "now()",
                    "is_verified": False,
                }
            ).execute()

            return JsonResponse(
                {
                    "message": "Verification email sent. Please check your email to complete registration.",
                    "user": {
                        "email": email,
                        "first_name": first_name,
                        "last_name": last_name,
                    },
                },
                status=201,
            )

        return JsonResponse({"error": "Registration failed"}, status=201)

    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def verify_email(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)
        token = data.get("access_token")
        print(token)
        if not token:
            return JsonResponse({"error": "Verification token is required"}, status=201)

        # This line automatically verifies and gets the user
        user_response = supabase.auth.get_user(token)
        user = user_response.user

        if not user:
            return JsonResponse(
                {"error": "Invalid token or user not found"}, status=201
            )

        email = user.email

        supabase.table("users_table").update(
            {"is_verified": True, "updated_at": "now()"}
        ).eq("email", email).execute()

        return JsonResponse({"message": "Email verified successfully"}, status=200)

    except Exception as e:
        print("error: ", e)
        return JsonResponse(
            {"error": "Invalid or expired verification token"}, status=201
        )


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)
    try:
        data = json.loads(request.body)
        email = data.get("email").lower()
        password = data.get("password")
        print(email, password)

        if not all([email, password]):
            return JsonResponse(
                {"error": "Email and password are required"}, status=201
            )

        user_record = (
            supabase.table("users_table")
            .select("is_verified")
            .eq("email", email)
            .execute()
        )
        if not user_record.data:
            return JsonResponse({"error": "User not found"}, status=201)

        auth_response = supabase.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
        if auth_response.user:
            access_token = auth_response.session.access_token
            refresh_token = auth_response.session.refresh_token

            user_data = (
                supabase.table("users_table").select("*").eq("email", email).execute()
            )
            issues_record = (
                supabase.table("issues")
                .select(
                    "*, categories(name), users_table(first_name, last_name, email), issue_photos(image_url), issue_status_logs(status, changed_at)"
                )
                .execute()
            )

            if user_data.data:
                return JsonResponse(
                    {
                        "message": "Login successful",
                        "access": access_token,
                        "refresh": refresh_token,
                        "user": user_data.data[0],
                        "issues": issues_record.data,
                    },
                    status=200,
                )

    except Exception as e:
        print("error: ", e)
        if str(e) == "Invalid login credentials":
            return JsonResponse({"error": "Invalid login credentials"}, status=201)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def check_auth(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        user = getattr(request, "user", None)
        if not user:
            return JsonResponse({"authenticated": False}, status=200)

        access = getattr(request, "access", None)
        refresh = getattr(request, "refresh", None)
        if access and refresh:
            return JsonResponse(
                {"authenticated": True, "access": access, "refresh": refresh},
                status=200,
            )
        return JsonResponse({"authenticated": True}, status=200)

    except Exception as e:
        return JsonResponse(
            {"error": "Authentication check failed", "authenticated": False}, status=500
        )


@csrf_exempt
def forgot_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")

        if not email:
            return JsonResponse({"error": "Email is required"}, status=201)

        supabase.auth.reset_password_email(
            email, options={"redirect_to": "http://localhost:5173/reset-password"}
        )
        return JsonResponse({"message": "Password reset email sent"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=201)


@csrf_exempt
def reset_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
        raw_token = data.get("access_token")
        new_password = data.get("new_password")

        if not raw_token or not new_password:
            return JsonResponse({"error": "Missing token or password"}, status=201)

        if "&" in raw_token:
            raw_token = raw_token.split("&")[0]

        headers = {
            "apikey": settings.SUPABASE_KEY,
            "Authorization": f"Bearer {raw_token}",
            "Content-Type": "application/json",
        }
        body = {"password": new_password}
        url = f"{settings.SUPABASE_URL}/auth/v1/user"

        response = requests.put(url, headers=headers, json=body)

        if response.status_code == 200:
            return JsonResponse(
                {"message": "Password updated successfully"}, status=200
            )
        else:
            return JsonResponse(
                {"error": "Supabase error", "details": response.json()}, status=201
            )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=201)


@csrf_exempt
def edit_profile_data(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        user = getattr(request, "user", None)
        if not user:
            return JsonResponse({"authenticated": False}, status=201)

        data = json.loads(request.body)
        tempData = data.get("tempData")

        supabase.table("users_table").update(
            {
                "first_name": tempData["first_name"],
                "last_name": tempData["last_name"],
                "updated_at": "now()",
            }
        ).eq("email", tempData["email"]).execute()

        user = (
            supabase.table("users_table")
            .select("*")
            .eq("email", tempData["email"])
            .execute()
        )
        data = {}
        if user.data:
            data["user"] = user.data[0]

        access = getattr(request, "access", None)
        refresh = getattr(request, "refresh", None)
        if access and refresh:
            data["access"] = access
            data["refresh"] = refresh
        return JsonResponse(
            data,
            status=200,
        )

    except Exception as e:
        print(e)
        return JsonResponse(
            {"error": "Authentication check failed", "authenticated": False}, status=201
        )


@csrf_exempt
def get_issue_details(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        user = getattr(request, "user", None)
        if not user:
            return JsonResponse({"authenticated": False}, status=201)

        data = json.loads(request.body)
        issue_id = data.get("issue")

        data = {}
        if not issue_id:
            return JsonResponse({"error": "Missing issue ID"}, status=201)

        # Fetch the issue with category and reporter info
        issue_resp = (
            supabase.table("issues")
            .select(
                "*, categories(name), users_table(first_name, last_name), issue_photos(image_url)"
            )
            .eq("id", issue_id)
            .single()
            .execute()
        )

        issue = issue_resp.data
        data["issue"] = issue
        if not issue:
            return JsonResponse({"error": "Issue not found"}, status=201)

        # Fetch issue status logs
        logs_resp = (
            supabase.table("issue_status_logs")
            .select("*")
            .eq("issue_id", issue_id)
            .order("changed_at", desc=False)
            .execute()
        )
        logs = logs_resp.data
        print(logs)
        data["logs"] = logs

        access = getattr(request, "access", None)
        refresh = getattr(request, "refresh", None)
        if access and refresh:
            data["access"] = access
            data["refresh"] = refresh
        return JsonResponse(
            data,
            status=200,
        )

    except Exception as e:
        print(e)
        return JsonResponse(
            {"error": "Authentication check failed", "authenticated": False}, status=201
        )


@csrf_exempt
def report_spam(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        user = getattr(request, "user", None)
        if not user:
            return JsonResponse({"authenticated": False}, status=201)

        data = json.loads(request.body)
        issue_id = data.get("issue")
        user_id = data.get("user")

        data = {}
        if not issue_id:
            return JsonResponse({"error": "Missing issue ID"}, status=201)

        # Fetch the issue with category and reporter info

        supabase.table("flags").insert(
            {
                "flagged_by": user_id,
                "issue_id": issue_id,
                "flagged_at": "now()",
            }
        ).execute()

        issue_resp = (
            supabase.table("issues")
            .select(
                "*, categories(name), users_table(first_name, last_name), issue_photos(image_url), flags(flagged_by)"
            )
            .eq("id", issue_id)
            .single()
            .execute()
        )

        issue = issue_resp.data
        data["issue"] = issue
        if not issue:
            return JsonResponse({"error": "Issue not found"}, status=201)

        # Fetch issue status logs
        logs_resp = (
            supabase.table("issue_status_logs")
            .select("*")
            .eq("issue_id", issue_id)
            .order("changed_at", desc=False)
            .execute()
        )
        logs = logs_resp.data
        print(logs)
        data["logs"] = logs

        access = getattr(request, "access", None)
        refresh = getattr(request, "refresh", None)
        if access and refresh:
            data["access"] = access
            data["refresh"] = refresh
        return JsonResponse(
            data,
            status=200,
        )

    except Exception as e:
        print(e)
        return JsonResponse(
            {"error": "Authentication check failed", "authenticated": False}, status=201
        )
