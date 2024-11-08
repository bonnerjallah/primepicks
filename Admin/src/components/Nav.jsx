import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const backEndUrl = import.meta.env.VITE_BACKEND_URL

import{Outlet} from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEnvelope, faBell, faUser, faGear, faCircleQuestion, faArrowRightFromBracket, faCaretDown} from "@fortawesome/free-solid-svg-icons";

import navbarstyle from "../styles/navbarstyle.module.css"

import Sidebar from '../components/Sidebar';



const Nav = () => {

    const {logOut, loggedIn, user} = useAuth()
    const navigate = useNavigate()

    const profileSettingRef = useRef(null); 
    const usernameRef = useRef(null);

    const [hideSidebar, setHideSidebar] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [member, setMember] = useState()


    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user)return;
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/getadminuser`)
                
                response.data.valid ? setMember(response.data) : console.error("Error fetch user data", response.data)
                
            } catch (error) {
                console.log("Error fetching user data", error)
            }
        }
        fetchUserData()
    }, [user])



    const handleShowSideBar = () => {
        setHideSidebar(!hideSidebar);
    };

    const toggleDialog = () => {
        setIsDialogOpen(!isDialogOpen);
    };

    // Close dialog when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the dialog is open and click happens outside of dialog or username wrapper
            if (
                isDialogOpen && 
                profileSettingRef.current && !profileSettingRef.current.contains(event.target) &&
                usernameRef.current && !usernameRef.current.contains(event.target)
            ) {
                setIsDialogOpen(false); 
            }
        };

        // Add event listener when dialog is open
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component unmounts or dialog closes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDialogOpen]); 

    //log out function
    const handleLogOut = async () => {
        try {
            const response = await axios.post(`${backEndUrl}/adminlogout`, {}, {
                withCredentials: true
            })

            if(response.status === 200) {

                logOut()
                navigate("/")
            }

        } catch (error) {
            console.log("Error logging out user", error)
        }
    }





    return (
        <div className={`${navbarstyle.mainContainer} ${!hideSidebar ? navbarstyle.hideSidebar : ""}`}>

            <div className={`${navbarstyle.sidebar} ${hideSidebar ? navbarstyle.showSidebarWrapper : ""}`}>
                <Sidebar />
            </div> 
            

            <div className={navbarstyle.navBar}>

                <FontAwesomeIcon icon={faBars} onClick={handleShowSideBar} className={`${navbarstyle.barIcon} ${!hideSidebar ? navbarstyle.barIconRotate : "" }`} />

                <div className={navbarstyle.notificationAndProfileWrapper}>

                    <div className={navbarstyle.bellIconWrapper}>
                        <span>1</span>
                        <FontAwesomeIcon icon={faBell} className={navbarstyle.bellIcon}/>
                    </div>

                    <div className={navbarstyle.enelopeWrapper}>
                        <span>1</span>
                        <FontAwesomeIcon icon={faEnvelope} className={navbarstyle.envelope}/>
                    </div>
                    
                    <div className={navbarstyle.profileContainer} ref={usernameRef} onClick={toggleDialog}>
                        <div className={navbarstyle.profilePicWrapper}>
                            {loggedIn && user && member && member.user ? ( 
                                member.user.profilepic ? (
                                    <img src={`${backEndUrl}/profilepic/${member.user.profilepic}`} alt="profile pic" width={100} height={100} />
                                ) : (
                                    <p>
                                        {member.user.firstname.charAt(0).toUpperCase()}
                                    </p>
                                )
                            ) : (
                                <>
                                </> 
                            )}
                        </div>


                        <div className={navbarstyle.usernameWrapper} >
                            {loggedIn && member && (
                                <p>
                                    {member.user.username}
                                </p>
                            )}
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                    </div>

                    {/* Custom Dialog */}
                    {isDialogOpen && (
                        <div className={navbarstyle.customDialog} ref={profileSettingRef}>
                            <>{loggedIn && user && (
                                <h2>
                                    {member.user.firstname}
                                </h2>
                            )}</>
                            <div className={navbarstyle.iconsAndPicWrapper}>
                                <div><FontAwesomeIcon icon={faUser} /> My Profile</div>
                                <div><FontAwesomeIcon icon={faGear} /> Account Setting</div>
                                <div><FontAwesomeIcon icon={faCircleQuestion} /> Need Help?</div>
                                <div onClick={handleLogOut}><FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Outlet />
        </div>
    )
}

export default Nav