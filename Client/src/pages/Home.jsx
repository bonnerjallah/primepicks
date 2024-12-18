import homestyle from "../styles/homestyle.module.css"
import { NavLink } from "react-router-dom";
import { Facebook, Twitter  } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import Footer from "../components/Footer";
import { useEffect } from "react";
import axios from "axios"
import { useState, useRef } from "react";

const backEndUrl = import.meta.env.VITE_BACKENDURL

import RandomTwelve from "../components/RandomTwelve";


const Home = () => {


    const shopnowRef = useRef()

    const [storeData, setStoreData] = useState([])
    const [randomProduct, setRandomProduct] = useState([])

    //fetch product from database
    useEffect(() => {
        const fetchData = async () => {
            try {

                const dataBaseResponse = await axios.get(`${backEndUrl}/getallproducts`)
                const dataBaseData = dataBaseResponse.data

                const formatedData = dataBaseData.map((elem) => ({
                    ...elem,
                    price: typeof elem.price === "number" ? elem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : elem.price
                }))


                setStoreData(formatedData)
                
            } catch (error) {
                console.log("Error fetching fake store data", error)
            }
        }

        fetchData()

    }, [])


    //Random products
    useEffect(() => {

        const randomProductsPicker = () => {
            if(storeData.length === 0) return null;

            const randomIndex = Math.floor(Math.random() * storeData.length)

            const selectedProduct = storeData[randomIndex]

            setRandomProduct(selectedProduct)
        }

        randomProductsPicker()

    }, [storeData])



    return (
        <div className={homestyle.Container}>
            
            <div className={homestyle.heroSection}>
                <button onClick={() => {
                    shopnowRef.current?.scrollIntoView({
                        behavior: "smooth"
                    })
                }}>Shop Now</button>
            </div>

            <div className={homestyle.introWrapper}>
                <p>Prime Picks was created to provide opportunity for local artisans, makers.</p>
                <p>Our mission is to connect local producers to local consumers enabling the discovery of amazing products.</p>
            </div>

            <main ref={shopnowRef}>
                <h2>Collections</h2>
                <hr />

                <div className={homestyle.collectionsWrapper}>

                    <NavLink to="/MenFashion">
                        <div className={homestyle.collectiosItemWrapper}>
                            <p>Men Fashion</p>
                            <img src="/images/kyle.jpg" alt="" width="100%" height="100%" />
                        </div>
                    </NavLink>
                    
                    <NavLink to="/WomenFashion">
                        <div className={homestyle.collectiosItemWrapper}>
                            <p>Women Fashion</p>
                            <img src="/images/freestocks.jpg" alt="" width="100%" height="100%" />
                        </div>
                    </NavLink>

                    <NavLink to="/Shoes">
                        <div className={homestyle.collectiosItemWrapper}>
                            <p>Shoes</p>
                            <img src="/images/shoemodal.jpg" alt="" width="100%" height="100%" />
                        </div>
                    </NavLink>

                    <NavLink to="/WomenAccessories">
                        <div className={homestyle.collectiosItemWrapper}>
                            <p>Women Accessories</p>
                            <img src="/images/marissa.jpg" alt="" width="100%" height="100%" />
                        </div>
                    </NavLink>

                    <NavLink to="/Watches">
                        <div className={homestyle.collectiosItemWrapper}>
                            <p>Watches</p>
                            <img src="/images/watch.jpg" alt="" width="100%" height="100%" />
                        </div>
                    </NavLink>

                    <NavLink to="/MenAccessories">
                        <div className={homestyle.collectiosItemWrapper}>
                            <p>Men Accessories</p>
                            <img src="/images/tiemodal.jpg" alt="" width="100%" height="100%" />
                        </div>
                    </NavLink>
                </div>

                <div className={homestyle.randomPorductContainer}>
                    <NavLink to={`/MoreDetails/${randomProduct._id}`}>
                        <img src={`${backEndUrl}/productimages/${randomProduct.image}`} alt="" width="100%" height="100%" />
                    </NavLink>

                    <div className={homestyle.randomProductPriceAndDetails}>
                        <p className={homestyle.productName}> { randomProduct ? randomProduct.title : ""}</p>
                        <p className={homestyle.productPrice}> $ {randomProduct ? randomProduct.price : ""}</p>
                        <p className={homestyle.shippingMethod}><em><strong>Shipping</strong></em> calculated at checkout.</p>
                        <hr />
                        <div className={homestyle.addtoCartWrapper}>
                            <NavLink to={`/MoreDetails/${randomProduct._id}`}>
                                <button>ADD TO CART</button>
                            </NavLink>
                            <NavLink to="CheckOut">
                                <p>More payment options</p>
                            </NavLink>
                        </div>

                        <p className={homestyle.fullDetailsWrapper}>
                            <NavLink to={`/MoreDetails/${randomProduct._id}`}>
                                Full details 
                                <FontAwesomeIcon icon={faArrowRight} className={homestyle.rightArrowIcon} />
                            </NavLink>
                        </p>

                        <div className={homestyle.socialContainer}>
                            <div>
                                <Facebook  size={20}/>
                                <small>Share</small>
                            </div>
                            <div>
                                <Twitter size={20} />
                                <small>Tweet</small>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <h2>Featured Faves</h2>
                <hr />

                <div className={homestyle.randomTwelveWrapper}>
                    <RandomTwelve />
                </div>

                <div className={homestyle.peopleSayingWrapper}>
                    <div>
                        <img src="/images/racks.jpg" alt=""  />
                    </div>
                    <div>
                        <p>See what people are saying!</p>
                    </div>
                </div>

                <div className={homestyle.subscribeWrapper}>
                    <div className={homestyle.subscribeWrapperHeader}>
                        <h2>Subscribe to our Newsletter</h2>
                        <p>Promotions, new products and sales. Directly to your inbox.</p>
                    </div>

                    <hr />

                    <div className={homestyle.subscribeWrapperInputWrapper}>
                        <input type="text" name="email" id="Email" placeholder="Your Email" />
                        <button>SUBSCRIBE</button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Home