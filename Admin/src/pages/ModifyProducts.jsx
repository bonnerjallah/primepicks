import { useState, useEffect } from "react"
import {NavLink} from "react-router-dom"

import { useProducts } from "../components/ProductsContext"

import modifyproductstyle from "../styles/modifyproductsstyle.module.css"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const ModifyProducts = () => {

    const {allProducts, fetchStoreProducts, addProduct, applyFilter, filterProducts, applySort} = useProducts()

    const [productsInputData, setProductInputData] = useState({
        title: "",
        price: "",
        description: "",
        category: "",
        rating: "",
        count: ""
    })
    const [productImage, setProductImage] = useState("")
    const [keywordSearch, setKeyWordSearch] = useState("")
    const [searchQuery, setShearchQuery] = useState()


    //Fetch store data
    useEffect(() => {
        fetchStoreProducts()
    },[])

    //Handle new porduct input
    const handleProductInputData = (e) => {
        const {name, value} = e.target
        setProductInputData((prev) => ({...prev, [name]: value}))
    }

    const handleProductImage = (e) => {
        setProductImage(e.target.files[0])
    }

    //Haldle porduct submit to database
    const handleInputSubmit = async (e) => {
        e.preventDefault()

        await addProduct(productsInputData, productImage)

        setProductInputData({
            title: "",
            price: "",
            description: "",
            category: "",
            rating: "",
            count: ""
        });
        setProductImage(null);
    }

    const handleSearchQueryInput = (e) => {
        setShearchQuery(e.target.value);
    }

    const handleKeyword = (e) => {
        setKeyWordSearch(e.target.value);
    };

    const handleSearch = () => {
        applyFilter (searchQuery, keywordSearch); // Call filter function from context
    };


    const handleSort = (e) => {
        const sortType = e.target.value;
        applySort(sortType)
    };
    




    return (
        <div  className={modifyproductstyle.mainContainer}>
            <h1>Modify Products</h1>

            <div className={modifyproductstyle.subContainer}>

                <div className={modifyproductstyle.productListWrapper}>

                    <div className={modifyproductstyle.allProductsHeaderWrapper}>
                        <h2>All Products</h2>

                        <div className={modifyproductstyle.opitionsWrapper}>
                            <div>
                                <label htmlFor="keyWordSelection">
                                    Keyword:
                                    <select name="select" id="keyWordSelection" onChange={handleKeyword}>
                                        <option value=""></option>
                                        <option value="title">Title</option>
                                        <option value="category">Category</option>
                                    </select>
                                </label>
                                <label htmlFor="SearchProducts">
                                    <input type="text" name="searchproducts" id="SearchProducts" placeholder="Search" onChange={handleSearchQueryInput} />
                                </label>
                                <button onClick={handleSearch}>Search</button>
                            </div>

                            <div>
                                <label htmlFor="Sort">
                                    Sort By: 
                                    <select name="sort" id="Sort" onChange={handleSort}>
                                        <option value=""></option>
                                        <option value="catagory">Catagory</option>
                                        <option value="name">Name</option>
                                        <option value="pricehightolow">Price high-low</option>
                                        <option value="pricelowtohigh">Price low-high</option>
                                        <option value="onSale">On Sale</option>
                                        <option value="az">A-Z</option>
                                        <option value="za">Z-A</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                        
                    </div>

                    <div>
                        {filterProducts.length > 0 ? (
                            filterProducts.map((elem, id) => (
                                <div key={id} className={modifyproductstyle.productsWrapper}>
                                    <div className={modifyproductstyle.imageWrapper}>
                                        <div>
                                            <img src={`${backEndUrl}/productimages/${elem.image}`} alt="" width="100" height="100" />
                                        </div>
                                        <div className={modifyproductstyle.priceTitleWrapper}>
                                            <p>{elem.title}</p>
                                            <div className={modifyproductstyle.onSaleWrapper}>
                                                
                                                
                                                <p>On Sale</p>
                                                <p>{elem.salepercentage}% off</p>
                                            </div>
                                            <p>$ {elem.price}</p>
                                        </div>
                                    </div>

                                    <div>
                                        {elem.sale === "true" ? (
                                            <NavLink to={`/InventoryManagement/${elem._id}`}>
                                                <button className={modifyproductstyle.putOnSaleBttn}>Edit</button>
                                            </NavLink>
                                        ) : (
                                            <div>
                                                <NavLink to={`/InventoryManagement/${elem._id}`}>
                                                    <button className={modifyproductstyle.putOnSaleBttn}>Edit</button>
                                                </NavLink>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            allProducts.map((elem, id) => (
                                <div key={id} className={modifyproductstyle.productsWrapper}>
                                    <div className={modifyproductstyle.imageWrapper}>
                                        <div>
                                            <img src={`${backEndUrl}/productimages/${elem.image}`} alt="" width="100" height="100" />
                                        </div>
                                        <div className={modifyproductstyle.priceTitleWrapper}>
                                            <p>{elem.title}</p>

                                            {elem.sale ? (
                                                <div className={modifyproductstyle.onSaleWrapper}>
                                                    <p>Sale</p>
                                                    <p>{elem.salepercentage}% off</p>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            <p>$ {elem.price}</p>
                                        </div>
                                    </div>

                                    <div>
                                        {elem.sale === "true" ? (
                                            <div className={modifyproductstyle.onsaleAndBttnWrapper}>
                                                
                                                <div>
                                                    <NavLink to={`/InventoryManagement/${elem._id}`}>
                                                        <button className={modifyproductstyle.putOnSaleBttn}>Edit</button>
                                                    </NavLink>
                                                </div>
                                            </div>
                                        ) : (   
                                            <div className={modifyproductstyle.buttonWrapper}>
                                                <NavLink to={`/InventoryManagement/${elem._id}`}>
                                                    <button className={modifyproductstyle.putOnSaleBttn}>Manage Product</button>
                                                </NavLink>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={modifyproductstyle.addProductWrapper}>
                    <h2>Add Product</h2>
                    <form onSubmit={handleInputSubmit} encType="multipart/form-data" method="POST">
                        <label htmlFor="Title">Title:
                            <input type="text" name="title" id="Title" value={productsInputData.title} onChange={handleProductInputData} required />
                        </label>

                        <label htmlFor="Price">Price:
                            <input type="number" name="price" id="Price" value={productsInputData.price} onChange={handleProductInputData} required />
                        </label>

                        <label htmlFor="Description">Description:
                            <input type="text" name="description" id="Description" value={productsInputData.description} onChange={handleProductInputData} required />
                        </label>

                        <label htmlFor="Category">Category:
                            <input type="text" name="category" id="Category" value={productsInputData.category} onChange={handleProductInputData} required />
                        </label>

                        <label htmlFor="Rating">Rating: 
                            <input type="number" name="rating" id="Rating" value={productsInputData.rating} onChange={handleProductInputData} required />
                        </label>

                        <label htmlFor="Count">Count:
                            <input type="number" name="count" id="Count" value={productsInputData.count} onChange={handleProductInputData} required />
                        </label>

                        <fieldset>
                            <label htmlFor="Image">Image:
                                <input type="file" name="image" id="Image" accept="image/*" onChange={handleProductImage}/>
                            </label>
                        </fieldset>

                        <button type="submit">Add</button>
                    </form>
                </div>
            </div>


            
        </div>
    )
}

export default ModifyProducts