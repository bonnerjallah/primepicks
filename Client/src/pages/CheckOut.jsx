import { useSearchParams } from "react-router-dom"

import checkoutstyle from "../styles/checkoutstyle.module.css"

const stateAbbreviations = [
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

    // const [searchPrams] = useSearchParams()
    // const id = searchPrams.get("id")


    return (
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

                            <label htmlFor="BillingState">
                                <select name="billingstate" id="BillingState">
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
                                <input type="checkbox" name="economy" id="Economy" />
                                <p>
                                    Economy
                                    <small>5 to 8 business days</small>
                                </p>
                            </label>
                            <strong>Free</strong>
                        </div>

                        <div>
                            <label htmlFor="USPS">
                                <input type="checkbox" name="usps" id="USPS"  />
                                <p>
                                    USPS Ground Advantage
                                    <small>5 business days</small>
                                </p>
                            </label>
                            <strong>$ 8.44</strong>
                        </div>

                        <div>
                            <label htmlFor="UPS">
                                <input type="checkbox" name="ups" id="UPS"  />
                                <p>
                                    UPS Priority Mail
                                    <small>1 business days</small>
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

            </div>
            
        </div>
    )
}

export default CheckOut