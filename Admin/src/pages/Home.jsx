import { useState, useRef, useEffect } from 'react';
import { useOrder } from "../components/OrderContext"
import axios from 'axios';

const backEndUrl = import.meta.env.VITE_BACKEND_URL


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faCartShopping, faCreditCard, faDollarSign, faEllipsis, faUsers } from "@fortawesome/free-solid-svg-icons";

import homestyle from "../styles/homestyle.module.css";

const Home = () => { 

    const {allOrders} = useOrder()

    

    const [subMembers, setSubMembers] = useState([])
    const [totalSaleAmount, setTotalSaleAmount] = useState("")

    useEffect(() => {
        const fetchAllSubMemb = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/getallsubscribedmembers`)
                const data = response.data

                setSubMembers(data)
                
            } catch (error) {
                console.log("Error fetching members", error)
            }
        }

        fetchAllSubMemb()
    }, [])


    console.log("allorders", allOrders)

    const currentCount = subMembers.length; 
    const previousCount = 7; 

    let percentageChange = 0;
    if (previousCount > 0) {
        percentageChange = ((currentCount - previousCount) / previousCount) * 100; 
    }

    const changeColor = percentageChange >= 0 ? "green" : "red"; 
    const arrowIcon = percentageChange >= 0 ? faArrowUp : faArrowDown; 

    const currentTotalSaleAmount = totalSaleAmount
    const previousTotalSaleAmount = 0;

    let salePercentageChange = 0
    if(previousTotalSaleAmount > 0) {
        salePercentageChange = ((currentTotalSaleAmount - previousTotalSaleAmount) / previousTotalSaleAmount * 100)
    }

    const saleAmountColorChange = salePercentageChange >= 0 ? "green" : "red"
    const saleArrowIcon = salePercentageChange >= 0 ? faArrowUp : faArrowDown

    



    return (

        <div className={homestyle.mainContainer}>

            <h1>DashBoard</h1>
            
            <div className={homestyle.subContainer}>

                <div className={homestyle.middleSection}>

                    <div className={homestyle.topOfMiddleSection}>
                        <div className={homestyle.salesBox}>
                            <h2>Sales <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                            <div className={homestyle.subBoxWrapper}>
                                <FontAwesomeIcon icon={faCartShopping} className={homestyle.subIcon} />
                                <div>
                                    {totalSaleAmount && (
                                        <p style={{color: "black", fontSize:"1.5rem"}}>$ {totalSaleAmount}</p>
                                    )}
                                    <span style={{color: saleAmountColorChange}} ><FontAwesomeIcon icon={saleArrowIcon} /> {Math.abs(salePercentageChange.toFixed(2))}%</span>  
                                    <span style={{color: saleAmountColorChange}}>
                                        {salePercentageChange >= 0 ? "Increase" : "Decrease"}    
                                    </span>  
                                </div>
                            </div>
                        </div>
                        <div className={homestyle.revenueBox}>
                            <h2>Revenue <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                            <div className={homestyle.subBoxWrapper}>
                                <FontAwesomeIcon icon={faDollarSign} className={homestyle.subIcon} />
                                <div>
                                    <p style={{color: "black", fontSize:"1.5rem"}}>$ 87,762.96</p>
                                    <span style={{color: "green"}} ><FontAwesomeIcon icon={faArrowUp} /> 7%</span>  
                                    <span style={{color: "green"}}>Increased</span>  
                                </div>
                            </div>
                        </div>
                        <div className={homestyle.expensesBox}>
                            <h2>Total Expenses <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                            <div className={homestyle.subBoxWrapper}>
                                <FontAwesomeIcon icon={faCreditCard} className={homestyle.subIcon} />
                                <div>
                                    <p style={{color: "black", fontSize:"1.5rem"}}>$ 24,662.55</p>
                                    <span style={{color: "red"}} ><FontAwesomeIcon icon={arrowIcon} /> 7%</span>  
                                    <span style={{color: "red"}}>Expense</span>  
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    <div className={homestyle.customerBoxWrapper}>
                        <h2>Members <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>

                        <div>
                            <div className={homestyle.customersBox}>
                            <div className={homestyle.customerSubBoxWrapper}>
                            <FontAwesomeIcon icon={faUsers} className={homestyle.userIcon} />
                            <div>
                                {subMembers && subMembers.length > 0 && (
                                    <p style={{color: "black", fontSize:"1.5rem"}}>{subMembers.length}</p>
                                )}

                                <span style={{color: changeColor}}>
                                    <FontAwesomeIcon icon={arrowIcon} /> {Math.abs(percentageChange.toFixed(2))} % 
                                </span>
    
                                <span style={{color: changeColor}}>
                                    {percentageChange >= 0 ? "Increase" : "Decrease"}
                                </span>  
                            </div>
                        </div>

                            </div>
                            <div className={homestyle.customerListWrapper}>
                                <div className={homestyle.customerBioWapper}>
                                    <p>Name</p>
                                    <p>Email</p>
                                </div>

                                <div className={homestyle.subscriberWrapper}>
                                    {subMembers && subMembers.length > 0 ? (
                                        subMembers.map((elem, id) => (
                                            <ul key={id}>
                                                <li>
                                                    <span>{elem.firstname} {elem.lastname}</span>
                                                    <span>{elem.email}</span>
                                                </li>
                                            </ul>
                                        ))
                                        
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    <div className={homestyle.reportWrapper}>
                        <h2>Reports <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                    </div>

                    <div className={homestyle.recentSalesWrapper}>
                        <h2>Recent Sales <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                        <div className={homestyle.saleCustomerHeader}>
                            <p>Tracking #</p>
                            <p>Customer</p>
                            <p>Product</p>
                            <p>Price</p>
                            <p>Sipped At</p>
                        </div>
                        <div className={homestyle.allOrdersWrapper}>
                            {allOrders && allOrders.length > 0 ? (
                                allOrders.map((order, index) => (
                                    order.orderstatus === "shipped" ? (
                                        <div key={index} className={homestyle.orderdetailsWrapper}>
                                            <p>{order.ordertrackingnumber}</p>
                                            <p>{order.contact.firstname.charAt(0).toUpperCase() + order.contact.firstname.slice(1)} <span style={{marginLeft:".4rem"}}>{order.contact.lastname.charAt(0).toUpperCase() + order.contact.lastname.slice(1)}</span>
                                            </p>

                                            <div className={homestyle.productImageAndPriceWrapper}>

                                                {order.item && order.item.length > 0 ? (
                                                    order.item.map((elemWrapper, idx) => {
                                                        // Access the first property of elemWrapper (e.g., elemWrapper[0])
                                                        const itemelem = elemWrapper[0]; 
                                                        return (

                                                            <div key={idx} className={homestyle.topSalesImageWrapper}>
                                                                <div>
                                                                    {itemelem && itemelem.image ? (
                                                                        <div className={homestyle.imageWrapper}>
                                                                            <img src={`${backEndUrl}/productimages/${itemelem.image}`} alt="product image" width={40} height={40} />
                                                                        </div>
                                                                    ) : (
                                                                        'No image available'
                                                                    )}
                                                                </div>
                                                                

                                                                <div className={homestyle.priceWrapper}>
                                                                    <p>$ {itemelem.price}</p>
                                                                </div>
                                                            </div> 
                                                        );
                                                    })
                                                ) : (
                                                    <p>No items available</p>
                                                )}
                                            </div>
                                            
                                            <p>{new Date(order.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    ) : null
                                ))
                            ) : (
                                <p>No orders available</p>
                            )}
                        </div>

                    </div>

                    <div className={homestyle.topSellingWrapper}>
                        <h2>Top Selling <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                        <div>
                            <div className={homestyle.topSellingHeader}>
                                <p>Product</p>
                                <p>Name</p>
                                <p>Category</p>
                                <p>Price</p>
                                <p>Sold</p>
                                <p>Revenue</p>
                            </div>
                        </div>
                        <div>


                        </div>
                    </div>
                </div>

                <div className={homestyle.rightSection}>
                    <div className={homestyle.inventoryReportWrapper}>
                        <h2>Inventory Reports <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                    </div>

                    <div className={homestyle.budgetReportWrapper}>
                        <h2>Budget Report <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                    </div>

                    <div className={homestyle.websiteTrafficWrapper}>
                        <h2>Website Traffic <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                    </div>

                    <div className={homestyle.auditLogs}>
                        <h2>Audit Logs<span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default Home;
