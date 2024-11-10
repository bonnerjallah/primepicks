import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';

import moredetailsstyle from "../styles/moredetailsstyle.module.css"
import cartstyle from "../styles/cartstyle.module.css"


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faStarHalf, faArrowRight, faPlus, faMinus,faXmark} from "@fortawesome/free-solid-svg-icons"

import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';


const backEndUrl = import.meta.env.VITE_BACKENDURL


const MoreDetails = () => {

    const cartDialogRef = useRef(null)

    const {cartItems, addToCart, removeFromCart, addToWishList, totalAmount} = useCart()
    const {loggedIn} = useAuth()

    const { id } = useParams();
    const navigate = useNavigate();

    const [filterProduct, setFilterProduct] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [filterCartItems, setFilterCartItems] = useState([]);
    const [intrestProduct, setIntrestProduct] = useState([])
    const [count, setCount] = useState(0);


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

                const filterData = formatedData.find(elem => elem._id === id)

                setFilterProduct(filterData)

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
    }, [id, cartItems])


    // Suggest related products
    useEffect(() => {
        const suggestedProducts = () => {
            if(filterProduct) {
                const suggestion = allProducts.filter(elem => elem.category.includes(filterProduct.category) && elem._id !== filterProduct._id)

                const shuffledItems = [...suggestion].sort(() => Math.random() - 0.5).slice(0, 2)

                setIntrestProduct(shuffledItems);
            }
        }
        suggestedProducts();
    }, [allProducts, filterProduct]);


    const handleIntrestProductDetails = (_id) => {
        navigate(`/MoreDetails/${_id}`);
    };


    const handleMinusItemQuantity = (id) => {
        if (count > 0) {
            setCount(count - 1); 
            removeFromCart(id)
        }
    };


    useEffect(() => {
        const getQuantity = () => {
            const item = cartItems.find(elem => elem.id === filterProduct._id);
            const amount = item ? item.quantity : 0
            setCount(amount)
        }
        getQuantity()
    }, [cartItems, filterProduct])


    const handleAddItemQuantity = () => {
        setCount(count + 1); 
    };


    const handleAddToCart = (id, price, salepercentage) => {
        if (count >= 1) {
            addToCart({ id, quantity: count,  price, salepercentage });
            cartDialogRef.current?.showModal()

            document.body.style.overflow = "hidden"

            cartDialogRef.current?.addEventListener("close", handleCloseDialog)
        }
    };


    const handleCloseDialog = () => {
        cartDialogRef.current?.close()
        document.body.style.overflow = ""
    };


    const handleAddItemFromCart = (id, price, salepercentage) => {
        if(count >= 1) {
            addToCart({id, quantity: count, price, salepercentage})
        } 
    };


    const handleWishItem = (id) => {
        if(loggedIn) {
            addToWishList({id})
        } else {
            navigate("/Login")
        }
    };


   // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cartDialogRef.current) {
                const dialogDimensions = cartDialogRef.current.getBoundingClientRect();
                if (
                    e.clientX < dialogDimensions.left ||
                    e.clientX > dialogDimensions.right ||
                    e.clientY < dialogDimensions.top ||
                    e.clientY > dialogDimensions.bottom 
                ) {
                    handleCloseDialog()
                }
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside); 
        };
    }, []);




    return (

        <>
        <ScrollToTop />
            <div className={moredetailsstyle.mainContainer}>
                <div className={moredetailsstyle.imageWrapper}>
                    {filterProduct && (
                        <div>
                            <img src={`${backEndUrl}/productimages/${filterProduct.image}`} alt=""  width="100%"  height="100%" />
                        </div>
                    )}
                </div>
                <div className={moredetailsstyle.productDesWrapper}>

                    <div style={{fontSize:"2rem"}}>
                        {filterProduct && (
                            <strong>{ filterProduct.title}</strong>
                        )}
                    </div>

                    <div>
                        {filterProduct && (
                            <p style={{textAlign:"center"}}>
                                {filterProduct.description}
                            </p>
                        )}
                        
                    </div>

                    <div className={moredetailsstyle.productPriceAndDetails}>
                        <p className={moredetailsstyle.shippingMethod}><em><strong>Shipping</strong></em> calculated at checkout.</p>
                        <hr />
                        <div className={moredetailsstyle.addMinusWrapper}>
                            <p>Quantity</p>
                            <div>
                                <FontAwesomeIcon icon={faMinus} onClick={() => handleMinusItemQuantity(filterProduct._id)} />
                                <p>{count}</p>
                                <FontAwesomeIcon icon={faPlus} onClick={handleAddItemQuantity} />
                            </div>
                        </div>


                        <div className={moredetailsstyle.addtoCartWrapper}>
                            
                            <button onClick={() => {handleAddToCart(filterProduct._id, filterProduct.price, filterProduct.salepercentage);}}>ADD TO CART</button>

                            <button onClick={() => handleWishItem(filterProduct._id)}>ADD TO WISH LIST</button>
                        </div>
                        <NavLink to={`/CheckOut?id=${filterProduct._id}`}>
                            <p>More payment options</p>
                        </NavLink>
                    </div>

                    <dialog ref={cartDialogRef}>
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
                                                        <FontAwesomeIcon icon={faPlus} onClick={() => {handleAddItemFromCart(elem._id, elem.price, elem.salepercentage)}} />
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
                                <NavLink to="/CheckOut">
                                    <button>CHECK OUT </button>
                                </NavLink>
                            </div>
                        </div>
                    </dialog>

                    <div>
                        {filterProduct && filterProduct.sale ? (
                            <div style={{ width: "100%" }} className={moredetailsstyle.amountAndStarWrapper}>
                                <div className={moredetailsstyle.percentageOffWrapper}>
                                    <strong>
                                        {`$ ${(parseFloat(filterProduct.price.replace(/,/g, "")) - (parseFloat(filterProduct.price.replace(/,/g, "")) * filterProduct.salepercentage / 100)).toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}`}
                                    </strong>
                                    {`(${filterProduct.salepercentage}% off)`}
                                </div>

                                <div style={{ textDecoration: "line-through", margin: ".5rem 0" }}>
                                    <strong style={{ fontSize: "1.2rem" }}>$ {filterProduct.price}</strong>
                                </div>

                                <div>
                                    {filterProduct.rating && filterProduct.rating.rate > 0 ? (
                                        <div style={{ display: "flex" }}>
                                            {Array.from({ length: Math.max(0, Math.floor(Number(filterProduct.rating.rate))) }, (_, i) => (
                                                <FontAwesomeIcon key={i} icon={faStar} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                            ))}

                                            {filterProduct.rating.rate % 1 !== 0 && (
                                                <FontAwesomeIcon icon={faStarHalf} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                            )}
                                        </div>
                                    ) : ""}
                                </div>
                            </div>
                        ) : (
                            <div className={moredetailsstyle.amountAndStarWrapper}>
                                <div>

                                    {filterProduct && (
                                        <strong style={{ fontSize: "1.5rem" }}>$ {filterProduct.price}</strong>
                                    )}
                                </div>
                                <div>
                                    {filterProduct && filterProduct.rating && filterProduct.rating.rate > 0 ? (
                                        <div style={{ display: "flex" }}>
                                            {Array.from({ length: Math.max(0, Math.floor(Number(filterProduct.rating.rate))) }, (_, i) => (
                                                <FontAwesomeIcon key={i} icon={faStar} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                            ))}

                                            {filterProduct.rating.rate % 1 !== 0 && (
                                                <FontAwesomeIcon icon={faStarHalf} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                            )}
                                        </div>
                                    ) : ""}
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                {intrestProduct && intrestProduct.length > 0 && (
                    < div className={moredetailsstyle.mightBeIntrestedWrapper}>
                        <p style={{textAlign: "center"}}><strong>You Might Also Like</strong></p>
                        {intrestProduct.map((elem, id) => (
                            <div key={id} className={moredetailsstyle.intrestWrapper}>
                                <NavLink to={`/MoreDetails/${elem._id}`}>
                                    <div className={moredetailsstyle.intrestProdImageWrapper} onClick={() => handleIntrestProductDetails(elem._id)}>
                                        <img src={`${backEndUrl}/productimages/${elem.image}`} alt="" width="100%" height="100%" />
                                    </div>
                                </NavLink>
                                
                                <div>
                                    <p>{elem.title}</p>
                                    <div>
                                        {elem.sale ? (
                                            <div style={{ width: "100%" }}>
                                                <div style={{color:"red"}}>
                                                    <strong style={{marginRight: "1rem"}}>
                                                        {`$ ${(parseFloat(elem.price.replace(/,/g, "")) - (parseFloat(elem.price.replace(/,/g, "")) * elem.salepercentage / 100)).toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}`}
                                                    </strong>
                                                    {`(${elem.salepercentage}% off)`}
                                                </div>

                                                <div style={{ textDecoration: "line-through", margin: ".5rem 0" }}>
                                                    <strong style={{ fontSize: "1rem" }}>$ {elem.price}</strong>
                                                </div>

                                                <div>
                                                    {elem.rating && elem.rating.rate > 0 ? (
                                                        <div style={{ display: "flex" }}>
                                                            {Array.from({ length: Math.max(0, Math.floor(Number(elem.rating.rate))) }, (_, i) => (
                                                                <FontAwesomeIcon key={i} icon={faStar} style={{ width: "15px", height: "15px", marginRight: "5px" }} />
                                                            ))}

                                                            {elem.rating.rate % 1 !== 0 && (
                                                                <FontAwesomeIcon icon={faStarHalf} style={{ width: "15px", height: "15px", marginRight: "5px" }} />
                                                            )}
                                                        </div>
                                                    ) : ""}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={moredetailsstyle.intrestedPriceWrapper}>
                                                <div>
                                                    <strong style={{ fontSize: "1rem" }}>$ {elem.price}</strong>
                                                </div>
                                                <div>
                                                    {elem.rating && elem.rating.rate > 0 ? (
                                                        <div style={{ display: "flex" }}>
                                                            {Array.from({ length: Math.max(0, Math.floor(Number(elem.rating.rate))) }, (_, i) => (
                                                                <FontAwesomeIcon key={i} icon={faStar} style={{ width: "15px", height: "15px", marginRight: "5px" }} />
                                                            ))}

                                                            {elem.rating.rate % 1 !== 0 && (
                                                                <FontAwesomeIcon icon={faStarHalf} style={{ width: "15px", height: "15px", marginRight: "5px" }} />
                                                            )}
                                                        </div>
                                                    ) : ""}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>

    );
};

export default MoreDetails;
