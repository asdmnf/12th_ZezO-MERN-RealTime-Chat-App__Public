import { Navigate, Outlet } from "react-router-dom"


const ProtectedRoute = () => {
  if (localStorage.getItem("token")) {
    return <Outlet></Outlet>
  } else {
    return <Navigate to="/"></Navigate>
  }
}

export default ProtectedRoute
