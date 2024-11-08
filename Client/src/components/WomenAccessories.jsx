import { useState, useEffect } from "react"
import axios from "axios"

const backEndUrl = import.meta.env.VITE_BACKENDURL

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faStarHalf, faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons"

import manfashionstyle from "../styles/manfashionstyle.module.css"

import ScrollToTop from "./ScrollToTop"
import Footer from "./Footer"
import { NavLink } from "react-router-dom"


const WomenAccessories = () => {


    const [womenAccessoriesData, setWomenAccessoriesData] = useState([])
    const [sortBy, setSortBy] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage] = useState(9)

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


                const womenAccessData = formatedData.filter((elem) => elem.category.includes("women's") && elem.category.includes("accessories"));


                setWomenAccessoriesData(womenAccessData)

            } catch (error) {
                console.log("Error fetching data", error)
            }
        }
        fetchData()
    }, [])

    //Handle sorting 
    const handleSortBy = (e) => {
        const selectedValue = e.target.value
        setSortBy(selectedValue)

        let sortedData = [...womenAccessoriesData]

        if(selectedValue === "a-z") {
            sortedData.sort((a, b) => a.title.localeCompare(b.title))
        } else if (selectedValue === "z-a") {
            sortedData.sort((a, b) => b.title.localeCompare(a.title))
        } else if (selectedValue === "priceLowToHigh") {
            sortedData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        } else if (selectedValue === "priceHighToLow") {
            sortedData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        }

        setWomenAccessoriesData(sortedData); 
    }

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when data changes
    }, [womenAccessoriesData]);
    

    //Get current product to display
    const indexofLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexofLastProduct - productsPerPage
    const currentProduct = womenAccessoriesData.slice(indexOfFirstProduct, indexofLastProduct)

    //Pagination logic
    const pageNumbers = []

    const totalProducts = womenAccessoriesData.length
    const productsToShowPerPage = productsPerPage

    for(let i = 1; i <= Math.ceil(totalProducts / productsToShowPerPage); i++) {
        pageNumbers.push(i)
    }

    //Function to go to next page
    const handleNextPage = (nextPage) => {
        setCurrentPage(nextPage);
    }


    return (
        <>
            <ScrollToTop />

            <div className={manfashionstyle.mainContainer}>
                <h1>Women Accessories</h1>

                <hr />

                <div className={manfashionstyle.sortContainer}>
                    
                    Sort By:

                    <select name="" id="" onChange={handleSortBy}>
                        <option value=""></option>
                        <option value="a-z">Alphabetically, A-Z</option>
                        <option value="z-a">Alphabetically, Z-A</option>
                        <option value="priceLowToHigh">Price, low to high</option>
                        <option value="priceHighToLow">Price, high to low</option>
                    </select>
                </div>

                <div className={manfashionstyle.allProductsContainer}>
                    {womenAccessoriesData && womenAccessoriesData.length > 0 && (
                        currentProduct.map((elem, id) => (
                            <NavLink key={id} to={`/MoreDetails/${elem._id}`}>
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
                                            <div style={{ width: "100%" }}>
                                                <div style={{ color: "red" }}>
                                                    {`$ ${(parseFloat(elem.price.replace(/,/g, "")) - (parseFloat(elem.price.replace(/,/g, "")) * elem.salepercentage / 100)).toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})} 
                                                    (${elem.salepercentage}% off)`}
                                                </div>

                                                <div style={{ textDecoration: "line-through", margin: ".5rem 0" }}>
                                                    <strong style={{ fontSize: "1.2rem" }}>$ {elem.price}</strong>
                                                </div>

                                                <div>
                                                    {elem.rating && elem.rating.rate > 0 ? (
                                                        <div style={{ display: "flex" }}>
                                                            {Array.from({ length: Math.max(0, Math.floor(Number(elem.rating.rate))) }, (_, i) => (
                                                                <FontAwesomeIcon key={i} icon={faStar} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                                            ))}

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
                                                    <strong style={{ fontSize: "1.2rem" }}>$ {elem.price}</strong>
                                                </div>
                                                <div>
                                                    {elem.rating && elem.rating.rate > 0 ? (
                                                        <div style={{ display: "flex" }}>
                                                            {Array.from({ length: Math.max(0, Math.floor(Number(elem.rating.rate))) }, (_, i) => (
                                                                <FontAwesomeIcon key={i} icon={faStar} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                                            ))}

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
                            </NavLink>
                        ))
                    )}
                </div>

                <div className={manfashionstyle.paginationWrapper}>
                    <FontAwesomeIcon 
                        icon={faAnglesLeft} 
                        onClick={() => handleNextPage(currentPage > 1 ? currentPage - 1 : currentPage)} 
                        style={{ cursor: currentPage > 1 ? 'pointer' : 'not-allowed', opacity: currentPage > 1 ? 1 : 0.5 }} 
                    />

                    {pageNumbers.map((nextPage) => (
                        <li 
                            key={nextPage} 
                            onClick={() => handleNextPage(nextPage)} 
                            style={{ backgroundColor: currentPage === nextPage ? "#000000" : "#22c1c3", color: currentPage === nextPage ? "white" : "" }}
                        >
                            {nextPage}
                        </li>
                    ))}

                    <FontAwesomeIcon 
                        icon={faAnglesRight} 
                        onClick={() => handleNextPage(currentPage < pageNumbers.length ? currentPage + 1 : currentPage)} 
                        style={{ cursor: currentPage < pageNumbers.length ? 'pointer' : 'not-allowed', opacity: currentPage < pageNumbers.length ? 1 : 0.5 }} 
                    />
                </div>


            </div>
        
            <Footer />
        </>
    )
}

export default WomenAccessories