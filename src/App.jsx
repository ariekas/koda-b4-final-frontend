import { createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import HomePage from "./pages/home"
import Dashboard from "./pages/dashboard"
import ListLink from "./pages/dashboard/list"
import Profile from "./pages/dashboard/profile"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/dashboard/list",
    element: <ListLink />
  },
  {
    path: "/dashboard/profile",
    element: <Profile />
  },
])
function App() {

  return (
    <>
     <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
