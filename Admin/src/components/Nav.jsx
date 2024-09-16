import { useState, useRef, useEffect } from 'react';
import{Outlet, NavLink} from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEnvelope, faBell, faUser, faGear, faCircleQuestion, faArrowRightFromBracket, faCaretDown} from "@fortawesome/free-solid-svg-icons";

import navbarstyle from "../styles/navbarstyle.module.css"

import Sidebar from '../components/Sidebar';



const Nav = () => {

    const profileSettingRef = useRef(null); 
    const usernameRef = useRef(null);

    const [hideSidebar, setHideSidebar] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);



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



    return (
        <div className={`${navbarstyle.mainContainer} ${!hideSidebar ? navbarstyle.hideSidebar : ""}`}>

            <div className={`${navbarstyle.sidebar} ${hideSidebar ? navbarstyle.showSidebarWrapper : ""}`}>
                <Sidebar />
            </div> 
            

            <div className={navbarstyle.navBar}>

                <FontAwesomeIcon icon={faBars} onClick={handleShowSideBar} className={navbarstyle.barIcon} />

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
                        <div className={navbarstyle.profilePicWrapper} >

                        </div>

                        <div className={navbarstyle.usernameWrapper} >
                            username
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                    </div>

                    {/* Custom Dialog */}
                    {isDialogOpen && (
                        <div className={navbarstyle.customDialog} ref={profileSettingRef}>
                            <h2>John Smith</h2>
                            <div className={navbarstyle.iconsAndPicWrapper}>
                                <div><FontAwesomeIcon icon={faUser} /> My Profile</div>
                                <div><FontAwesomeIcon icon={faGear} /> Account Setting</div>
                                <div><FontAwesomeIcon icon={faCircleQuestion} /> Need Help?</div>
                                <div><FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out</div>
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