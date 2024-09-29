import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {Outlet, NavLink, useNavigate} from "react-router-dom"

import navbarstyles from "../styles/navbarstyles.module.css"
import cartstyle from "../styles/cartstyle.module.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faCartShopping, faMagnifyingGlass, faCaretDown, faGear, faCircleQuestion, faArrowRightFromBracket, faXmark, faMinus, faPlus, faHeart} from "@fortawesome/free-solid-svg-icons";

import { useCart } from "./CartContext";

const backEndUrl = import.meta.env.VITE_BACKENDURL


const Navbar = () => {

    const {cartItems, addToCart, removeFromCart, totalPriceOfQuantity, totalAmount} = useCart()

    const navigate = useNavigate()

    const profileRef = useRef(null)
    const iconRef = useRef(null)
    const dropDwnRef = useRef(null)
    const closeDropDwnRef = useRef(null)
    const cartDialogRef = useRef(null)


    const [showDropDown, setShowDropDown] = useState(false)
    const [showCustomUserDialog, setShowCustomUserDialog] = useState(false)

    const [allProducts, setAllProducts] = useState([])
    const [filterCartItems, setFilterCartItems] = useState([]);
    const [count, setCount] = useState(0);

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

                setAllProducts(formatedData)

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
                        {/* <p>PRIME PICKS</p> */}
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
                            <div className={navbarstyles.cartWrapper}>
                                <span>0</span>
                                <FontAwesomeIcon icon={faHeart} />
                            </div>
                        </NavLink>

                        <NavLink>
                            <div className={navbarstyles.cartWrapper}>
                                <span>{cartItems.length}</span>
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