export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export function setCookies(data) {
  const now = new Date();
  const accessTokenExpiry = new Date(now.getTime() + 60 * 60 * 1000);
  document.cookie = `access_token=${
    data.access
  }; expires=${accessTokenExpiry.toUTCString()}; path=/; Secure; SameSite=Strict`;

  const refreshTokenExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  document.cookie = `refresh_token=${
    data.refresh
  }; expires=${refreshTokenExpiry.toUTCString()}; path=/; Secure; SameSite=Strict`;
}

export function cleanCookies() {
  localStorage.removeItem("user_data");
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
