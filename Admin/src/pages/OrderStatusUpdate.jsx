import { useParams } from "react-router-dom"
import { useOrder } from "../components/OrderContext"
import {useEffect, useState} from "react"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


import orderandstatusupdatestyle from "../styles/orderandstatusupdatestyle.module.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEllipsis} from "@fortawesome/free-solid-svg-icons";

const OrderStatusUpdate = () => {

    const {id} = useParams()
    const {allOrders, fetchAllOrders, displayOrder, orderToDisplay, shipOrder} = useOrder()

    const [filledOrders, setFilledOrders] = useState(false);

    const handleOrderToDisplay = (id) => {
        displayOrder(id)
    }

    // const handleOrderFiled = (e) => {
    //     e.preventDefault()
    //     setFilledOrders((prev) => (!prev));
    // };

    const handleShipOrder = (id) => {
        shipOrder(id)
    }

    let color;
    switch (orderToDisplay.orderstatus) {
        case "pending":
            color = "orange";
            break;
        case "shipped":
            color = "blue";
            break;
        case "delivered":
            color = "green";
            break;
        case "cancelled":
            color = "red";
            break;
        default:
            color = "black"; 
            break;
    }
    

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    useEffect(() => {
        displayOrder(id);
    }, [id, allOrders, displayOrder]);

    

    return (
        <div className={orderandstatusupdatestyle.mainContainer} >
            <h1>Order Status & Update</h1>
            <label htmlFor="Search">
                Search:
                <input type="text" name='search' id='Search' placeholder='Enter Order Tracking #' />
            </label>
            <div className={orderandstatusupdatestyle.subContainer}>
                
                <div className={orderandstatusupdatestyle.orderTrackingNumContainer}>
                    <h2>Pending Orders</h2>
                    {allOrders && allOrders.length > 0 ? (
                        allOrders.map((elem, id) => {
                            if(elem.orderstatus === "pending") {
                                return(
                                    <ul key={id}>
                                        <li onClick={(e) => {handleOrderToDisplay(elem._id)}}>{elem.ordertrackingnumber}</li>
                                    </ul>
                                )
                            } 
                            return null
                        })
                    ) : (
                        <p>No orders found</p>
                    )}
                </div>
                <div className={orderandstatusupdatestyle.fillOrderFormContainer}>
                    
                    <div>
                        <h2>Order Tracking #: {orderToDisplay.ordertrackingnumber}  </h2>
                        <div className={orderandstatusupdatestyle.orderDetails}>
                            <>
                                {orderToDisplay?.contact ? (
                                    <div>
                                        <h3>SHIPPING INFO</h3>
                                        <div style={{display: "flex", columnGap:".3rem"}}>
                                            <p>{orderToDisplay.contact.firstname.charAt(0).toUpperCase() + orderToDisplay.contact.firstname.slice(1)}</p>
                                            <p>{orderToDisplay.contact.lastname.charAt(0).toUpperCase() + orderToDisplay.contact.lastname.slice(1)}</p>
                                        </div>
                                        <p>{orderToDisplay.contact.address.streetname}</p>
                                        <p>{orderToDisplay.contact.address.city} <span>{orderToDisplay.contact.address.state}</span> <span>{orderToDisplay.contact.address.zipcode}</span></p>
                                        <p>{orderToDisplay.contact.phonenumber}</p>
                                        <p>{orderToDisplay.contact.email}</p>
                                    </div>
                                ) : (
                                    <p>No contact information available</p>
                                )}
                            </>
                            <>
                                {orderToDisplay ? (
                                    <div>
                                        <h3>ORDER INFO</h3>
                                        <p>Total Items: {orderToDisplay?.item?.length}</p>
                                        <p>Created At: {new Date(orderToDisplay.createdAt).toLocaleString()}</p>
                                        <p>Shipping Method: {orderToDisplay.shippingmethod}</p>
                                        <p>Grand Total: $ {orderToDisplay.grandtotal}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h3>ORDER INFO</h3>
                                        <p>Total Items: </p>
                                        <p>Created At: </p>
                                        <p>Shipping Method: </p>
                                        <p>Grand Total: $ </p>
                                    </div>
                                )}
                            </>
                            <div>
                                <button className={orderandstatusupdatestyle.shipOrderbttn} onClick={()=> {handleShipOrder(orderToDisplay._id)}}>Ship Order</button>
                            </div>
                        </div>
                    </div>

                    <div className={orderandstatusupdatestyle.orderDetailsHeader}>
                        <p>Products</p>
                        <p>Title</p>
                        <p>Quantity</p>
                        <p>Status</p>
                        <p>Actions</p>
                    </div>

                        <div className={orderandstatusupdatestyle.orderDetailsContainer}>
                            {orderToDisplay && orderToDisplay.item && orderToDisplay.item.length > 0 ? (
                                orderToDisplay.item.map((elem, id) => {
                                    return (
                                        <div key={id} className={orderandstatusupdatestyle.itemWrapper}>
                                            <div>
                                                {elem.image ? (
                                                    <img src={`${backEndUrl}/productimages/${elem.image}`} alt={elem.title} width={100} height={100} />
                                                ) : (
                                                    'No image available'
                                                )}
                                            </div>
                                            <p>{elem.title}</p>
                                            <p>{elem.quantity}</p>
                                            <p style={{color:color}}>{orderToDisplay.orderstatus}</p>                                     
                                            <p onClick={(e) => handleOrderFiled(e, elem._id)}><FontAwesomeIcon icon={faEllipsis} className={orderandstatusupdatestyle.ellipsisIcon} /></p>
                                        </div>
                                    )
                                })
                
                            ) : (
                                <>
                                </>
                            )}
                        </div>

                </div>
            </div>
        </div>
    )
}

export default OrderStatusUpdate