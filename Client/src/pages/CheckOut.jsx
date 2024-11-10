import { useSearchParams, NavLink, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";

import axios from "axios";

import checkoutstyle from "../styles/checkoutstyle.module.css"


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faPlus, faMinus, faXmark} from "@fortawesome/free-solid-svg-icons"

import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

import { useCart } from "../components/CartContext";

const backEndUrl = import.meta.env.VITE_BACKENDURL

const stateAbbreviations = [
    "State",
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", 
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
    "West Virginia", "Wisconsin", "Wyoming", "Washington D.C."
];


const CheckOut = () => {

    const {cartItems, totalAmount, clearCart} = useCart([])
    const navigate = useNavigate()
    
    const [grandTotalAmount, setGrandTotalAmount] = useState(0);
    const [filterCartItems, setFilterCartItems] = useState([]);

    const [shippingMethod, setShippingMethod] = useState('')
    const [shapingAsBilling, setShippingAsBilling] = useState(false)
    const [billing, setBilling] = useState({
        billingaddress: "",
        billingaptnumber: "",
        billingcity: "",
        billingzipcode: ""
    })
    const [billingstate, setBillingState] = useState("")
    const [emailMe, setEmailMe] = useState(false)
    const [state, setState] = useState("")

    const [checkOut, setCheckOut] = useState({
        email: "",
        firstname: "",
        lastname: "",
        address: "",
        aptnumber: "",
        city: "",
        zipcode: "",
        state: "",
        phonenumber: "",
        cardnumber: "",
        expdate: "",
        seccode: "",
        nameoncard: "",
    })

    const [successMsg, setSuccessMsg] = useState("")

    useEffect(() => {
        if (shapingAsBilling) {
            setBilling({
                billingaddress: checkOut.address,
                billingaptnumber: checkOut.aptnumber,
                billingcity: checkOut.city,
                billingzipcode: checkOut.zipcode,
                billingstate: checkOut.state
            });

            setBillingState({
                billingstate: checkOut.state
            })
        }
    }, [shapingAsBilling, checkOut]);


    const handleCheckOutDataSubmit = async (e) => {
        e.preventDefault()

        let shipMtd;
        switch (shippingMethod) {
            case "Free":
                shipMtd = "Economy"
                break;
            
            case "8.44":
                shipMtd = "usps"
                break;
            
            case "47.25":
                shipMtd = "ups"
                break
        
            default:
                break;
        }

        const shipingSameAsBilling = shapingAsBilling ? "true" : ""
    
        const dataToSubmit = {
            ...checkOut,
            filterCartItems,
            grandTotalAmount,
            shipMtd,
            shipingSameAsBilling,
            billingstate, 
            emailMe,
            state
        }

        try {
            const response = await axios.post(`${backEndUrl}/purchaseorders`, dataToSubmit, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {

                setSuccessMsg("Order place successfully, Check Email for Tracking")

                setCheckOut({
                    email: "",
                    firstname: "",
                    lastname: "",
                    address: "",
                    aptnumber: "",
                    city: "",
                    zipcode: "",
                    state: "",
                    phonenumber: "",
                    cardnumber: "",
                    expdate: "",
                    seccode: "",
                    nameoncard: "",
                })

                setBilling({
                    billingaddress: "",
                    billingaptnumber: "",
                    billingcity: "",
                    billingzipcode: ""
                })

                setEmailMe(false)

                setShippingAsBilling(false)

                setShippingMethod("")


                setFilterCartItems([])

                clearCart([])

                setTimeout(() => {
                    setSuccessMsg("")
                    navigate('/')
                }, 3000);

            }
            
        } catch (error) {
            console.log("Error inserting order data", error)
        }
    }




    //Fetch filter porduct data and cart items
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/getallproducts`,)
                const data = response.data

                const filterItems = data.filter(elem => 
                    cartItems.some(cartelem => cartelem.id === elem._id)
                );
                
                const formattedCartItemsData = filterItems.map(elem => {
                    const cartItem = cartItems.find(cartelem => cartelem.id === elem._id);
                    const quantity = cartItem ? cartItem.quantity : 1;

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
    }, [ cartItems])

    const handleShippingMethod = (ev) => {
        setShippingMethod(ev.target.value)
    }



    useEffect(() => {
        const handleGrandTotalAmount = () => {
            const parsedTotalAmount = parseFloat(totalAmount.replace(/,/g,""))
            const shippingCost = parseFloat(shippingMethod);

            if(isNaN(shippingCost)) {
                return setGrandTotalAmount(totalAmount)
            }

            const totalCost = parsedTotalAmount + shippingCost;
            
            setGrandTotalAmount(totalCost.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2}))
        }

        handleGrandTotalAmount()

    }, [shippingMethod, totalAmount]);



    const handleCheckOutInput = (e) => {
        const { name, value } = e.target;
    
        if (name.includes("billing")) {
            setBilling((prev) => ({ ...prev, [name]: value }));
        } else {
            setCheckOut((prev) => ({ ...prev, [name]: value }));
        }
    };
    


    return (
        <>
        <ScrollToTop />
            <div className={checkoutstyle.mainContainer}>

                <div className={checkoutstyle.checkOutDetailsContainer}>
                    <form onSubmit={handleCheckOutDataSubmit}>
                        <fieldset className={checkoutstyle.contactMeContainer}>
                            <h2>Contact</h2>
                            <label htmlFor="Contact">
                                <input type="text" name="email" value={checkOut.email} id="Contact" placeholder="Email" required onChange={handleCheckOutInput} />
                            </label>

                            <label htmlFor="EmailMe">
                                <input type="checkbox" checked={emailMe} name="emailme" id="EmailMe" onChange={(e) => {setEmailMe(e.target.checked)}} />
                                Email me with news and offers
                            </label>
                        </fieldset>

                        <fieldset className={checkoutstyle.customerInfoContainer}>
                            <div>
                                <label htmlFor="FirstName">
                                    <input type="text" name="firstname" value={checkOut.firstname} id="FirstName" placeholder="First Name" required onChange={handleCheckOutInput} />
                                </label>

                                <label htmlFor="LastName">
                                    <input type="text" name="lastname" value={checkOut.lastname} id="LastName" placeholder="Last Name" required onChange={handleCheckOutInput} />
                                </label>
                            </div>
                            
                            <label htmlFor="Address">
                                <input type="text" name="address" id="Address" value={checkOut.address} placeholder="Address" required onChange={handleCheckOutInput} />
                            </label>

                            <label htmlFor="ApartmentNumber">
                                <input type="text" name="aptnumber" value={checkOut.aptnumber} id="ApartmentNumber" placeholder="Apartment, suite, etc (optional)" onChange={handleCheckOutInput} />
                            </label>

                            <label htmlFor="City">
                                <input type="text" name="city" value={checkOut.city} id="City" placeholder="City" required onChange={handleCheckOutInput} />
                            </label>

                            <div>
                                <label htmlFor="ZipCode">
                                    <input type="number" name="zipcode" value={checkOut.zipcode} id="ZipCode" placeholder="Postal Code" required onChange={handleCheckOutInput} />
                                </label>

                                <label htmlFor="State">
                                    <select name="state" id="State"  onChange={(e) => {setState(e.target.value)}}>
                                            {stateAbbreviations.map((elem, index) => (
                                                <option key={index} value={elem}>
                                                    {elem}
                                                </option>
                                            ))}
                                    </select>
                                </label>
                            </div>

                            <label htmlFor="PhoneNumber">
                                <input type="number" name="phonenumber" value={checkOut.phonenumber} id="PhoneNumber" placeholder="Phone Number (optional)" onChange={handleCheckOutInput}  />
                            </label>
                        </fieldset>


                        <fieldset className={checkoutstyle.shippingMethodContainer}>
                            <h2>Shipping Method</h2>

                            <div>
                                <label htmlFor="Economy">
                                    <input type="radio" name="shippingeconomy" id="Economy" value="Free" onChange={handleShippingMethod} />
                                    <span>
                                        Economy
                                        <small>5 to 8 business days</small>
                                    </span>
                                </label>
                                <strong>Free</strong>
                            </div>

                            <div>
                                <label htmlFor="USPS">
                                    <input type="radio" name="shippingusps" id="USPS" value="8.44" onChange={handleShippingMethod} />
                                    <span>
                                        USPS Ground Advantage
                                        <small>5 business days</small>
                                    </span>
                                </label>
                                <strong>$ 8.44</strong>
                            </div>

                            <div>
                                <label htmlFor="UPS">
                                    <input type="radio" name="shippingups" id="UPS" value="47.25" onChange={handleShippingMethod} />
                                    <span>
                                        UPS Priority Mail
                                        <small>1 business day</small>
                                    </span>
                                </label>
                                <strong>$ 47.25</strong>
                            </div>
                        </fieldset>


                        <fieldset className={checkoutstyle.paymentContainer}>
                            <h2>Payment</h2>
                            <label htmlFor="CardNumber">
                                <input type="number" name="cardnumber" value={checkOut.cardnumber} id="CardNumber" placeholder="Card number" required onChange={handleCheckOutInput} />
                            </label>

                            <div>
                                <label htmlFor="ExpDate">
                                    <input type="number" name="expdate" value={checkOut.expdate} id="ExpDate" placeholder="Expiration date (MM/YY)" required onChange={handleCheckOutInput} />
                                </label>

                                <label htmlFor="SecCode">
                                    <input type="number" name="seccode" value={checkOut.seccode} id="SecCode" placeholder="Security code" required onChange={handleCheckOutInput} />
                                </label>
                            </div>

                            <label htmlFor="NameOnCard">
                                <input type="text" name="nameoncard" value={checkOut.nameoncard} id="NameOnCard" placeholder="Name On Card" required onChange={handleCheckOutInput} />
                            </label>

                            
                            <label htmlFor="SameAddress">
                                <input type="checkBox" name="sameaddress" checked={shapingAsBilling} id="SameAddress" onChange={(e) => setShippingAsBilling(e.target.checked)} />
                                <span>Use shipping address as billing address</span>
                            </label>

                            <div className={checkoutstyle.billingWrapper}>
                                <h4>Billing Address</h4>
                                
                                <label htmlFor="BillingAddress">
                                    <input type="text" name="billingaddress" value={billing.billingaddress} id="BillingAddress" placeholder="Address" required onChange={handleCheckOutInput} />
                                </label>

                                <label htmlFor="BillingAptNumber">
                                    <input type="text" name="billingaptnumber" value={billing.billingaptnumber} id="BillingAptNumber" placeholder="Apartment, suite, etc (optional)" onChange={handleCheckOutInput} />
                                </label>

                                <div>
                                    <label htmlFor="BillingCity">
                                        <input type="text" name="billingcity" value={billing.billingcity} id="BillingCity" placeholder="City" required onChange={handleCheckOutInput} />
                                    </label>

                                    <label htmlFor="BillingState">
                                        <select name="billingstate" id="BillingState" onChange={(e) => {setBillingState(e.target.value)}}>
                                                {stateAbbreviations.map((elem, index) => (
                                                    <option key={index} value={elem}>
                                                        {elem}
                                                    </option>
                                                ))}
                                        </select>
                                    </label>

                                    <label htmlFor="BillingZipCode">
                                        <input type="number" name="billingzipcode" value={billing.billingzipcode} id="BillingZipCode" placeholder="Postal code" required onChange={handleCheckOutInput} />
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                        

                        <button>Pay now</button>
                    </form>
                    
                </div>


                <div className={checkoutstyle.chartContainer}>

                    {filterCartItems && filterCartItems.length > 0  ? (
                        <div className={checkoutstyle.itemsContainer}>
                            {filterCartItems.map((elem, id) => (
                                <div key={id} className={checkoutstyle.cartWrapper}>
                                    
                                    <div className={checkoutstyle.imageWrapper}>
                                        <div>
                                            <img src={`${backEndUrl}/productimages/${elem.image}`} alt="items image" />
                                            <p style={{color:"black"}}>{elem.quantity}</p>
                                        </div>
                                        <div>
                                            {elem.title}
                                        </div>
                                    </div>

                                    <div className={checkoutstyle.quantityTotalAmoutWrapper}>
                                        <strong>
                                            $ {(elem.quantity * parseFloat(elem.price.replace(/,/g, ""))).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </strong>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{fontSize:"2rem", color:"blue", position: "fixed", marginLeft:"20%", top:"10rem", cursor:"pointer"}}>
                            <NavLink to="/">
                                <p>Continue Shopping</p>
                            </NavLink>
                        </div>
                    )}
                    <div className={checkoutstyle.cartFooter}>

                        {successMsg ? (
                            <div>
                                {successMsg && (<p style={{fontSize:"2rem", color:"black"}}>{successMsg}</p>)}

                            </div>

                        ) : (
                            
                            <div className={checkoutstyle.priceDetails}>
                                <div className={checkoutstyle.discountWrapper}>
                                    <input type="text" name="promotionalDiscount" id="PromotionDiscount" placeholder="Discount code or gift card" />
                                    <button>Apply</button>
                                </div>

                                <div>
                                    <div>
                                        <p>SUBTOTAL - <span>{cartItems.length} items</span></p>
                                        <strong>$ {totalAmount}</strong>
                                    </div>
                                    <div>
                                        <p>Shipping</p>
                                        <span>{shippingMethod ? shippingMethod : "Free"}</span>
                                    </div>
                                </div>


                                <div className={checkoutstyle.shippingAndTotalWrapper}>
                                    <div style={{fontSize:"1.5rem"}}>
                                        <p><strong>Total:</strong></p>
                                        <p>USD <strong style={{ color:"white"}}>${grandTotalAmount}</strong></p>
                                    </div>
                                </div>
                            </div>
                        )}

                        
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default CheckOut