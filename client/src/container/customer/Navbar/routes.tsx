import Home from "../Pages/Home/Home"
import About from "../Pages/About/About"
import Policies from "../Pages/Policies/Policies"
import Checkout from "../Pages/Checkout/Checkout"
import Shops from "../Pages/Shops/Shops"
import ShopView from "../Pages/ShopView/ShopView";
import MyProfile from "../Pages/Account/MyProfile/MyProfile";
import MyOrders from "../Pages/Account/Orders/Orders";

export interface RoutesLink {
    component: JSX.Element,
    path: string,
}

export const mainRoutes: RoutesLink[] = [
    {
        path: '/',
        component: <Home />,
    },
    {
        path: '/about',
        component: <About />,
    },
    {
        path: '/policies',
        component: <Policies />,
    },
    {
        path: '/shops',
        component: <Shops />,
    },
    {
		path: '/shops/:slug',
		component: <ShopView />,
	},
    {
        path: '/checkout/:slug',
        component: <Checkout />,
    },
    {
		path: '/profile',
		component: <MyProfile />
	},
	{
		path: '/orders',
		component: <MyOrders />
	}
]
