import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        console.log(item)
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevItems.map(cartItem => {
                    return cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem;
                });
            } else {
                return [...prevItems, item];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(cartItem => cartItem.id === id)
            if(existingItem) {
                if(existingItem.quantity > 1) {
                    return prevItems.map(cartItem => cartItem.id === id ? {...cartItem, quantity: cartItem.quantity - 1} : cartItem ) 
                } else {
                    return prevItems.filter(cartItem => cartItem.id !== id)
                }
            }

            return prevItems
        })
    }

    const totalItems = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }, [cartItems])

    const totalPriceOfQuantity = useMemo(() => {
        const quantityAmount = cartItems.reduce((acc, elem) => {
            const price = typeof elem.price === "string" ? elem.price.replace(/,/g, "") : elem.price;
            const parsedPrice = parseFloat(price) || 0;

            const discountedPrice = parsedPrice - (elem.salepercentage * parsedPrice / 100);

            if (elem.quantity > 1) {
                const quantity = elem.quantity ? parseInt(elem.quantity, 10) : 1;
                const totalQuantityAmount = discountedPrice * quantity;

                return {  totalQuantityAmount };
            }
            return acc; 
        }, {});

        return quantityAmount; 
    }, [cartItems]);    



    const totalAmount = useMemo(() => {
        const amount = cartItems.reduce((sum, elem) => {
    
            const price = typeof elem.price === "string" ? elem.price.replace(/,/g, "") : elem.price

            const parsedPrice = parseFloat(price) || 0

            const discountprice = parsedPrice - (elem.salepercentage  * parsedPrice / 100)
    
            const quantity = elem.quantity ? parseInt(elem.quantity, 10) : 1;

            const totalCostForItem = discountprice * quantity;

            return sum + totalCostForItem;
        }, 0);  
    
        return amount.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2});
    }, [cartItems]);
    
    




    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalItems, totalPriceOfQuantity, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};
