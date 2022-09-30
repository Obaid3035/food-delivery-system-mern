import React from 'react';
import Orders from "./Orders/Orders";
import Sales from "./Sales/Sales";
import {useGetDashboard} from "../../../../hooks/vendor/shop";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";

const Dashboard = () => {

    const {data: res, isSuccess, isLoading, isError} = useGetDashboard()

    if (isLoading) {
        return <Loader/>
    }

    if (isError) {
        return <DisplayError/>
    }

    let dashboard: any;

    if (isSuccess) {
        dashboard = (
            <React.Fragment>
                <div>
                    <Sales dailySales={res.data.dailySales}
                           monthlySales={res.data.monthlySales}
                           weeklySales={res.data.weeklySales}/>
                </div>
                <div>
                    <Orders pendingOrdersCount={res.data.pendingOrdersCount}
                            completedOrdersCount={res.data.completedOrdersCount}
                            dailyOrderCount={res.data.dailyOrderCount}
                            recentOrders={res.data.recentOrders}
                    />
                </div>
            </React.Fragment>
        )
    }

    return (
        <div className={'page_responsive'}>
            {dashboard}
        </div>
    );
};

export default Dashboard;
