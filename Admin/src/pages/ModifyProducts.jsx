import { useState, useEffect } from "react"
import axios from "axios"

import modifyproductstyle from "../styles/modifyproductsstyle.module.css"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const ModifyProducts = () => {

    const [productsInputData, setProductInputData] = useState({
        title: "",
        price: "",
        description: "",
        category: "",
        rating: "",
        count: ""
    })
    
    const [productImage, setProductImage] = useState("")

    const handleProductInputData = (e) => {
        const {name, value} = e.target
        setProductInputData((prev) => ({...prev, [name]: value}))
    }

    const handleProductImage = (e) => {
        setProductImage(e.target.files[0])
    }

    const handleInputSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append("title", productsInputData.title.trim())
        formData.append("price", productsInputData.price.trim())
        formData.append("description", productsInputData.description.trim())
        formData.append("category", productsInputData.category.trim())
        formData.append("rating", productsInputData.rating.trim())
        formData.append("count", productsInputData.count.trim())

        if(productImage) {
            formData.append("image", productImage, productImage.name)
        }

        try {
            const response = await axios.post(`${backEndUrl}/addproduct`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            })

            if(response.status === 200) {
                console.log("Inserted data successfully")
            }

            setProductInputData({
                title: "",
                price: "",
                description: "",
                category: "",
                rating: "",
                count: ""
            })
            
        } catch (error) {
            console.log("Error inputing data", error)
        }
    }

    return (
        <div  className={modifyproductstyle.mainContainer}>
            <h1>Modify Products</h1>

            <div className={modifyproductstyle.subContainer}>

                <div className={modifyproductstyle.productListWrapper}>

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