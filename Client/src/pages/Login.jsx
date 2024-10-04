import { useState } from "react"
import axios from "axios"
import {useAuth} from "../components/AuthContext"

import Footer from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop"

import loginstyle from "../styles/loginstyle.module.css"
import { NavLink, useNavigate} from 'react-router-dom'

const backEndUrl = import.meta.env.VITE_BACKENDURL


const Login = () => {

    const navigate = useNavigate()
    const {login} = useAuth()

    const [showSignUp, setShowSignUp] = useState(false)
    const [signUpData, setSignUpData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        pwd: ""
    });
    const [logInData, setLoginData] = useState({
        email: "",
        pwd: ""
    })
    const [errorMsg, setErrorMsg] = useState("")

    const handleDataInput = (e) => {
        const {name, value} = e.target

        setSignUpData((prev) => ({...prev, [name] : value}))
    }

    const handleMemberSignUpDataSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backEndUrl}/register`, signUpData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 200) {
                console.log("Inserted data successfully");


                setSignUpData({
                    firstname: "",
                    lastname: "",
                    email: "",
                    pwd: ""
                });

                navigate("/WishList")
            }

        } catch (error) {
            console.log("Error inserting data", error);
        }
    };

    const handleMemberLoginData = (e) => {
        const {name, value} = e.target
        setLoginData((prev) => ({...prev, [name] : value}))
    }
    
    axios.defaults.withCredentials = true
    const handleLoginSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`${backEndUrl}/loginmember`, logInData,{
                headers:{"Content-Type": "application/json"}
            })

            if(response.status === 200) {

                const {userData} = response.data;

                login(userData)

                setLoginData({
                    email: "",
                    pwd: ""
                })

                navigate(-1)
            }

        } catch (error) {
            console.log("Error logging in User", error)
            if(error.response.data.message === "User already exists") {
                setErrorMsg("User already exists")
            }
            setTimeout(() => {
                setErrorMsg("")
            }, 2000);
        }
    }




    return (

        <>
            <ScrollToTop />
            {showSignUp ? (
                <div className={loginstyle.mainContainer}>

                    {errorMsg && (<p style={{color: "red", font:"2rem", marginTop:"10rem", zIndex:"9999"}}>{errorMsg}</p>)}

                    <h1>Create Account</h1>

                    <form onSubmit={handleMemberSignUpDataSubmit} method="POST">
                        <label htmlFor="FirstName">
                            <input type="text" name="firstname" id="FirstName" value={signUpData.firstname || ""} placeholder='First Name' onChange={handleDataInput} />
                        </label>

                        <label htmlFor="LastName">
                            <input type="text" name="lastname" id="LastName" value={signUpData.lastname || ""} placeholder='Last Name' onChange={handleDataInput} />
                        </label>

                        <label htmlFor="Email">
                            <input type="email" name="email" id="Email" value={signUpData.email || ""} placeholder='Email' onChange={handleDataInput} />
                        </label>

                        <label htmlFor="Password">
                            <input type="password" name="pwd" id="Password" value={signUpData.pwd || ""} placeholder='Password' onChange={handleDataInput} />
                        </label>
                        <button>CREATE</button>
                    </form>

                    <NavLink to="/">
                        <p>Return to store</p>
                    </NavLink>


                </div>
            ):(
                <div className={loginstyle.mainContainer}>
                    <h1>Login</h1>

                    <form onSubmit={handleLoginSubmit} method="POST">
                        <label htmlFor="Email">
                            <input type="text" name="email" id="Email" placeholder='Email' required value={logInData.email} onChange={handleMemberLoginData}/>
                        </label>

                        <label htmlFor="Password">
                            <input type="password" name="pwd" id="Password" placeholder='Password' required value={logInData.pwd} onChange={handleMemberLoginData} />
                        </label>

                        <button>Sign In</button>
                    </form>

                    <div className={loginstyle.linksWrapper}>
                        <p onClick={() => setShowSignUp(true)}>Create Account</p>
                        <NavLink to="/">
                            <p>Return to Store</p>
                        </NavLink>
                        <NavLink>
                            <p>Forgot your passowrd</p>
                        </NavLink>
                    </div>
                </div>
            )}

            <Footer />
        </>
        
    )
}

export default Login