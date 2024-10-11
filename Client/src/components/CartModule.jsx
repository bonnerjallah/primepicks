import { useState, useEffect } from "react"
import {useCart} from "./CartContext"
import axios from "axios"

import useBodyScrollLock from "./useBodyScrollLock"

import cartstyle from "../styles/cartstyle.module.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faMinus, faPlus, faRectangleXmark} from "@fortawesome/free-solid-svg-icons"

const backEndUrl = import.meta.env.VITE_BACKENDURL


const CartModule = ({closeModule}) => {

    const { cartItems } = useCart();
    


    return (
        <div className={cartstyle.mainContainer}>
            <div className={cartstyle.closeButtonWrapper}>
                <FontAwesomeIcon icon={faRectangleXmark} onClick={(e) => {closeModule(false)}} className={cartstyle.closeButton} /> 
            </div>

            {filterCartItems && filterCartItems.length > 0  && (
                <>
                    <h2 className={cartstyle.headerWrapper}>Add To your cart</h2>

                    {filterCartItems.map((elem, id) => (
                        <div key={id} className={cartstyle.cartContainer}>
                            <div className={cartstyle.cartWrapper}>
                                <div className={cartstyle.imageWrapper}>
                                    <img src={`${backEndUrl}/productimages/${elem.image}`} alt="" width="100%" height="100%" />
                                </div>
                                <div>
                                    <div>
                                        {elem.title}
                                    </div>
                                    <div>
                                        <div>
                                            <FontAwesomeIcon icon={faMinus}/>
                                            {elem.quantity}
                                            <FontAwesomeIcon icon={faPlus} />
                                        </div>
                                        <div>
                                            
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}


            <div>
                <h2>Frequently Bought Together</h2>
                <div>
                    image slide
                </div>
            </div>

        </div>
    )
} 

export default CartModule