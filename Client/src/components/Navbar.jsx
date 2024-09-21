import { useEffect, useRef, useState } from "react";

import {Outlet, NavLink} from "react-router-dom"

import navbarstyles from "../styles/navbarstyles.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faCartShopping, faMagnifyingGlass, faCaretDown, faGear, faCircleQuestion, faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";


const Navbar = () => {

    const profileRef = useRef(null)
    const iconRef = useRef(null)
    const dropDwnRef = useRef(null)
    const closeDropDwnRef = useRef(null)

    const [showDropDown, setShowDropDown] = useState(false)
    const [showCustomUserDialog, setShowCustomUserDialog] = useState(false)

    const handleShowDropDwon = () => {
        setShowDropDown(!showDropDown)
    }

    const handleShowCustomDialog = () => {
        setShowCustomUserDialog(!showCustomUserDialog)
    }

    useEffect(() => {
        const handleCloseDropDwnClickOutSide = (event) => {
            if(
                showDropDown && 
                dropDwnRef.current && !dropDwnRef.current.contains(event.target) &&
                closeDropDwnRef.current && !closeDropDwnRef.current.contains(event.target)
            ) {
                setShowDropDown(false)
            }
        }

        document.addEventListener("mousedown", handleCloseDropDwnClickOutSide)

        return () => {
            document.addEventListener("mousedown", handleCloseDropDwnClickOutSide)
        }
    }, [showDropDown])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(
                showCustomUserDialog &&
                profileRef.current && !profileRef.current.contains(event.target) &&
                iconRef.current && !iconRef.current.contains(event.target)
            ) {
                setShowCustomUserDialog(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)


        return () => {
            document.addEventListener("mousedown", handleClickOutside)
        }

    }, [showCustomUserDialog])


    return (
        <>
            <nav>
                <div className={navbarstyles.logoWrapper}>
                    <NavLink to="/">
                        <img src="/images/logo.png" alt="" width="100%" height="100%" />
                        <p>PRIME PICKS</p>
                    </NavLink>
                </div>
                <div className={navbarstyles.linkWrapper}>
                    <ul>
                        <NavLink to="/">
                            <li>HOME</li>
                        </NavLink>

                        <li className={navbarstyles.dropDwnWrapper}>
                            <div>
                                <p onClick={handleShowDropDwon} ref={closeDropDwnRef}>SHOP <span><FontAwesomeIcon icon={faCaretDown} /></span></p>
                            </div>
                            <ul className={`${navbarstyles.dropDownContainer} ${showDropDown ? navbarstyles.showDropDownContainer : ""}`} ref={dropDwnRef} >
                                <NavLink><li>All Products</li></NavLink>
                                <NavLink><li>Accessories</li></NavLink>
                                <NavLink><li>Apparels</li></NavLink>
                                <NavLink><li>Beatuy</li></NavLink>
                                <NavLink><li>Men Fashions</li></NavLink>
                                <NavLink><li>Women Fashions</li></NavLink>
                                <NavLink><li>Shoes</li></NavLink>
                                <NavLink><li>Bags</li></NavLink>
                            </ul>
                        </li>

                        <NavLink>
                            <li>GIFT BASKETS</li>
                        </NavLink>

                        <NavLink>
                            <li>CONTACT</li>
                        </NavLink>
                    </ul>
                    <div className={navbarstyles.iconWrapper}>
                        <NavLink>
                            <FontAwesomeIcon icon={faUser} onClick={handleShowCustomDialog} ref={iconRef} />
                            {showCustomUserDialog && (
                                <div className={navbarstyles.customDialog} ref={profileRef}>
                                    <h2>John Smith</h2>
                                    <div className={navbarstyles.iconsAndPicWrapper} >
                                        <div><FontAwesomeIcon icon={faUser} /> My Profile</div>
                                        <div><FontAwesomeIcon icon={faGear} /> Account Setting</div>
                                        <div><FontAwesomeIcon icon={faCircleQuestion} /> Need Help?</div>
                                        <div><FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out</div>
                                    </div>
                                </div>
                            )}
                        </NavLink>

                        <NavLink>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </NavLink>

                        <NavLink>
                            <FontAwesomeIcon icon={faCartShopping} />
                        </NavLink>
                    </div>
                    
                </div>
            </nav>
            <Outlet />
        </>
    )
}

export default Navbar