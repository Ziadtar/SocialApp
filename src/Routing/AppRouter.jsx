import { createBrowserRouter } from "react-router";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/TempRegister/Register";
import Posts from "../pages/Posts/Posts";
import Layout from "../component/layout/Layout";
import AuthProtectedRoute from "./AuthProtectedRoute/AuthProtectedRoute";
import Feeds from "../pages/Feeds/Feed";
import PostDetails from "../pages/PostDetails/PostDetails";
import Saved from "../pages/Saved/Saved";
import AllSuggestedFriends from "../pages/AllSuggestedFriends/AllSuggestedFriends";
import ProfileSaved from "../pages/ProfileSaved/ProfileSaved";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import Notifications from "../pages/Notifications/Notifications";
import ProtectedRoute from "./TempProtectedRoute/ProtectedRoute";
import Profile from "../pages/TmpProfile/Profile";
import MyPosts from "../pages/TempMyPosts/MyPosts";
import ProfileMyPosts from "../pages/TempProfileMyPosts/ProfileMyPosts";

export const myRouter = createBrowserRouter([
  {
    index: true,
    element: (
      <AuthProtectedRoute>
        <Login />
      </AuthProtectedRoute>
    ),
  },
  {
    path: "login",
    element: (
      <AuthProtectedRoute>
        <Login />
      </AuthProtectedRoute>
    ),
  },
  {
    path: "Register",
    element: (
      <AuthProtectedRoute>
        <Register />
      </AuthProtectedRoute>
    ),
  },

  {
    path: "PostDetails/:id",
    element: (
      <ProtectedRoute>
        <PostDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "AllSuggestedFriends",
    element: (
      <ProtectedRoute>
        <AllSuggestedFriends />
      </ProtectedRoute>
    ),
  },
  {
    path: "ChangePassword",
    element: (
      <ProtectedRoute>
        <ChangePassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "Notifications",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: "Layout",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "Feed", element: <Feeds /> },
      { path: "MyPosts", element: <MyPosts /> },
      { path: "Posts", element: <Posts /> },
      { path: "Saved", element: <Saved /> },
    ],
  },
  {
    path: "Profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    children: [
      { path: "profileMyPosts", element: <ProfileMyPosts /> },
      { path: "profileSaved", element: <ProfileSaved /> },
    ],
  },
]);
