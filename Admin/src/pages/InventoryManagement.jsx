import { useState, useEffect } from 'react';
import {useParams} from "react-router-dom"

import { useProducts } from '../components/ProductsContext';


// import axios from "axios"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";


const backEndUrl = import.meta.env.VITE_BACKEND_URL

import inventorymanagementstyle from "../styles/inventorymanagementstyle.module.css"
import modifyproductstyle from "../styles/modifyproductsstyle.module.css"



const InventoryManagement = () => {
    
    const {id} = useParams()
    const {allProducts, fetchStoreProducts, applyFilter, filterProducts, applySort, setProductForEditing, productToEdit, onSale,toggleOnSale, handleProductInputData, productImageHandler, handleProductToEdit, handleEditSubmitData, handleDeletingItem } = useProducts()

    const [userErrorMsg, setUserErrorMsg] = useState("")
    const [userSuccMsg, setUserSucMsg] = useState("")

    


    useEffect(() => {
        fetchStoreProducts()
        setProductForEditing(id);
    },[])



    const handleInputChange  = (e) => {
        handleProductInputData(e); 
    }

    const handleProdEditImage = (e) => {
        productImageHandler(e.target.files[0])
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        handleEditSubmitData(id)
        
        
    }

    const handleEditProduct =  async (id) => {
        handleProductToEdit(id)
    }


    const handleDeleteItem = async (e, id) => {
        e.preventDefault()

        const isConfirmed = window.confirm("Are you sure you want to delete this item?");

        if(isConfirmed) {
            handleDeletingItem(id)
        }
    }








    return (
        <div className={inventorymanagementstyle.mainContainer}>
            <h1>Inventory Management</h1>
            <div className={inventorymanagementstyle.subContainer}>
                <div className={inventorymanagementstyle.productWrapper}>
                    <div className={inventorymanagementstyle.searchContainer}>
                        <h2>Filter By:</h2>
                        <form>
                            <select name="" id="">
                                <option value="">Search By:</option>
                                <option value="">Title</option>
                                <option value="">Category</option>
                            </select>
                            <label htmlFor="Keyword">
                                keyword:
                                <input type="text" name="keyword" id="Keyword" placeholder="Search" />
                            </label>
                            <button type="submit">Search <FontAwesomeIcon icon={faSearch} /> </button>
                        </form>
                        
                    </div>
                    <div className={inventorymanagementstyle.products}>
                        {allProducts && (
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

                                    <div className={modifyproductstyle.buttonWrapper}>
                                        <button className={modifyproductstyle.discountBttn} onClick={(e) => handleEditProduct(elem._id)}>Edit</button>

                                        <button onClick={(e) => handleDeleteItem(e, elem._id)} className={modifyproductstyle.deleteBttn} >Delete</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={inventorymanagementstyle.editWrapper}>

                    <div className={inventorymanagementstyle.promotionalWrapper}>
                        <h2> Edit Product</h2>
                        <div className={inventorymanagementstyle.imageWrapper}>
                            {productToEdit && productToEdit.image !== "" ? (
                                <img src={`${backEndUrl}/productimages/${productToEdit.image}`} alt="" width={100} height={100} />
                            ) : (
                                ""
                            )}
                        </div>
                        <p>Product Id #: {productToEdit._id}</p>
                    </div>

                    <div className={inventorymanagementstyle.editFromContainer}>

                        <form onSubmit={handleEditSubmit} encType="multipart/form-data" >
                            <fieldset>
                                <label htmlFor="Title">Title:
                                    <input type="text" name="title" id="Title" value={productToEdit.title} onChange={handleInputChange} required />
                                </label>

                                <label htmlFor="Price">Price:
                                    <input type="number" name="price" id="Price" value={productToEdit.price} onChange={handleInputChange} required />
                                </label>

                                <label htmlFor="Description">Description:
                                    <input type="text" name="description" id="Description" value={productToEdit.description} onChange={handleInputChange} required />
                                </label>

                                <label htmlFor="Category">Category:
                                    <input type="text" name="category" id="Category" value={productToEdit.category} onChange={handleInputChange} required />
                                </label>

                                <label htmlFor="Rating">Rating: 
                                    <input type="number" name="rate" id="Rating" value={productToEdit.rating.rate} onChange={handleInputChange} min={0} max="5" step={0.1} required />
                                </label>

                                <label htmlFor="Count">Count:
                                    <input type="number" name="count" id="Count" value={productToEdit.rating.count} onChange={handleInputChange} required />
                                </label>

                                <label htmlFor="OnSale">On Sale:
                                    <input type="checkbox" name="onsale" id="OnSale" checked={onSale} onChange={(e) => toggleOnSale(e.target.checked)} />
                                </label>

                                <label htmlFor="percentageAmount">Sale%:
                                    <input type="number" name="salepercentage" id="percentageAmount" value={productToEdit.salepercentage} onChange={handleInputChange} />
                                </label>

                                

                            </fieldset>
                            
                            <div>
                                <label htmlFor="Image">Image:
                                    <input type="file" name="image" id="Image" accept="image/*" onChange={handleProdEditImage}/>
                                </label>

                                <button type="submit">Submit</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InventoryManagement