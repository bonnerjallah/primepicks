import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import moredetailsstyle from "../styles/moredetailsstyle.module.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faStarHalf, faArrowRight} from "@fortawesome/free-solid-svg-icons"


const backEndUrl = import.meta.env.VITE_BACKENDURL




const MoreDetails = () => {

    const { id } = useParams();

    const [filterProduct, setFilterProduct] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [intrestProduct, setIntrestProduct] = useState([])

    //fetch data
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
                
            } catch (error) {
                console.log("Error fetching data", error)
            }
        }
        fetchData()
    }, [])



    

    console.log("intrest", intrestProduct)



    return (
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
                    <strong>{filterProduct.title}</strong>
                </div>

                <div>
                    {filterProduct.description}
                </div>

                <div className={moredetailsstyle.productPriceAndDetails}>
                    <p className={moredetailsstyle.shippingMethod}><em><strong>Shipping</strong></em> calculated at checkout.</p>
                    <hr />
                    <div className={moredetailsstyle.addtoCartWrapper}>
                        <button>ADD TO CART</button>
                        <button>ADD TO WISH LIST</button>
                    </div>
                </div>

                <div>
                    {filterProduct.sale ? (
                        <div style={{ width: "100%" }}>
                            <div style={{ color: "red" }}>
                                {`$ ${(filterProduct.price - (filterProduct.price * filterProduct.salepercentage / 100)).toFixed(2)} 
                                (${filterProduct.salepercentage}% off)`}
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
                        <>
                            <div>
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
                        </>
                    )}
                </div>
            </div>
            <div className={moredetailsstyle.mightBeIntrestedWrapper}>

            </div>
        </div>
    );
};

export default MoreDetails;
