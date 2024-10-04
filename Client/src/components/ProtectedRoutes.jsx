import {Outlet} from "react-router-dom"
import { useAuth } from "./AuthContext"
import Login from "../pages/Login"

const ProtectedRoutes = () => {
    const {loggedIn} = useAuth()

    return (
        <div>
            {loggedIn ? (
                <Outlet/>
            ) : (
                <Login />
            )}
        </div>
    )
}

export default ProtectedRoutes