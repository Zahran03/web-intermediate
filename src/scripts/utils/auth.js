import { getActiveRoute } from "../routes/url-parser";

export function getToken() {
  try {
    const tokenAccess = localStorage.getItem("access_token");

    if (tokenAccess === "undefined" || tokenAccess === "null") {
      return null;
    }

    return tokenAccess;
  } catch (error) {
    console.error("getToken: error:", error);
    return null;
  }
}

export function putToken(token) {
  try {
    localStorage.setItem("access_token", token);
    return true;
  } catch (error) {
    console.error("putToken: error:", error);
    return false;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem("access_token");
    return true;
  } catch (error) {
    console.error("removeToken: error:", error);
    return false;
  }
}

const unauthenticatedRoutesOnly = ["/login", "/register"];

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = "/";
    return null;
  }

  return page;
}

export function checkAuthenticatedRoute(page) {
  const isLogin = !!getToken();

  if (!isLogin) {
    location.hash = "/login";
    return null;
  }

  return page;
}

export function logoutUser() {
  removeToken();
}
