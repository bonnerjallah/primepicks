import { useState, useRef, useEffect } from 'react';
import { useOrder } from '../components/OrderContext';



import vieworderstyle from "../styles/vieworderstyle.module.css"
import { NavLink } from 'react-router-dom';

const ViewOrderAndStatus = () => {

    const {allOrders, fetchAllOrders} = useOrder()

    useEffect(() => {
        fetchAllOrders()
    }, [])


    return (
        <div className={vieworderstyle.mainContainer}>
            <h1>View Orders</h1>

                <table>
                    <thead>
                        <tr>
                            <th>PLACED AT</th>
                            <th>ITEMS</th>
                            <th>ORDER TRACKING</th>
                            <th>ORDER STATUS</th>
                            <th>SHIPPING METHOD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allOrders && allOrders.length > 0 && (
                            allOrders.map((elem, id) => (
                                <tr key={id}>
                                    <td><NavLink to={`/OrderStatusUpdate/${elem._id}`}>{new Date(elem.createdAt).toLocaleString()}</NavLink></td>
                                    <td>{elem.item.length}</td>
                                    <td><NavLink to={`/OrderStatusUpdate/${elem._id}`}>{elem.ordertrackingnumber}</NavLink></td>
                                    <td>{elem.orderstatus}</td>
                                    <td>{elem.shippingmethod}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                
                
        </div>
    )
}

export default ViewOrderAndStatus