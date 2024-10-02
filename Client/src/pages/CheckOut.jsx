import { useSearchParams, NavLink } from "react-router-dom"
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

    const {cartItems, totalAmount} = useCart([])
    const [grandTotalAmount, setGrandTotalAmount] = useState(0);
    const [filterCartItems, setFilterCartItems] = useState([]);
    const [shippingMethod, setShippingMethod] = useState('')


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

                // setAllProducts(formatedData)

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



    return (
        <>
        <ScrollToTop />
            <div className={checkoutstyle.mainContainer}>
                <div className={checkoutstyle.checkOutDetailsContainer}>
                    <form >
                        <fieldset className={checkoutstyle.contactMeContainer}>
                            <h2>Contact</h2>
                            <label htmlFor="Contact">
                                <input type="text" name="contact" id="Contact" placeholder="Email or mobile phone number" required />
                            </label>

                            <label htmlFor="EmailMe">
                                <input type="checkbox" name="emalme" id="EmailMe" />
                                Email me with news and offers
                            </label>
                        </fieldset>

                        <fieldset className={checkoutstyle.customerInfoContainer}>
                            <div>
                                <label htmlFor="FirstName">
                                    <input type="text" name="firstname" id="FirstName" placeholder="First Name" required />
                                </label>

                                <label htmlFor="LastName">
                                    <input type="text" name="lastname" id="LastName" placeholder="Last Name" required />
                                </label>
                            </div>
                            
                            <label htmlFor="Address">
                                <input type="text" name="address" id="Address" placeholder="Address" required />
                            </label>

                            <label htmlFor="ApartmentNumber">
                                <input type="text" name="aptnumber" id="ApartmentNumber" placeholder="Apartment, suite, etc (optional)" />
                            </label>

                            <div>
                                <label htmlFor="ZipCode">
                                    <input type="number" name="zipcode" id="ZipCode" placeholder="Postal Code" required />
                                </label>

                                <label htmlFor="State">
                                    <select name="state" id="State">
                                            {stateAbbreviations.map((elem, index) => (
                                                <option key={index} value={elem}>
                                                    {elem}
                                                </option>
                                            ))}
                                    </select>
                                </label>
                            </div>

                            <label htmlFor="PhoneNumber">
                                <input type="number" name="phonenumber" id="PhoneNumber" placeholder="Phone Number (optional)"  />
                            </label>
                        </fieldset>


                        <fieldset className={checkoutstyle.shippingMethodContainer}>
                            <h2>Shipping Method</h2>

                            <div>
                                <label htmlFor="Economy">
                                    <input type="radio" name="shippingMethod" id="Economy" value="Free" onChange={handleShippingMethod} />
                                    <p>
                                        Economy
                                        <small>5 to 8 business days</small>
                                    </p>
                                </label>
                                <strong>Free</strong>
                            </div>

                            <div>
                                <label htmlFor="USPS">
                                    <input type="radio" name="shippingMethod" id="USPS" value="8.44" onChange={handleShippingMethod} />
                                    <p>
                                        USPS Ground Advantage
                                        <small>5 business days</small>
                                    </p>
                                </label>
                                <strong>$ 8.44</strong>
                            </div>

                            <div>
                                <label htmlFor="UPS">
                                    <input type="radio" name="shippingMethod" id="UPS" value="47.25" onChange={handleShippingMethod} />
                                    <p>
                                        UPS Priority Mail
                                        <small>1 business day</small>
                                    </p>
                                </label>
                                <strong>$ 47.25</strong>
                            </div>
                        </fieldset>


                        <fieldset className={checkoutstyle.paymentContainer}>
                            <h2>Payment</h2>
                            <label htmlFor="CardNumber">
                                <input type="number" name="cardnumber" id="CardNumber" placeholder="Card number" required />
                            </label>

                            <div>
                                <label htmlFor="ExpDate">
                                    <input type="number" name="expdate" id="ExpDate" placeholder="Expiration date (MM/YY)" required />
                                </label>

                                <label htmlFor="SecCode">
                                    <input type="number" name="seccode" id="SecCode" placeholder="Security code" required />
                                </label>
                            </div>

                            <label htmlFor="NameOnCard">
                                <input type="text" name="nameoncard" id="NameOnCard" placeholder="Name On Card" required />
                            </label>

                            
                            <label htmlFor="SameAddress">
                                <input type="checkBox" name="sameaddress" id="SameAddress" />
                                <p>Use shipping address as billing address</p>
                            </label>

                            <div className={checkoutstyle.billingWrapper}>
                                <h4>Billing Address</h4>
                                
                                <label htmlFor="BillingAddress">
                                    <input type="text" name="billingaddress" id="BillingAddress" placeholder="Address" required />
                                </label>

                                <label htmlFor="BillingAptNumber">
                                    <input type="text" name="billingaptnumber" id="BillingAptNumber" placeholder="Apartment, suite, etc (optional)" />
                                </label>

                                <div>
                                    <label htmlFor="BillingCity">
                                        <input type="text" name="billingcity" id="BillingCity" placeholder="City" required />
                                    </label>

                                    <label htmlFor="BillingState">
                                        <select name="billingstate" id="BillingState">
                                                {stateAbbreviations.map((elem, index) => (
                                                    <option key={index} value={elem}>
                                                        {elem}
                                                    </option>
                                                ))}
                                        </select>
                                    </label>

                                    <label htmlFor="BillingZipCode">
                                        <input type="number" name="billingZipCode" id="BillingZipCode" placeholder="Postal code" required />
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                        

                        <button>Pay now</button>
                    </form>
                    
                </div>


                <div className={checkoutstyle.chartContainer}>

                    {filterCartItems && filterCartItems.length > 0  && (
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
                    )}
                    <div className={checkoutstyle.cartFooter}>

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
                                <p>{shippingMethod ? (
                                    <p> 
                                        {shippingMethod}
                                    </p>
                                ) : (
                                    <p>Free</p>
                                )}</p>
                            </div>
                        </div>

                        <div className={checkoutstyle.shippingAndTotalWrapper}>
                            <div style={{fontSize:"1.5rem"}}>
                                <p><strong>Total:</strong></p>
                                <p>USD <strong style={{ color:"white"}}>${grandTotalAmount}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default CheckOut