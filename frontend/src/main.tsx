import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import About from './About.tsx'
import { Login } from './Login.tsx'
import { loader as communityLoader, Community } from "./components/Community.tsx"
import { loader as postLoader, Post } from "./components/Post.tsx"

const router = createBrowserRouter([
  { path: "/",
    element: <App />,
    children: [
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
            path: "/posts/:postid",
            element: <Post />,
            loader: postLoader
          }
        ]
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
