import { useState } from "react";
import {NavLink} from "react-router-dom"

import sidebarstyle from "../styles/sidebarstyle.module.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHouse, faListCheck, faAngleRight, faTruckFast, faFileInvoiceDollar, faChartLine, faEnvelope} from "@fortawesome/free-solid-svg-icons";


const Sidebar = () => {
    const [showProManag, setShowProManag] = useState(false)
    const [showOrderManag, setShowOrderManag] = useState(false)
    const [showAnalitics, setShowAnalitics] = useState(false)
    const [showNotifyAndAlert, setShowNotifyAnsAlert] = useState(false)
    const [activeItem, setActiveItem] = useState(null); 


    const hanldeshowProManagementList = () => {
        setShowProManag(!showProManag)
    }

    const handleShowOrderManagementList = () => {
        setShowOrderManag(!showOrderManag)
    }

    const handleShowAnalaticsList = () => {
        setShowAnalitics(!showAnalitics)
    }

    const handleShowNotifiAndAlertList = () => {
        setShowNotifyAnsAlert(!showNotifyAndAlert)
    }

    const handleItemClick = (itemId) => {
        setActiveItem(prevItemId => (prevItemId === itemId ? null : itemId));
    };


    return (
        <div className={sidebarstyle.mainContainer}>
            <h1>PrimePicks</h1>

            <div className={sidebarstyle.selectionContainer}>
                <ul className={sidebarstyle.listItems}>
                    <div onClick={() => handleItemClick(1)} className={`${sidebarstyle.listHeaderWrapper} ${activeItem === 1  ? sidebarstyle.active : ''}`}>
                        <FontAwesomeIcon icon={faHouse}  className={sidebarstyle.icon}/> 
                        <NavLink to="/"><p>Dashboard</p></NavLink>
                    </div>

                    <li>
                        <div onClick={() => handleItemClick(2)} className={`${sidebarstyle.listHeaderWrapper} ${activeItem === 2  ? sidebarstyle.active : ''}`}>
                            <FontAwesomeIcon icon={faListCheck}  className={sidebarstyle.icon}/> 
                            <NavLink>
                                <p onClick={hanldeshowProManagementList}>Product Management</p>
                            </NavLink>
                            <FontAwesomeIcon icon={faAngleRight} className={sidebarstyle.angleRightIcon} onClick={hanldeshowProManagementList}/>
                        </div>
                        <ul className={`${sidebarstyle.proManagementList} ${showProManag ? sidebarstyle.ShowProManagementList: ""}`}>
                            <NavLink>
                                <li>Modify Products</li>
                            </NavLink>
                            <NavLink>
                                <li>Inventory Management</li>
                            </NavLink>
                        </ul>
                    </li>

                    <li>
                        <div onClick={() => handleItemClick(3)} className={`${sidebarstyle.listHeaderWrapper} ${activeItem === 3  ? sidebarstyle.active : ''}`}>
                            <FontAwesomeIcon icon={faTruckFast}  className={sidebarstyle.icon}/>
                            <NavLink>
                                <p onClick={handleShowOrderManagementList}>Order Management</p>
                            </NavLink>
                            <FontAwesomeIcon icon={faAngleRight} className={sidebarstyle.angleRightIcon} onClick={hanldeshowProManagementList}/>
                        </div>
                        <ul className={`${sidebarstyle.orderManagementList} ${showOrderManag ? sidebarstyle.showOrderManagementList: ""}`}>
                            <NavLink>
                                <li>View Orders</li>
                            </NavLink>
                            <NavLink>
                                <li>Order Status Updates</li>
                            </NavLink>
                            <NavLink>
                                <li>Customer Notification</li>
                            </NavLink>
                        </ul>
                    </li>
                    
                    <li>
                        <div onClick={() => handleItemClick(4)} className={`${sidebarstyle.listHeaderWrapper} ${activeItem === 4  ? sidebarstyle.active : ''}`}>
                            <FontAwesomeIcon icon={faFileInvoiceDollar}  className={sidebarstyle.icon}/>
                            <NavLink>
                                <p>Billing</p>
                            </NavLink>
                        </div>
                    </li>

                    <li>
                        <div onClick={() => handleItemClick(5)} className={`${sidebarstyle.listHeaderWrapper} ${activeItem === 5  ? sidebarstyle.active : ''}`}>
                            <FontAwesomeIcon icon={faChartLine}  className={sidebarstyle.icon}/>
                            <NavLink>
                                <p onClick={handleShowAnalaticsList}>Analytics</p>
                            </NavLink>
                            <FontAwesomeIcon icon={faAngleRight} className={sidebarstyle.angleRightIcon} onClick={hanldeshowProManagementList}/>
                        </div>
                        <ul className={`${sidebarstyle.analiticsList} ${showAnalitics ? sidebarstyle.showAnaliticsList: ""}`}>
                            <NavLink>
                                <li>Sales Reports</li>
                            </NavLink>
                            <NavLink>
                                <li>Inventory Reports</li>
                            </NavLink>
                            <NavLink>
                                <li>Customer Reports</li>
                            </NavLink>
                        </ul>
                    </li>

                    <li>
                        <div onClick={() => handleItemClick(6)} className={`${sidebarstyle.listHeaderWrapper} ${activeItem === 6  ? sidebarstyle.active : ''}`}>
                            <FontAwesomeIcon icon={faEnvelope}  className={sidebarstyle.icon}/>
                            <NavLink>
                                <p onClick={handleShowNotifiAndAlertList}>Notifications and Alerts</p>
                            </NavLink>
                            <FontAwesomeIcon icon={faAngleRight} className={sidebarstyle.angleRightIcon} onClick={hanldeshowProManagementList}/>
                        </div>
                        <ul className={`${sidebarstyle.notifyAndAlerts} ${showNotifyAndAlert ? sidebarstyle.showNotifyAndAlertList: ""}`}>
                            <NavLink>
                                <li>Low Stock Alerts</li>
                            </NavLink>
                            <NavLink>
                                <li>Order Notifications</li>
                            </NavLink>
                            <NavLink>
                                <li>Message</li>
                            </NavLink>
                        </ul>
                    </li>
                    
                </ul>
            </div>
        </div>
    )
}

export default Sidebar