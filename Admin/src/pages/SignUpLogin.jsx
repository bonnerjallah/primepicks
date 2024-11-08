import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import signuploginstyle from "../styles/signuploginstyle.module.css";

const SignUpLogin = () => {
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <div className={signuploginstyle.mainContainer}>
            <div className={signuploginstyle.logoWarpper}>
                <img src="/logo.png" alt="PrimePicks Logo" />
                <h1>PrimePicks</h1>
            </div>
            <div>
                {showSignUp ? (
                    <Signup setShowSignUp={setShowSignUp} />
                ) : (
                    <Login setShowSignUp={setShowSignUp} />
                )}
            </div>
        </div>
    );
};

export default SignUpLogin;
