import { useState, useRef, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEnvelope, faBell, faUser, faGear, faCircleQuestion, faArrowRightFromBracket, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import homestyle from "../styles/homestyle.module.css";
import Sidebar from '../components/Sidebar';

const Home = () => {
    const profileSettingRef = useRef(null); 
    const usernameRef = useRef(null); 

    const [showSidebar, setShowSidebar] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleShowSideBar = () => {
        setShowSidebar(!showSidebar);
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
        <div className={`${homestyle.mainContainer} ${showSidebar ? "" : homestyle.hideSidebarGrid}`}>
            <div className={`${homestyle.sidebar} ${showSidebar ? homestyle.showSidebarWrapper : ""}`}>
                <Sidebar />
            </div>

            <div className={homestyle.mainWrapper}>
                <div className={homestyle.dashboardNav}>
                    <FontAwesomeIcon icon={faBars} onClick={handleShowSideBar} className={homestyle.barIcon} />
                    <div className={homestyle.notificationAndProfileWrapper}>
                        <div className={homestyle.bellIconWrapper}>
                            <span>1</span>
                            <FontAwesomeIcon icon={faBell} className={homestyle.bellIcon}/>
                        </div>
                        <div className={homestyle.enelopeWrapper}>
                            <span>1</span>
                            <FontAwesomeIcon icon={faEnvelope} className={homestyle.envelope}/>
                        </div>
                        <div className={homestyle.profilePicWrapper} ref={usernameRef} onClick={toggleDialog}>

                        </div>

                        <div className={homestyle.usernameWrapper} ref={usernameRef} onClick={toggleDialog}>
                            username
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>

                        {/* Custom Dialog */}
                        {isDialogOpen && (
                            <div className={homestyle.customDialog} ref={profileSettingRef}>
                                <h2>John Smith</h2>
                                <div className={homestyle.iconsAndPicWrapper}>
                                    <div><FontAwesomeIcon icon={faUser} /> MY Profile</div>
                                    <div><FontAwesomeIcon icon={faGear} /> Account Setting</div>
                                    <div><FontAwesomeIcon icon={faCircleQuestion} /> Need Help?</div>
                                    <div><FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
