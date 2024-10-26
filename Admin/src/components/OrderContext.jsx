import {useState, useEffect, createContext, useContext, useCallback} from "react"
import { useProducts } from "./ProductsContext"
import axios from "axios"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const OrderContext = createContext()

export const useOrder = () => useContext(OrderContext)

export const OrderProvider = ({children}) => {

    const {allProducts} = useProducts()

    const [allOrders, setAllOrders] = useState([])
    const [orderToDisplay, setOrderToDisPlay] = useState([])
    const [mostSoldItems, setMostSoldItems] = useState([]);





    const fetchAllOrders = useCallback(async () => {
    
        try {
            const response = await axios.get(`${backEndUrl}/getorders`);
                const existingOrder = response.data;
                const ordersWithImages = existingOrder.map(order => {
                const formattedGrandTotal = order.grandtotal.toLocaleString("en-US", {
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
                });                
                return {
                    ...order,
                    formattedGrandTotal,
                    orderList: order.item.map(elem => {
                        const matchingProduct = allProducts.find(proElem => proElem._id === elem.id);
    
                        return {
                            ...matchingProduct, 
                            ...elem
                        };
                    })
                };
            });
    
            setAllOrders(ordersWithImages);
        } catch (error) {
            console.log("Error fetching order data", error);
        }
    }, [allProducts]); 
    

    const displayOrder = useCallback((id) => {
        if (allOrders && allOrders.length > 0) {
            const orderMatch = allOrders.find(elem => elem._id === id);            
            
            if (orderMatch) {
                const formattedGrandTotal = orderMatch.grandtotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                
                const orderWithImage = {
                    ...orderMatch,
                    grandtotal: formattedGrandTotal,
                    item: orderMatch.item.map(elem => {
                        const matchingProduct = allProducts.find(proElem => String(proElem._id) === String(elem.id)) || {};
                        
                        return {
                            ...elem,
                            ...matchingProduct,
                            image: matchingProduct.image || null // Set image if available, else null
                        };
                    })
                };
                
                console.log("orderwithimage", orderWithImage);
                setOrderToDisPlay(orderWithImage);
            }

            
        } else {
            console.log("No Orders found")
        }
    }, [allOrders, allProducts]);

    const shipOrder = async (id) => {
        try {
            const response = await axios.put(`${backEndUrl}/shiporder/${id}`)

            if (response.status === 200) {
                setOrderToDisPlay((prev) => {
                    if (Array.isArray(prev)) {
                        return prev.map(elem => elem._id === id ? {...elem, ...response.data.order} : elem);
                    }
                    return [response.data.order]; 
                })
            }

            
        } catch (error) {
            console.log("Error updating order data", error)
        }
    }

    const calculateMostSoldItem = useCallback(() => {
        const itemCounts = {};
    
        if (allOrders && allOrders.length > 0) {
            allOrders.forEach(order => {
                if (order.orderstatus === "shipped" || order.paymentstatus === "paid") {
                    order.item.forEach(itemElem => {
                        // Find the matching product to get the image
                        const matchingProduct = allProducts.find(prod => prod._id === itemElem.id);
                        const itemImage = matchingProduct ? matchingProduct.image : null;
                        const itemName = matchingProduct ? matchingProduct.title : null;
    
                        // Initialize item entry if it doesn't exist
                        if (!itemCounts[itemElem.id]) {
                            itemCounts[itemElem.id] = {
                                ...itemElem,
                                itemImage, 
                                itemName,
                                quantity: 0,
                                // orders: [] // Array to store matching orders
                            };
                        }
    
                        // Increment the quantity count for the item
                        itemCounts[itemElem.id].quantity += itemElem.quantity;
    
                        // Add the current order to the orders array for this item
                        // itemCounts[itemElem.id].orders.push(order);
                    });
                }
            });
        }
    
        // Convert the itemCounts object to an array and filter items with quantity > 1
        const soldItemsArray = Object.values(itemCounts).filter(item => item.quantity > 1);
    
        // Sort by quantity in descending order
        soldItemsArray.sort((a, b) => b.quantity - a.quantity);
    
        setMostSoldItems(soldItemsArray);
    }, [allOrders, allProducts]);
    
    
    



    useEffect(() => {
        if (allProducts.length > 0) {
            fetchAllOrders();
        }
    }, [allProducts]); 

    useEffect(() => {
        calculateMostSoldItem()
    }, [allOrders])
    

    return (
        <OrderContext.Provider value={{fetchAllOrders, allOrders, displayOrder, orderToDisplay, shipOrder, calculateMostSoldItem, mostSoldItems}}>
            {children}
        </OrderContext.Provider>
    )
}