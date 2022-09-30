import React from 'react';
import {vendorSideBarItems} from "./routes";
import SideBar from '../../../components/Sidebar/Sidebar';
import {AiFillDashboard} from "react-icons/ai";
import {MdOutlineSubscriptions} from "react-icons/md"
import {Navigate, useLocation} from "react-router-dom";
import {IUser} from "../../../interface";
import jwt from "jwt-decode"

const NavBar = () => {
    const location = useLocation()
    const token = localStorage.getItem("token");

    const shopProfileSetup =  [
        {
            path: '/vendor/shop',
            icon: <AiFillDashboard/>,
            title: 'Create Shop',
            isSubNav: false,
        }
    ]

    const shopSubscriptionSetup = [
        {
            path: '/vendor/create-subscription',
            icon: <MdOutlineSubscriptions/>,
            title: 'Create Subscription',
            isSubNav: false,
        }
    ]


    if (!token) {
        return <Navigate to={'/'}/>
    }

    const decode: { user: IUser } = jwt(token);

    if (!decode.user.profileSetup) {
        return <SideBar sideBarItems={shopProfileSetup}/>
    }

    if (location.pathname === "/vendor/create-subscription") {
        return <SideBar sideBarItems={shopSubscriptionSetup}/>
    }

    return <SideBar sideBarItems={vendorSideBarItems}/>
};

export default NavBar;
