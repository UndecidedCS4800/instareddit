import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import About from './About.tsx'
import { Login } from './Login.tsx'

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
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
