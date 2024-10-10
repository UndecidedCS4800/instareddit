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
import { loader as appLoader } from "./App"

const router = createBrowserRouter([
    { path: "/",
      element: <App />,
      loader: appLoader,
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
            }
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