import { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const ProductContext = createContext()

export const useProducts = () => useContext(ProductContext)

export const ProductsProvider = ({children}) => {

    const [allProducts, setAllProducts] = useState([])
    const [filterProducts, setFilterProduct] = useState([])
    const [productToEdit, setProductToEdit] = useState({
        category: "",
        description: "",
        image: "",
        price: "",
        rating:{rate: "" || 0, count: "" || 0},
        sale: "",
        salepercentage: "" || 0,
        title: ""
    });
    const [onSale, setOnSale] = useState(false)
    const [editedImage, setEditedImage] = useState('')




    const fetchStoreProducts = async () => {
        try {
            const response = await axios.get(`${backEndUrl}/getallproducts`)
            const data = response.data
            
            const formattedData = data.map(elem => ({
                ...elem,
                price: typeof elem.price === "number" ? elem.price.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2}) : elem.price
            }))

            setAllProducts(formattedData)
            
        } catch (error) {
            console.log("Error fetching store products", error)
        }

    }

    const addProduct = async (productData, productImage) => {

        const formData = new FormData()

        formData.append("title", productData.title.trim())
        formData.append("price", productData.price.trim())
        formData.append("description", productData.description.trim())
        formData.append("category", productData.category.trim())
        formData.append("rating", productData.rating.trim())
        formData.append("count", productData.count.trim())

        if(productImage) {
            formData.append("image", productImage, productImage.name)
        }

        try {
            const response = await axios.post(`${backEndUrl}/addproduct`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            })

            if(response.status === 200) {
                console.log("Successfully added item to database")

                setAllProducts((prevProd) => [...prevProd, response.data])
            }
            
        } catch (error) {
            console.log("Error adding item", error)
        }
    }

    const applyFilter  = async (searchQuery, keywordSearch) => {
        const filteredItems = allProducts.filter((elem) => {
            if (keywordSearch === "title") {
                return elem.title.toLowerCase().includes(searchQuery.toLowerCase());
            } else if (keywordSearch === "category") {
                return elem.category
                .toLowerCase()
                .split(",")
                .some(elem => elem.trim().includes(searchQuery.toLowerCase()))
            }
            return true;
        });
    
        setFilterProduct(filteredItems);
    }

    const applySort = (sortType) => {
        const sortedProduct = filterProducts.length > 0 ? [...filterProducts] : [...allProducts];
    
        switch (sortType) {
            case "category":
                sortedProduct.sort((a, b) => a.category.localeCompare(b.category));
                break;
    
            case "name":
                sortedProduct.sort((a, b) => a.title.localeCompare(b.title));
                break;
    
            case "pricehightolow":
                sortedProduct.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
    
            case "pricelowtohigh":
                sortedProduct.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
    
            case "onSale":
                sortedProduct = sortedProduct.filter(elem => elem.sale === "true");
                break;
    
            case "az":
                sortedProduct.sort((a, b) => a.title.localeCompare(b.title));
                break;
    
            case "za":
                sortedProduct.sort((a, b) => b.title.localeCompare(a.title));
                break;
    
            default:
                break;
        }
    
        setFilterProduct(sortedProduct);
    }

    const setProductForEditing = (id) => {
        const editingProduct = allProducts.find((elem) => elem._id === id);
        if (editingProduct) {
            const formattedProduct = {
                ...editingProduct,

                price: typeof editingProduct.price === "string"
                ? parseFloat(editingProduct.price.replace(/,/g, "")) || 0
                : (typeof editingProduct.price === "number" ? editingProduct.price : 0), 

                salepercentage: parseFloat(editingProduct.salepercentage) || 0,
                rating: {
                    rate: editingProduct.rating?.rate || 0,
                    count: editingProduct.rating?.count || 0,
                },
            };
            setOnSale(editingProduct.sale === "true");
            setProductToEdit(formattedProduct);
        }

    };

    const handleProductToEdit = (id) => {
        const editingProduct = allProducts.find((elem) => elem._id === id);

        if (editingProduct) {
            const formattedProduct = {
                ...editingProduct,

                price: typeof editingProduct.price === "string"
                ? parseFloat(editingProduct.price.replace(/,/g, "")) || 0
                : (typeof editingProduct.price === "number" ? editingProduct.price : 0), 

                rating: {
                    rate: editingProduct.rating?.rate || 0,
                    count: editingProduct.rating?.count || 0,
                },
            };

            setOnSale(editingProduct.sale === "true");
            setProductToEdit(formattedProduct);
        }
    };

    const handleProductInputData = (e) => {
        const { name, value } = e.target;
        if (name === "rate" || name === "count") {
            setProductToEdit((prev) => ({
                ...prev,
                rating: { ...prev.rating, [name]: value },
            }));
        } else {
            setProductToEdit((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const productImageHandler = (imageFile) => setEditedImage(imageFile);

    const handleEditSubmitData = async (id) => {
        const formData = new FormData()

        formData.append("id", productToEdit._id)
        formData.append("category", productToEdit.category.trim())
        formData.append("description", productToEdit.description.trim())
        formData.append("price", String(productToEdit.price).trim())
        formData.append("rating[rate]", String(productToEdit.rating.rate).trim() || 0)
        formData.append("rating[count]", String(productToEdit.rating.count).trim() || 0)
        formData.append("salepercentage", String(productToEdit.salepercentage).trim() || 0)
        formData.append("title", productToEdit.title.trim())

        const OnSaleProd = onSale ? "true" : ""
        formData.append("sale", OnSaleProd)

        if(editedImage) {
            formData.append("editedImage", editedImage, editedImage.name)
        }

        

        // console.log(Array.from(formData.entries()));

        try {
            const response = await axios.put(`${backEndUrl}/editproduct`, formData, id)

            if(response.status === 200) {

                const updatedData = response.data;

                setAllProducts((prevProd) => prevProd.map((elem) => elem._id === updatedData._id ? updatedData : elem));

                setOnSale(false)

                setProductToEdit({
                    category: "",
                    description: "",
                    image: "",
                    price: "",
                    rating:{rate: "" || 0, count: "" || 0},
                    sale: "",
                    salepercentage: "" || 0,
                    title: ""
                })

            }
            
        } catch (error) {
            console.log("Error inputing product edit data", error)
        }
    }

    const handleDeletingItem = async (id) => {
        try {
            const response = await axios.delete(`${backEndUrl}/deleteitem/${id}`, {
                headers:{"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                console.log("deleted item data successfully")

                setProductToEdit({
                    category: "",
                    description: "",
                    image: "",
                    price: "",
                    rating: { rate: "", count: "" },
                    sale: "",
                    salepercentage: "",
                    title: ""
                });

                setOnSale(false);
            }
            
        } catch (error) {
            console.log("Error deleting item data", error)
        }
    }

    const toggleOnSale = (value) => {
        setOnSale(value);
    };

    
    useEffect(() => {
        fetchStoreProducts(); // Fetch products on mount
    }, []);

    return (
        <ProductContext.Provider value={{
            fetchStoreProducts, 
            allProducts, 
            addProduct, 
            filterProducts, 
            applyFilter, 
            applySort, 
            setProductForEditing, 
            productToEdit, 
            onSale,
            toggleOnSale,
            handleProductInputData,
            handleProductToEdit,
            productImageHandler,
            handleEditSubmitData,
            handleDeletingItem
            
        }}>

            {children}

        </ProductContext.Provider>
    )
}

