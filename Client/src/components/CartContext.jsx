import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    
    const [wishListItems, setWishListItems] = useState(() => {
        const savedWishList = localStorage.getItem("wishListItems");
        return savedWishList ? JSON.parse(savedWishList) : [];
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
                    return cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem });
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

    useEffect(() => {
        if (wishListItems.length > 0) {
            localStorage.setItem("wishListItems", JSON.stringify(wishListItems));
        }
    }, [wishListItems]);

    const addToWishList = (item) => {
        setWishListItems((prevItems) => {
            const existingItem = prevItems.find(wishItem => wishItem.id === item.id);
            if (!existingItem) {
                return [...prevItems, item];
            }
            return prevItems; 
        });
    }

    const removeFromWishList = (id) => {
        setWishListItems((prevItems) => {
            const updatedItems = prevItems.filter(elem => elem.id !== id); 
    
            localStorage.setItem("wishListItems", JSON.stringify(updatedItems));
    
            return updatedItems;
        });
    };


    const totalItems = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }, [cartItems])


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
        <CartContext.Provider value={{ cartItems, addToCart, wishListItems, addToWishList, removeFromWishList, removeFromCart, totalItems, totalAmount }}>

            {children}
            
        </CartContext.Provider>
    );
};
