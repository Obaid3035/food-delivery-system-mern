import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";


import Dashboard from "../Pages/Dashboard/Dashboard";
import CustomerView from "../Pages/CustomerView/CustomerView";
import Refund from "../Pages/Refund/Refund";
import VendorView from "../Pages/VendorView/VendorView";
import Subscription from "../Pages/Subscription/Subscription";

export interface RoutesLink {
    component: JSX.Element,
    path: string,
}

export interface SideBarRoutes {
    icon: JSX.Element,
    path?: string,
    title: string,
    isSubNav?: boolean,
    subNav?: {
        path: string,
        title: string
    }[]
}

export const adminRoutes: RoutesLink[] = [
    {
        path: '/admin/dashboard',
        component: <Dashboard />,
    },
    {
        path: '/admin/customer-view',
        component: <CustomerView />,
    },
    {
        path: '/admin/refund',
        component: <Refund />,
    },
    {
        path: '/admin/vendor-view',
        component: <VendorView />,
    },
    {
        path: '/admin/subscription',
        component: <Subscription/>
    }
]

export const adminSideBarItems: SideBarRoutes[] = [
    {
        path: '/admin/dashboard',
        icon: <AiIcons.AiFillDashboard/>,
        title: 'Dashboard',
        isSubNav: false,
    },
    {
        path: '/admin/customer-view',
        icon: <MdIcons.MdCarRental/>,
        title: 'customer',
        isSubNav: false,
    },
    {
        path: '/admin/vendor-view',
        icon: <MdIcons.MdCarRental/>,
        title: 'vendor',
        isSubNav: false,
    },
    {
        path: '/admin/refund',
        icon: <MdIcons.MdCarRental/>,
        title: 'Refund',
        isSubNav: false,
    },
    {
        path: '/admin/subscription',
        icon: <MdIcons.MdCarRental/>,
        title: 'Refund',
        isSubNav: false,
    },
]



