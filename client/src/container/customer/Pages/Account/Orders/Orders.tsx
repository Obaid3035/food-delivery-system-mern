import React from "react";
import "./Order.css";
import {useGetOrder} from "../../../../../hooks/customer/shop";
import Loader from "../../../../../components/Loader/Loader";
import DisplayError from "../../../../../components/DisplayError/DisplayError";
import Order from "./Order/Order";

const Orders = () => {

    const {data: res, isSuccess, isLoading, isError} = useGetOrder()

    if (isLoading) {
        return <Loader/>
    }

    if (isError) {
        return <DisplayError/>
    }


    let activeOrders: any, pastOrders: any, cancelledOrder: any;

    function orderEmpty(status: string) {
        return (
            <div className={'mt-5'}>
                <h5 className={'text-center'}>No {status} Orders</h5>
            </div>
        )
    }


    if (isSuccess) {
        activeOrders = orderEmpty("Active")
        if (res.data.pendingOrders.length > 0) {
            activeOrders = res.data.pendingOrders.map((order: any) => (
                <Order orderData={order}/>
            ))
        }
        pastOrders = orderEmpty("Past")
        if (res.data.pastOrders.length > 0) {
            pastOrders = res.data.pastOrders.map((order: any) => (
                <Order orderData={order}/>
            ))
        }
        cancelledOrder = orderEmpty("Cancelled")
        if (res.data.rejectedOrders.length > 0) {
            cancelledOrder = res.data.rejectedOrders.map((order: any) => (
                <Order orderData={order}/>
            ))
        }
    }

    return (
        <React.Fragment>
            <div className={'container'}>
                <h2>Active Orders</h2>
                <div className={'container'}>
                    {activeOrders}
                </div>
            </div>
            <div className={'container mt-5 mb-5'}>
                <h2>Past Orders</h2>
                <div className={'container'}>
                    {pastOrders}
                </div>
            </div>
            <div className={'container mt-5 mb-5'}>
                <h2>Cancelled Orders</h2>
                <div className={'container'}>
                    {cancelledOrder}
                </div>
            </div>
        </React.Fragment>
    )
}
export default Orders;
