from django.http import JsonResponse
from django.conf import settings
from supabase import create_client
import json

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


class SupabaseAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip auth check for public routes
        if request.path in [
            "/login/",
            "/register/",
            "/verify_user/",
            "/forgot-password/",
            "/reset-password/",
        ]:
            return self.get_response(request)

        body_unicode = request.body.decode("utf-8")
        body_data = json.loads(body_unicode)
        access_token = body_data.get("access_token")
        refresh_token = body_data.get("refresh_token")

        try:
            # Check if token is expired
            user = supabase.auth.get_user(access_token)
            if not user:
                return JsonResponse({"error": "Invalid token"}, status=201)

            # Attach user to request for views to use
            request.user = user
            return self.get_response(request)

        except Exception as e:
            # If token expired, try refreshing
            if "expired" in str(e).lower():
                if not refresh_token:
                    return JsonResponse(
                        {"error": "Session expired. Please log in again."}, status=201
                    )

                try:
                    new_session = supabase.auth.refresh_session(refresh_token)

                    if not new_session.session:
                        return JsonResponse(
                            {"error": "Failed to refresh session"}, status=201
                        )

                    # Optional: update cookies or headers with new tokens
                    new_access_token = new_session.session.access_token
                    new_refresh_token = new_session.session.refresh_token
                    # You might want to attach the new token to the request or response
                    request.user = supabase.auth.get_user(new_access_token)
                    request.refresh = new_refresh_token
                    request.access = new_access_token
                    return self.get_response(request)

                except Exception as e:
                    return JsonResponse(
                        {"error": "Refresh token invalid or expired"}, status=201
                    )
            return JsonResponse({"error": "Unauthorized"}, status=201)
