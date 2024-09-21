import { useState, useEffect } from "react"
import queryString from "query-string"
import { useLocation } from "react-router-dom"
import axios from "axios"

const backEndUrl = import.meta.env.VITE_BACKENDURL

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons"

import manfashionstyle from "../styles/manfashionstyle.module.css"

const MenFashion = () => {

    const {id} = queryString.parse(location.search)

    const [menShopData, setMenShopData] = useState([])

    //Fetch store data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/getallproducts`)
                const data = response.data

                const formatedData = data.map((elem) => ({
                    ...elem,
                    price: typeof elem.price === "number" ? elem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : elem.price
                }))

                const menData = formatedData.filter((elem) => elem.category.includes("men's clothing"));


                setMenShopData(menData)

            } catch (error) {
                console.log("Error fetching data", error)
            }
        }
        fetchData()
    }, [])




    return (
        <div className={manfashionstyle.mainContainer}>
            <h1>Men Fashion</h1>

            <hr />

            <div className={manfashionstyle.sortContainer}>
                
                Sort By:

                <select name="" id="">
                    <option value=""></option>
                    <option value="bestSelling">Best Selling</option>
                    <option value="a-z">Alphabetically, A-Z</option>
                    <option value="z-a">Alphabetically, Z-A</option>
                    <option value="priceLowToHigh">Price, low to high</option>
                    <option value="priceHighToLow">Price, high to low</option>
                </select>
            </div>

            <div className={manfashionstyle.allProductsContainer}>
                {menShopData && menShopData.length > 0 && (
                    <>
                        {menShopData.map((elem, id) => (
                            <div key={id}>
                                <div className={manfashionstyle.productContainer}>
                                    <div className={manfashionstyle.porductImageWrapper}>
                                        <img src={`${backEndUrl}/productimages/${elem.image}`} alt="product title" width="100%" height="100%" />
                                    </div>
                                    <div className={manfashionstyle.productNamePriceWrapper}>
                                        <div className={manfashionstyle.productNameWrapper}>
                                            <strong>{elem.title}</strong>
                                            <p>{elem.description}</p>
                                        </div>

                                        {elem.sale ? (
                                            <div style={{width:"100%"}}>
                                                <div style={{color: "red"}}>
                                                    {`$ ${(elem.price - (elem.price * elem.salepercentage / 100)).toFixed(2)} 
                                                    (${elem.salepercentage}% off)`}
                                                </div>


                                                <div style={{textDecoration: "line-through", margin: ".5rem 0"}}>
                                                    <strong style={{fontSize:"1.2rem"}}>$ {elem.price}</strong> 
                                                </div>

                                                <div>
                                                    {elem.rating && elem.rating.rate > 0 ? (
                                                        <div style={{ display: "flex" }}> 
                                                            {/* Render full stars */}
                                                            {Array.from({ length: Math.max(0, Math.floor(Number(elem.rating.rate))) }, (_, i) => (
                                                                <FontAwesomeIcon key={i} icon={faStar} style={{ width: "20px", height: "20px", marginRight: "5px" }} /> 
                                                            ))}

                                                            {/* Check if there should be a half star */}
                                                            {elem.rating.rate % 1 !== 0 && (
                                                                <FontAwesomeIcon icon={faStarHalf} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                                            )}
                                                        </div>
                                                    ) : ""}
                                                </div>

                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <strong style={{fontSize:"1.2rem"}}>$ {elem.price}</strong> 
                                                </div>

                                                <div>
                                                    {elem.rating && elem.rating.rate > 0 ? (
                                                        <div style={{ display: "flex" }}> 
                                                            {/* Render full stars */}
                                                            {Array.from({ length: Math.max(0, Math.floor(Number(elem.rating.rate))) }, (_, i) => (
                                                                <FontAwesomeIcon key={i} icon={faStar} style={{ width: "20px", height: "20px", marginRight: "5px" }} /> 
                                                            ))}

                                                            {/* Check if there should be a half star */}
                                                            {elem.rating.rate % 1 !== 0 && (
                                                                <FontAwesomeIcon icon={faStarHalf} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                                            )}
                                                        </div>
                                                    ) : ""}
                                                </div>
                                            </>
                                        )}

                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

            </div>

        </div>
        
    )
}

export default MenFashion