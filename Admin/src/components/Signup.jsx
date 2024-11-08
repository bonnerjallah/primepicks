import { NavLink } from "react-router-dom";
import { useState } from "react";
import signuploginstyle from "../styles/signuploginstyle.module.css";
import axios from "axios";
const backEndUrl = import.meta.env.VITE_BACKEND_URL;

const Signup = ({ setShowSignUp }) => {
    const [signUpInput, setSignUpInput] = useState({
        firstname: "",
        lastname: "",
        username: "",  // Fixed typo here
        pwd: ""
    });

    const [agreed, setAgreed] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const handleSignUpInputData = (e) => {
        const { name, value } = e.target;
        setSignUpInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        if (!agreed) {
            setErrMsg("You must agree to the terms and conditions.");
            setTimeout(() => {
                setErrMsg("")
            }, 2000);
            return;
        }

        try {
            const response = await axios.post(`${backEndUrl}/registeradminuser`, signUpInput, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 200) {
                console.log("Successfully entered sign-up data");

                setSignUpInput({
                    firstname: "",
                    lastname: "",
                    username: "",
                    pwd: ""
                });

                setAgreed(false);
                
                setErrMsg("");
            }
        } catch (error) {
            console.error("Error inserting sign-up data:", error);
            setErrMsg("An error occurred. Please try again later.");
        }
    };

    return (
        <div className={signuploginstyle.signupContainer}>
            <div className={signuploginstyle.formWrapper}>
                <h2>Create an Account</h2>
                {errMsg && <p className={signuploginstyle.errorMsg}>{errMsg}</p>} 
                <form onSubmit={handleSignUpSubmit}>
                    <label htmlFor="FirstName">
                        <input
                            type="text"
                            name="firstname"
                            id="FirstName"
                            placeholder="Firstname"
                            required
                            onChange={handleSignUpInputData}
                            value={signUpInput.firstname}
                        />
                    </label>

                    <label htmlFor="LastName">
                        <input
                            type="text"
                            name="lastname"
                            id="LastName"
                            placeholder="Lastname"
                            required
                            onChange={handleSignUpInputData}
                            value={signUpInput.lastname}
                        />
                    </label>

                    <label htmlFor="UserName">
                        <input
                            type="text"
                            name="username"
                            id="UserName"
                            placeholder="Username"
                            required
                            onChange={handleSignUpInputData}
                            value={signUpInput.username}
                        />
                    </label>

                    <label htmlFor="Password">
                        <input
                            type="password"
                            name="pwd"
                            id="Password"
                            placeholder="Password"
                            required
                            onChange={handleSignUpInputData}
                            value={signUpInput.pwd}
                        />
                    </label>

                    <div className={signuploginstyle.conditionWrapper}>
                        <label htmlFor="Agree">
                            <input
                                type="checkbox"
                                name="agree"
                                id="Agree"
                                checked={agreed}
                                onChange={() => setAgreed(!agreed)}
                                required
                            />
                            <p>
                                I Agree and accept the <NavLink to="/terms">terms and conditions</NavLink>
                            </p>
                        </label>
                    </div>

                    <button type="submit">Create Account</button>
                </form>
            </div>

            <p className={signuploginstyle.loginInLinkWrapper}>
                Already have an account?{" "}
                <strong onClick={() => setShowSignUp(false)}>Log in</strong>
            </p>
        </div>
    );
};

export default Signup;
