import { createBrowserRouter, RouterProvider } from "react-router-dom"
import About from "./About";
import App from "./App";
import { CenterPane } from "./components/CenterPane";
import { Community } from "./components/Community";
import { CreatePost } from "./components/CreatePost";
import { Post } from "./components/Post";
import { Login } from "./Login";
import { loader as communityLoader } from "./components/Community"
import { loader as postLoader } from "./components/Post"
import ProfilePage from "./components/ProfilePage";
import ChatPage from "./ChatPage";
import Notifications from "./Notifications";
import CreateCommunity from "./components/CreateCommunity";

const router = createBrowserRouter([
    { path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <CenterPane />
        },
        {
          path: "/about",
          element: <About />
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/messages",
          element: <ChatPage />,
        },
        {
          path: "/notifications",
          element: <Notifications />,
        },
        {
          path: "/community/:communityid",
          element: <Community />,
          loader: communityLoader,
          children: [
            {
              path: "/community/:communityid/posts/:postid",
              element: <Post />,
              loader: postLoader
            },
            {
              path: "/community/:communityid/posts/create",
              element: <CreatePost />
            },
          ]
        },
        {
          path: "/community/create",
          element: <CreateCommunity />
        },
        {
          path: "/user/:username",
          element: <ProfilePage />,
          children: [
            {
              path: "posts/:postid",
              element: <Post />,
              loader: postLoader
            },
            {
              path: "posts/create",
              element: <CreatePost />
            },
          ]
        }
      ],
    },
  ]);
  

const MainRouter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default MainRouter