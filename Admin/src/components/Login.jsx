import { useState} from "react";
import { useAuth } from "./AdminAuthContext";
import {useNavigate} from "react-router-dom"
import axios from "axios";


const backEndUrl = import.meta.env.VITE_BACKEND_URL

import signuploginstyle from "../styles/signuploginstyle.module.css";

const Login = ({ setShowSignUp }) => {

    const {login} = useAuth()

    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        username: "",
        pwd: ""
    })

    const [errMsg, setErrMsg] = useState("")

    const handleLoginInputData = (e) => {
        const {name, value} = e.target
        setLoginData((prev) => ({...prev, [name] : value}))
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${backEndUrl}/loginadminuser`, loginData, {
                headers: { "Content-Type": "application/json" }
            });            

            if(response.status === 200) {
                const {userData} = response.data

                login(userData)

                setLoginData({
                    username: "",
                    pwd: ""
                })

                navigate("/Home")
            }

        } catch (error) {
            console.log("Error loging in user", error)
            if(error && error.response && error.response.data && error.response.data.message) {
                setErrMsg(error.response.data.message)
                setTimeout(() => {
                    setErrMsg("")
                }, 2000);
            }
        }
    }

    return (
        <div className={signuploginstyle.loginContainer}>
            <div>
                <h1>Admin</h1>
                <h3>Login to Your Account</h3>
            </div>
            <div className={signuploginstyle.loginformWrapper}>

                <form onSubmit={handleLoginSubmit} method="POST">
                    <label htmlFor="UserName">
                            Username: Guest007
                        <input type="text" name="username" id="UserName" required onChange={handleLoginInputData} />
                    </label>

                    {errMsg && (<p style={{color:"red"}}>{errMsg}</p>)}

                    <label htmlFor="Password">
                            Password: password
                        <input type="password" name="pwd" id="Password" required onChange={handleLoginInputData} />
                    </label>

                    <button type="submit">Login</button>
                </form>

                <p className={signuploginstyle.loginInLinkWrapper}>
                    Don't have an account? <strong onClick={() => setShowSignUp(true)}>Create an account</strong>
                </p>
            </div>
        </div>
    );
};

export default Login;
