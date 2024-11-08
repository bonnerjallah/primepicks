import { Outlet } from "react-router-dom"
import { useAuth } from "./AdminAuthContext"
import SignUpLogin from "../pages/SignUpLogin"

const ProtectedRoutes = () => {
    const { loggedIn } = useAuth();
    
    return (
        <>
            {loggedIn ? (
                <Outlet />
            ) : (
                <SignUpLogin />
            )}
        </>
    );
};


export default ProtectedRoutes