import { useEffect, useState } from "react"
import { useCart } from "./CartContext"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import ScrollToTop from "./ScrollToTop"

import wishliststyle from "../styles/wishliststyle.module.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faStarHalf, faArrowRight} from "@fortawesome/free-solid-svg-icons"

const backEndUrl = import.meta.env.VITE_BACKENDURL


const WishList = () => {

    const navigate = useNavigate()
    const {wishListItems, addToCart, removeFromWishList} = useCart()

    const [wishListProducts, setWishListProducts] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/getallproducts`)
                const data = response.data

                const wishListIds = wishListItems.map(elem => elem.id)

                const wishItems = data.filter(elem => wishListIds.includes(elem._id))

                const formattedWishItems = wishItems.map((elem) => {

                    //Ensure the price is a string
                    const price = typeof elem.price === "string" ? elem.price.replace(/,/g, "") : elem.price

                    const parsedPrice = parseFloat(price) || 0

                    const salePercentage = elem.salePercentage === "" ? 0 : parseInt(elem.salepercentage) || 0;
                
                    const discountedPrice = elem.sale === "true" ? parsedPrice - (salePercentage * parsedPrice / 100) : parsedPrice;
                
                    return {
                        ...elem,
                        price: discountedPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

                    }
            
                })

                setWishListProducts(formattedWishItems)


            } catch (error) {
                console.log("Error fetching data", error)
            }
        }
        fetchData()
    }, [wishListItems])

    const handleAddToCart = (id, price, salepercentage) => {
        addToCart({id, price, salepercentage, quantity: 1})
        removeFromWishList(id)
    }

    const handleRemoveWishListItem = (id) => {
        removeFromWishList(id)
    }

    const handleContinueShppingButton = () => {
        navigate(-1)
    }


    return (
        <>
            <ScrollToTop />
            <div className={wishliststyle.mainContainer}>
                <h1>Wish List</h1>
                {wishListProducts && wishListProducts.length > 0 ? (
                    <div className={wishliststyle.itemsContainer}>
                        {wishListProducts.map((elem, id) => (
                            <div key={id} className={wishliststyle.itemWrapper}>
                                <div className={wishliststyle.imageWrapper}>
                                    <img src={`${backEndUrl}/productimages/${elem.image}`} alt="product image" width="100" height="100" />
                                    <div>
                                        <div>
                                            <em>{elem.title}</em>
                                        </div>
                                        <div>
                                            $ <strong>{elem.price}</strong>
                                        </div>
                                        <div className={wishliststyle.ratingWrapper}>
                                            {elem && elem.rating && elem.rating.rate > 0 ? (
                                                <div>
                                                    {Array.from({length: Math.max(0, Math.floor(Number(elem.rating.rate))) }, (_, i) => (
                                                        <FontAwesomeIcon key={i} icon={faStar} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                                    ))}

                                                    {elem.rating.rate % 1 !== 0 && (
                                                        <FontAwesomeIcon icon={faStarHalf} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                                    )}
                                                </div>
                                            ) : ""}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={wishliststyle.buttnWrapper}>
                                    <button onClick={() => {handleAddToCart(elem._id, elem.price, elem.salepercentage)}}>Add to cart</button>
                                    <button onClick={() => {handleRemoveWishListItem(elem._id)}}>Remove from wish list</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ):(
                    <div className={wishliststyle.noItemsWrapper}>
                        <div>
                            <p>No Items in wish list</p>
                        </div>
                        <div className={wishliststyle.continueShopping}>
                            <div onClick={handleContinueShppingButton}>
                                <p>Continue Shopping</p>
                                <FontAwesomeIcon icon={faArrowRight} className={wishliststyle.arrowIcon}/>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
        
    )
}

export default WishList