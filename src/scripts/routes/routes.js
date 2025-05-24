import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";
import LoginPage from "../pages/auth/login/login-page";
import RegisterPage from "../pages/auth/register/register-page";
import AddNewStory from "../pages/add/add-page";
import StoryDetailPage from "../pages/story-detail/story-detail-page";

const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/add": () => checkAuthenticatedRoute(new AddNewStory()),
  "/about": () => checkAuthenticatedRoute(new AboutPage()),
  "/stories/:id": () => checkAuthenticatedRoute(new StoryDetailPage()),
};

export default routes;
