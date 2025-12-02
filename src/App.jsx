import { createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./pages/auth/login"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
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
