import { useState, useRef, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import homestyle from "../styles/homestyle.module.css";

const Home = () => { 

    return (

        <div className={homestyle.mainContainer}>

            <h1>DashBoard</h1>
            
            <div className={homestyle.subContainer}>

                <div className={homestyle.middleSection}>

                    <div className={homestyle.topOfMiddleSection}>
                        <div className={homestyle.salesBox}>
                            <h2>Sales <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                        </div>
                        <div className={homestyle.revenueBox}>
                            <h2>Revenue <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                        </div>
                        <div className={homestyle.expensesBox}>
                            <h2>Expenses <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                        </div>
                        
                    </div>

                    <div className={homestyle.customerBoxWrapper}>
                        <div className={homestyle.customersBox}>
                            <h2>Customers <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                        </div>
                    </div>

                    <div className={homestyle.reportWrapper}>
                        <h2>Reports <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                    </div>

                    <div className={homestyle.recentSalesWrapper}>
                        <h2>Recent Sales <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
                    </div>

                    <div className={homestyle.topSellingWrapper}>
                        <h2>Top Selling <span><FontAwesomeIcon icon={faEllipsis} /></span></h2>
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
