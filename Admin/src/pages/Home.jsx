import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars} from "@fortawesome/free-solid-svg-icons";

import homestyle from "../styles/homestyle.module.css"



import Sidebar from '../components/Sidebar'

const Home = () => {
    return (
        <div className={homestyle.mainContainer}>
            <div className={homestyle.SidebarWrapper}>
                <Sidebar />
            </div>
            <div className={homestyle.mainWrapper}>
                <FontAwesomeIcon icon={faBars} />
            </div>
        </div>
    )
}

export default Home