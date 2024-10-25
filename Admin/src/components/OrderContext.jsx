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




    const fetchAllOrders = useCallback(async () => {
    
        try {
            const response = await axios.get(`${backEndUrl}/getorders`);
            const existingOrder = response.data;
    
            const ordersWithImages = existingOrder.map(order => {
                return {
                    ...order,
                    item: order.item.map(elem => {
                        const matchingProduct = allProducts.filter(proElem => proElem._id === elem.id);
    
                        return {
                            ...matchingProduct, 
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

            if(orderMatch) {
                const orderWithImage = {
                    ...orderMatch,
                    item: orderMatch.item.map(elem => {
                        const matchingProduct = allProducts.find(proElem => proElem._id === String(elem.id));

                        return {
                            ...elem,
                            ...matchingProduct,
                            image: matchingProduct ? matchingProduct.image : null
                        }
                    })
                }
                setOrderToDisPlay(orderWithImage)

            }


            
        } else {
            console.log("No Orders found")
        }
    }, [allOrders, allProducts]);


    const shipOrder = async (id) => {
        try {
            const response = await axios.put(`${backEndUrl}/shiporder/${id}`)

            if(response.status === 200 ) {
                setOrderToDisPlay((prev) => prev.map(elem => elem._id === id ? {...order, ...response.data.order} : order))
            }

            
        } catch (error) {
            console.log("Error updating order data", error)
        }
    }


    useEffect(() => {
        if (allProducts.length > 0) {
            fetchAllOrders();
        }
    }, [allProducts]); 
    

    return (
        <OrderContext.Provider value={{fetchAllOrders, allOrders, displayOrder, orderToDisplay, shipOrder}}>
            {children}
        </OrderContext.Provider>
    )
}