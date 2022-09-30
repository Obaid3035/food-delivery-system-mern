import React, { useState} from 'react';
import { BsCheck2Square } from 'react-icons/bs';
import {Table} from "react-bootstrap";
import "./Subscription.css";
import {useDeleteSubscription, useGetSubscription} from "../../../../hooks/vendor/shop";
import Loader from "../../../../components/Loader/Loader";
import {errorNotify, successNotify} from "../../../../utils/toast";
import DeleteModal from "../../../../components/DeleteModal/DeleteModal";
import {TOKEN} from "../../../../lib/helper";

const Subscription = () => {
    const [show, setShow] = useState(false);

    const {data: res, isSuccess, isLoading, isError, error} = useGetSubscription()
    const {mutate, isLoading: isCancelLoading, isSuccess: isCancelSuccess, reset, data: cancelRes} = useDeleteSubscription()

    let subscription: any;

    if (isLoading || isCancelLoading) {
        return <Loader/>
    }

    const onSubscriptionCancel = () => {
        mutate(null)
        setShow(false)
    }


    const getFormattedDate = (date: number) => {
        const days = new Date(date).getDate();
        const month =  new Date(date).getMonth() + 1;
        const year =  new Date(date).getFullYear();

        return `${days}/${month}/${year}`
    }

    if (isError) {
        errorNotify(error?.response.data.message!)
    }



    if (isSuccess) {
        const data = res.data;
        subscription = (
            <div className={'container subscription'}>
                <div className={'subscription_detail'}>
                    <h4> SUBSCRIPTION DETAIL</h4>

                    <div className={'package'}>
                        <div className={'package_info'}>
                            <h5>PACKAGE:</h5>
                            <p className={'text-muted'}> <BsCheck2Square /> {data.package}</p>
                        </div>
                        <hr />
                        <div className={'package_info'}>
                            <h5>PRICE</h5>
                            <p className={'text-muted'}>{data.amount} GBP</p>
                        </div>
                        <div className={'package_info'}>
                            <h5>STATUS</h5>
                            <p className={'text-muted'}>{data.status}</p>
                        </div>
                        <hr />
                        <div className={'invoice'}>
                            <h5>LAST INVOICE:</h5>

                            <Table className={'mt-2'} bordered responsive>
                                <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Amount Paid</th>
                                    <th>Period Start</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className={'text-muted'}>
                                    <td>{data.email}</td>
                                    <td>£ {data.amount_paid}</td>
                                    <td>{ getFormattedDate(Date.now() + data.period_start)}</td>
                                    <td>£ {data.total}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    {
                        !(data.status === "canceled") ?
                            <div className="text-right mx-4 mb-3">
                                <button className={"btn-send"} onClick={() => setShow(!show)}>Cancel Subscription</button>
                            </div>
                            : null
                    }

                </div>
            </div>
        )
    }

    if (isCancelSuccess) {
        successNotify(cancelRes.data.message)
        localStorage.removeItem(TOKEN);
        localStorage.setItem(TOKEN, cancelRes.data.token)
        window.location.href = "/"
        reset();
    }

    return (
        <div className="page_responsive">
            <DeleteModal show={show} onSubmit={onSubscriptionCancel} onClose={() => setShow(!show)}/>
            { subscription }
        </div>
    );
};

export default Subscription;
