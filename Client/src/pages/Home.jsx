import homestyle from "../styles/homestyle.module.css"
import { NavLink } from "react-router-dom";
import { Facebook, Twitter  } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import Footer from "../components/Footer";
import { useEffect } from "react";
import axios from "axios"
import { useState } from "react";

const backEndUrl = import.meta.env.VITE_BACKENDURL

import RandomTwelve from "../components/RandomTwelve";
import ScrollToTop from "../components/ScrollToTop";


const Home = () => {

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
            
            <ScrollToTop />

            <div className={homestyle.heroSection}>
                <a href="#main">
                    <button>Shop Now</button>
                </a>
            </div>
            <div className={homestyle.introWrapper}>
                <p>Prime Picks was created to provide opportunity for local artisans, makers.</p>
                <p>Our mission is to connect local producers to local consumers enabling the discovery of amazing products.</p>
            </div>

            <main id="main">
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
                    
                    <img src={`${backEndUrl}/productimages/${randomProduct.image}`} alt="" width="50%" height="100%" />

                    <div className={homestyle.randomProductPriceAndDetails}>
                        <p className={homestyle.productName}> { randomProduct ? randomProduct.title : ""}</p>
                        <p className={homestyle.productPrice}> $ {randomProduct ? randomProduct.price : ""}</p>
                        <p className={homestyle.shippingMethod}><em><strong>Shipping</strong></em> calculated at checkout.</p>
                        <hr />
                        <div className={homestyle.addtoCartWrapper}>
                            <button>ADD TO CART</button>
                            <p>More payment options</p>
                        </div>

                        <p className={homestyle.fullDetailsWrapper}>Full details 
                            <FontAwesomeIcon icon={faArrowRight} className={homestyle.rightArrowIcon} />
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