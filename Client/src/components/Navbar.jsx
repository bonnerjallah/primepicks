import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {Outlet, NavLink, useNavigate} from "react-router-dom"

import navbarstyles from "../styles/navbarstyles.module.css"
import cartstyle from "../styles/cartstyle.module.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faCartShopping, faMagnifyingGlass, faCaretDown, faGear, faCircleQuestion, faArrowRightFromBracket, faXmark, faMinus, faPlus, faHeart, faBars} from "@fortawesome/free-solid-svg-icons";

import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

const backEndUrl = import.meta.env.VITE_BACKENDURL


const Navbar = () => {

    const {cartItems, addToCart, removeFromCart, wishListItems, totalAmount} = useCart()

    const navigate = useNavigate()

    const {logOut, loggedIn, user} = useAuth()
    

    const profileRef = useRef(null)
    const iconRef = useRef(null)
    const dropDwnRef = useRef(null)
    const closeDropDwnRef = useRef(null)
    const cartDialogRef = useRef(null)
    const sideMenuRef = useRef(null)
    const barIconRef = useRef(null)


    const [showDropDown, setShowDropDown] = useState(false)
    const [showCustomUserDialog, setShowCustomUserDialog] = useState(false)
    const [showSideMenu, setShowSideMenu] = useState(false)
    const [showSideBarDropDown, setShowSideBarDropDown] = useState(false)

    const [filterCartItems, setFilterCartItems] = useState([]);

    const [member, setMember] = useState("")



    const handleShowDropDwon = () => {
        setShowDropDown(!showDropDown)
    }

    const handleShowCustomDialog = () => {
        setShowCustomUserDialog(!showCustomUserDialog)
    }

    //handle click outside dropdown menu
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


    //handle click outside profile menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if(showCustomUserDialog && profileRef.current && !profileRef.current.contains(event.target) &&
                iconRef.current && !iconRef.current.contains(event.target)) {
                setShowCustomUserDialog(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [showCustomUserDialog])


    //handle click outside cart
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cartDialogRef.current) {
                const dialogDimensions = cartDialogRef.current.getBoundingClientRect();
                if(
                    e.clientX < dialogDimensions.left ||
                    e.clientX > dialogDimensions.right ||
                    e.clientY < dialogDimensions.top ||
                    e.clientY > dialogDimensions.bottom 
                ) {
                    handleCloseDialog()
                }
            } else {
                console.log("cant close")
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    //handle click outside side menu
    useEffect(() => {
        const handleClickOutsideSideMenu = (e) => {
            if( showSideMenu && sideMenuRef.current && !sideMenuRef.current.contains(e.target) && 
                barIconRef.current && !barIconRef.current.contains(e.target)) {
                setShowSideMenu(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutsideSideMenu) 

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideSideMenu)
        }
    }, [showSideMenu])


    const handleShowSideMenu = () => {
        setShowSideMenu(!showSideMenu)
    }


    const handleShowSideBarDropDown = () => {
        setShowSideBarDropDown(!showSideBarDropDown)
    }


    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;     
            try {
                const response = await axios.get(`${backEndUrl}/getmember`);
    
                response.data.valid ? setMember(response.data) : console.error("Invalid user", response.data);
            } catch (error) {
                console.log("Error fetching user data", error);
            }
        };
    
        fetchUserData();
    }, [user]);


    const handleLogOut = async () => {
        try {
            const response = await axios.post(`${backEndUrl}/logout`, {}, {
                withCredentials: true
            })

            if(response.status === 200) {
                console.log("response data", response.data)
            }
            
        } catch (error) {
            console.log("Error loging out user", error)
        }

        logOut()
        
        navigate("/")
    }

    //Fetch filter porduct data and cart items
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/getallproducts`,)
                const data = response.data

                const formatedData = data.map((elem) => ({
                    ...elem,
                    price: typeof elem.price === "number" ? elem.price.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) 
                    : elem.price
                }))


                const filterItems = data.filter(elem => 
                    cartItems.some(cartelem => cartelem.id === elem._id)
                );
                
                const formattedCartItemsData = filterItems.map(elem => {
                    const cartItem = cartItems.find(cartelem => cartelem.id === elem._id);
                    const quantity = cartItem ? cartItem.quantity : 1;

                    //Ensure the price is a string
                    const price = typeof elem.price === "string" ? elem.price.replace(/,/g, "") : elem.price

                    const parsedPrice = parseFloat(price) || 0

                    const salePercentage = elem.salePercentage === "" ? 0 : parseInt(elem.salepercentage) || 0;
                
                    const discountedPrice = elem.sale === "true" ? parsedPrice - (salePercentage * parsedPrice / 100) : parsedPrice;
                
                    return {
                        ...elem,
                        quantity,
                        price: discountedPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    };
                });                
    
                setFilterCartItems(formattedCartItemsData);
                
            } catch (error) {
                console.log("Error fetching data", error)
            }
        }
        fetchData()
    }, [cartItems])


    const handleOpenCart = () => {
        cartDialogRef.current?.showModal();
        document.body.style.overflow = "hidden";

        cartDialogRef.current?.addEventListener("close", handleCloseDialog);
    };

    
    const handleCloseDialog = () => {
        cartDialogRef.current?.close();
        document.body.style.overflow = ""; 
    };


    const handleGoToCheckOut = () => {
        handleCloseDialog()
        navigate("/CheckOut")
    }

    const handleMinusItemQuantity = (id) => {
        removeFromCart(id)
    };


    const handleAddItemFromCart = (id, price, salepercentage, quantity) => {
        console.log(id, price, salepercentage, quantity )
        
            addToCart({id, quantity: quantity, price, salepercentage})
            console.log("added")
        
    }






    return (
        <>
            <nav>
                <div className={navbarstyles.logoWrapper}>

                    <NavLink to="/">
                        <img src="/images/logo.png" alt="" />
                    </NavLink>

                    <div className={`${navbarstyles.barsIconWrapper} ${showSideMenu ? navbarstyles.rotateBar : ""}`}>
                        <FontAwesomeIcon icon={faBars} onClick={handleShowSideMenu} ref={barIconRef} />
                    </div>
                    
                </div>

                <div className={`${navbarstyles.hidesideMenuContainer} ${showSideMenu ? navbarstyles.sideMenuContainer : ""}`} ref={sideMenuRef}>
                    <NavLink to="/">
                        <img src="/images/logo.png" alt="" />
                    </NavLink> 

                    <ul>
                        <li className={navbarstyles.sideMenueDropDownContainer}>
                            <div>
                                <p onClick={handleShowSideBarDropDown}>
                                    SHOP <span><FontAwesomeIcon icon={faCaretDown} /></span>
                                </p>
                            </div>
                            <ul className={`${navbarstyles.sideMenuDropDownListWrapper} ${showSideBarDropDown ? navbarstyles.showSideDropDown : ""}`}>
                                <NavLink to="/MenFashion"><li>Men Fashions</li></NavLink>
                                <NavLink to="/WomenFashion"><li>Women Fashions</li></NavLink>
                                <NavLink to='/MenAccessories'><li>Men Accessories</li></NavLink>
                                <NavLink to="/WomenAccessories"><li>Women Accessories</li></NavLink>
                                <NavLink to='/Watches'><li>Watches</li></NavLink>
                                <NavLink to="/Shoes"><li>Shoes</li></NavLink>
                            </ul>
                        </li>

                        <NavLink>
                            <li>GIFT BASKETS</li>
                        </NavLink>

                        <NavLink>
                            <li>CONTACT</li>
                        </NavLink>
                    </ul>
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
                                <NavLink to="/MenFashion"><li>Men Fashions</li></NavLink>
                                <NavLink to="/WomenFashion"><li>Women Fashions</li></NavLink>
                                <NavLink to='/MenAccessories'><li>Men Accessories</li></NavLink>
                                <NavLink to="/WomenAccessories"><li> Women Accessories</li></NavLink>
                                <NavLink to='/Watches'><li>Watches</li></NavLink>
                                <NavLink to="/Shoes"><li>Shoes</li></NavLink>
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
                        <div>
                            <FontAwesomeIcon icon={faUser} onClick={handleShowCustomDialog} ref={iconRef} className={navbarstyles.userIcon} />
                            {showCustomUserDialog && (
                                <div className={navbarstyles.customDialog} ref={profileRef}>

                                    {loggedIn ? (
                                        <div className={navbarstyles.signOutWrapper}>
                                            {member && member.user && member.user.firstname && (
                                                <h2>{member.user.firstname}</h2>
                                            )}
                                            <div className={navbarstyles.iconsAndPicWrapper} >
                                                <div><FontAwesomeIcon icon={faUser} /> My Profile</div>
                                                <div><FontAwesomeIcon icon={faGear} /> Account Setting</div>
                                                <div><FontAwesomeIcon icon={faCircleQuestion} /> Need Help?</div>
                                                <div onClick={handleLogOut}><FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={navbarstyles.loginWrapper}>
                                            <NavLink to="/Login">
                                                <p>Log In</p>
                                            </NavLink>
                                        </div>
                                        
                                    )}
                                    
                                </div>
                            )}
                        </div>

                        <NavLink to="/WishList">
                            <div className={navbarstyles.cartWrapper}>
                                <span>{wishListItems.length === 0 ? "" : wishListItems.length}</span>
                                <FontAwesomeIcon icon={faHeart} />
                            </div>
                        </NavLink>

                        <NavLink>
                            <div className={navbarstyles.cartWrapper}>
                                <span>{cartItems.length === 0 ? "" : cartItems.length}</span>
                                <FontAwesomeIcon icon={faCartShopping} onClick={handleOpenCart} />
                            </div>
                        </NavLink>

                        <dialog  ref={cartDialogRef}>
                            <div className={cartstyle.dialogHeaderWrapper}>
                                <h2 className={cartstyle.headerWrapper}>Your cart</h2>
                                <FontAwesomeIcon icon={faXmark} className={cartstyle.closeButton} onClick={handleCloseDialog}/>
                            </div>

                            {filterCartItems && filterCartItems.length > 0  && (
                                <div className={cartstyle.cartContainer}>
                                    {filterCartItems.map((elem, id) => (
                                        <div key={id} className={cartstyle.itemWrapper} >
                                            <div className={cartstyle.cartWrapper}>
                                                <div className={cartstyle.imageWrapper}>
                                                    <img src={`${backEndUrl}/productimages/${elem.image}`} alt="" width="100%" height="100%" />
                                                </div>
                                                <div className={cartstyle.titleAmoutWrapper}>
                                                    <div>
                                                        {elem.title}
                                                    </div>
                                                    <div className={cartstyle.quantityWrapper}>
                                                        <div className={cartstyle.addMinusButtonWrapper}>
                                                            <FontAwesomeIcon icon={faMinus} onClick={() => handleMinusItemQuantity(elem._id)}/>
                                                            {elem.quantity}
                                                            <FontAwesomeIcon icon={faPlus} onClick={() => {handleAddItemFromCart(elem._id, elem.price, elem.salepercentage, elem.quantity)}} />
                                                        </div>

                                                        <div className={cartstyle.quantityTotalAmoutWrapper}>
                                                            <strong>
                                                                $ {(elem.quantity * parseFloat(elem.price.replace(/,/g, ""))).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className={cartstyle.cartFooter}>
                                <div>
                                    <p>SUBTOTAL<span><strong style={{color:"white", fontSize: "1.5rem"}}>$ {totalAmount}</strong></span></p>
                                </div>
                                <div>
                                    <p>Taxes and shipping calculated at checkout</p>
                                    <NavLink to="CheckOut">
                                        <button onClick={handleGoToCheckOut}>CHECK OUT </button>
                                    </NavLink>
                                </div>
                            </div>
                            

                        </dialog>

                        
                    </div>
                    
                </div>
            </nav>
            <Outlet />
        </>
    )
}

export default Navbar