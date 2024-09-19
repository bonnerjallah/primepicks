import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";



import inventorymanagementstyle from "../styles/inventorymanagementstyle.module.css"

const InventoryManagement = () => {
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

                    </div>
                </div>

                <div className={inventorymanagementstyle.editWrapper}>

                    <div className={inventorymanagementstyle.promotionalWrapper}>
                        <h2> Add Promotional Discount</h2>
                        <div className={inventorymanagementstyle.productImageAndInputWrapper}>
                            <div className={inventorymanagementstyle.productImageWrapper}>
                                imgage
                            </div>
                            <form>
                                <label htmlFor="ProductID">Product Id#:
                                    <input type="number" name="productid" id="ProductId" />
                                </label>

                                <label htmlFor="DiscountAmount">Percent: %  
                                    <input type="number" name="discountAmount" id="DiscountAmount" />
                                </label>
                                <button>Submit</button>
                            </form>
                        </div>
                    </div>

                    <div className={inventorymanagementstyle.salesProductWrapper}>
                        <h2>Add On Sale Products</h2>
                        <div className={inventorymanagementstyle.productImageAndInputWrapper}>
                            <div className={inventorymanagementstyle.productImageWrapper}>
                                imgage
                            </div>
                            <form>
                                <label htmlFor="ProductID">Product Id#:
                                    <input type="number" name="productid" id="ProductId" />
                                </label>

                                <label htmlFor="DiscountAmount">Percent: %
                                    <input type="number" name="discountAmount" id="DiscountAmount" />
                                </label>
                                <button>Submit</button>
                            </form>
                        </div>
                    </div>

                    <div className={inventorymanagementstyle.lowStockProductsWrapper}>
                        <h2>Low Stock Products</h2>


                    </div>

                </div>
            </div>
        </div>
    )
}

export default InventoryManagement