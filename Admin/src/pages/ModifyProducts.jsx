import modifyproductstyle from "../styles/modifyproductsstyle.module.css"
const ModifyProducts = () => {
    return (
        <div  className={modifyproductstyle.mainContainer}>
            <h1>Modify Products</h1>

            <div className={modifyproductstyle.subContainer}>

                <div className={modifyproductstyle.productListWrapper}>

                </div>

                <div className={modifyproductstyle.addProductWrapper}>
                    <h2>Add Product</h2>
                    <form>
                        <label htmlFor="Title">Title:
                            <input type="text" name="title" id="Title" required />
                        </label>

                        <label htmlFor="Price">Price:
                            <input type="number" name="price" id="Price" required />
                        </label>

                        <label htmlFor="Description">Description:
                            <input type="text" name="description" id="Description" required />
                        </label>

                        <label htmlFor="Category">Category:
                            <input type="text" name="category" id="Category" required />
                        </label>

                        <label htmlFor="Rating">Rating: 
                            <input type="number" name="rating" id="Rating" required />
                        </label>

                        <label htmlFor="Count">Count:
                            <input type="number" name="count" id="Count" required />
                        </label>

                        <fieldset>
                            <label htmlFor="Image">Image:
                                <input type="file" name="image" id="Image" required />
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