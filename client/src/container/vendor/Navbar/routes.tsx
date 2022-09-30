import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi"
import * as RiIcons from "react-icons/ri"
import * as FcIcons from "react-icons/fc"
import * as FiIcons from "react-icons/fi"

import Dashboard from "../Pages/Dashboard/Dashboard";

import Category from "../Pages/Category/Category";
import CreateCategory from "../Pages/Category/CreateCategory/CreateCategory"

import Gallery from "../Pages/Gallery/Gallery";

import Product from "../Pages/Product/Product";
import CreateProduct from "../Pages/Product/CreateProduct/CreateProduct";

import AddOn from "../Pages/AddOn/AddOn";
import CreateAddOn from "../Pages/AddOn/CreateAddOn/CreateAddOn";
import EditAddOn from "../Pages/AddOn/EditAddOn/EditAddOn";

import Orders from "../Pages/Orders/Orders";
import Order from "../Pages/Orders/Order/Order";
import Reviews from "../Pages/Reviews/Reviews";
import Setting from "../Pages/Setting/Setting";
import ShopCreate from "../Pages/ShopCreate/ShopCreate";
import React from "react";
import MenuType from "../Pages/MenuType/MenuType";
import CreateMenuType from "../Pages/MenuType/CreateMenuType/CreateMenuType";
import CreateSubscription from "../Pages/CreateSubscription/CreateSubscription";
import Subscription from "../Pages/Subscription/Subscription";

export interface RoutesLink {
    component: JSX.Element,
    path: string,
}

export interface SideBarVendorRoutes {
    icon: JSX.Element,
    path?: string,
    title: string,
    isSubNav?: boolean,
    subNav?: {
        path: string,
        title: string
    }[]
}

export const vendorRoutes: RoutesLink[] = [
    {
        path: '/vendor/dashboard',
        component: <Dashboard/>,
    },
    {
        path: '/vendor/category',
        component: <Category/>,
    },
    {
        path: '/vendor/create-category',
        component: <CreateCategory/>,
    },
    {
        path: '/vendor/create-category/:id',
        component: <CreateCategory/>,
    },
    {
        path: '/vendor/gallery',
        component: <Gallery/>,
    },
    {
        path: '/vendor/create-product/:id',
        component: <CreateProduct/>,
    },
    {
        path: '/vendor/create-product',
        component: <CreateProduct/>,
    },
    {
        path: '/vendor/product',
        component: <Product/>,
    },
    {
        path: '/vendor/product-type',
        component: <MenuType/>
    },
    {
        path: '/vendor/create-product-type',
        component: <CreateMenuType/>
    },
    {
        path: '/vendor/create-product-type/:id',
        component: <CreateMenuType/>
    },
    {
        path: '/vendor/add-on',
        component: <AddOn/>
    },
    {
        path: '/vendor/create-add-on/:id',
        component: <CreateAddOn/>
    },
    {
        path: '/vendor/create-add-on',
        component: <CreateAddOn/>
    },
    {
        path: '/vendor/edit-add-on',
        component: <EditAddOn/>
    },
    {
        path: '/vendor/order',
        component: <Orders/>,
    },
    {
        path: '/vendor/order/:id',
        component: <Order/>,
    },
    {
        path: '/vendor/reviews',
        component: <Reviews/>,
    },
    {
        path: '/vendor/setting',
        component: <Setting/>,
    },
    {
        path: '/vendor/shop',
        component: <ShopCreate/>
    },
    {
        path: '/vendor/subscription',
        component: <Subscription/>
    },
    {
        path: '/vendor/create-subscription',
        component: <CreateSubscription/>
    }
]


export const vendorSideBarItems: SideBarVendorRoutes[] = [
    {
        path: '/vendor/dashboard',
        icon: <AiIcons.AiFillDashboard/>,
        title: 'Dashboard',
        isSubNav: false,
    },
    {
        path: '/vendor/product',
        icon: <RiIcons.RiProductHuntFill/>,
        title: 'Product',
        isSubNav: false,
    },
    {
        path: '/vendor/category',
        icon: <MdIcons.MdOutlineCategory/>,
        title: 'Category',
        isSubNav: false,
    },
    {
        path: '/vendor/add-on',
        icon: <BiIcons.BiDrink/>,
        title: 'AddOn',
        isSubNav: false,
    },
    {
        path: '/vendor/product-type',
        icon: <RiIcons.RiOpenSourceLine/>,
        title: 'Menu Type',
        isSubNav: false,
    },
    {
        path: '/vendor/order',
        icon: <MdIcons.MdAvTimer/>,
        title: 'Orders',
        isSubNav: false,
    },
    {
        path: '/vendor/reviews',
        icon: <MdIcons.MdOutlineReviews/>,
        title: 'Reviews',
        isSubNav: false,
    },
    {
        path: '/vendor/gallery',
        icon: <FcIcons.FcGallery/>,
        title: 'Gallery',
        isSubNav: false,
    },
    {
        path: '/vendor/setting',
        icon: <FiIcons.FiSettings/>,
        title: 'Setting',
        isSubNav: false,
    },
    {
        path: "/vendor/subscription",
        icon: <MdIcons.MdSubscriptions/>,
        title: 'Subscription',
        isSubNav: false,
    }
]
