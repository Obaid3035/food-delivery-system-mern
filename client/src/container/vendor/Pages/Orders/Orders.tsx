import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, Tab, Tabs} from "react-bootstrap";
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import {
    useGetAllOrders,
    useGetCompletedOrders,
    useGetInProgressOrders,
    useGetRejectedOrders,
    useGetUnderApprovalOrders,
    useToAcceptedOrder,
    useToCompletedOrder,
    useToRejectedOrder
} from "../../../../hooks/vendor/shop";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import {successNotify} from "../../../../utils/toast";

enum ORDER_KEY {
    totalOrder = "TotalOrders",
    underApprovalOrders = "UnderApprovalOrders",
    inProgressOrders = "InProgressOrders",
    completedOrders = "CompletedOrders",
    rejectedOrders = "RejectedOrders"
}

const Orders = () => {
    let orders;
    const [key, setKey] = useState<string>(ORDER_KEY.totalOrder)
    const [allOrdersPageNo, setAllOrdersPageNo] = useState(0)
    const [underApprovalOrdersPageNo, setUnderApprovalOrdersPageNo] = useState(0)
    const [inProgressOrdersPageNo, setInProgressOrdersPageNo] = useState(0)
    const [completedOrdersPageNo, setCompletedOrdersPageNo] = useState(0)
    const [rejectedOrdersPageNo, setRejectedOrdersPageNo] = useState(0)
    const navigate = useNavigate();

    const {
        mutate: toAccepted,
        isLoading: isAccepted,
        isSuccess: acceptedSuccess,
        data: acceptedRes,
        reset: acceptedReset
    } = useToAcceptedOrder()
    const {
        mutate: toCompleted,
        isLoading: isCompleted,
        isSuccess: completedSuccess,
        data: completedRes,
        reset: completedReset
    } = useToCompletedOrder()
    const {
        mutate: toRejected,
        isLoading: isRejected,
        isSuccess: rejectedSuccess,
        data: rejectedRes,
        reset: rejectedReset
    } = useToRejectedOrder()

    if (acceptedSuccess) {
        successNotify(acceptedRes.data.message);
        acceptedReset()
    }

    if (completedSuccess) {
        successNotify(completedRes.data.message);
        completedReset()
    }
    if (rejectedSuccess) {
        successNotify(rejectedRes.data.message);
        rejectedReset()
    }


    let columns = [
        {
            name: "ID",
            options: {
                display: false,
            }
        },
        'Customer Name',
        'Delivery Method',
        'Mobile Number',
        'Notes',
        'Price',
        'Status',
        {
            name: "Order",
            options: {
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action close_action'}
                                onClick={() => navigate(`/vendor/order/${tableMeta.rowData[0]}`)}>
                            show
                        </button>
                    )
                }
            }
        },
        {
            name: "Accept",
            options: {
                display: key === ORDER_KEY.underApprovalOrders,
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action close_action'}
                                onClick={() => toAccepted(tableMeta.rowData[0])}>
                            Accept
                        </button>
                    )
                }
            }
        },
        {
            name: "Reject",
            options: {
                display: key === ORDER_KEY.underApprovalOrders,
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action close_action'}
                                onClick={() => toRejected(tableMeta.rowData[0])}>
                            Reject
                        </button>
                    )
                }
            }
        },
        {
            name: "Complete",
            options: {
                display: key === ORDER_KEY.inProgressOrders,
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action close_action'}
                                onClick={() => toCompleted(tableMeta.rowData[0])}>
                            Complete
                        </button>
                    )
                }
            }
        }

    ]


    const {
        data: allOrders,
        isLoading: allOrdersLoading,
        isSuccess: allOrdersSuccess,
        isError: allOrdersError
    } = useGetAllOrders(allOrdersPageNo);
    const {
        data: underApprovalOrders,
        isLoading: underApprovalOrdersLoading,
        isSuccess: underApprovalOrdersSuccess,
        isError: underApprovalOrdersError
    } = useGetUnderApprovalOrders(underApprovalOrdersPageNo);
    const {
        data: inProgressOrders,
        isLoading: inProgressOrdersLoading,
        isSuccess: inProgressOrdersSuccess,
        isError: inProgressOrdersError
    } = useGetInProgressOrders(inProgressOrdersPageNo);
    const {
        data: completedOrders,
        isLoading: completedOrdersLoading,
        isSuccess: completedOrdersSuccess,
        isError: completedOrdersError
    } = useGetCompletedOrders(completedOrdersPageNo);
    const {
        data: rejectedOrders,
        isLoading: rejectedOrdersLoading,
        isSuccess: rejectedOrdersSuccess,
        isError: rejectedOrdersError
    } = useGetRejectedOrders(rejectedOrdersPageNo);

    if (allOrdersLoading || underApprovalOrdersLoading
        || inProgressOrdersLoading || completedOrdersLoading
        || rejectedOrdersLoading || isRejected
        || isAccepted || isCompleted
    ) {
        return <Loader/>
    }

    if (allOrdersError || underApprovalOrdersError || inProgressOrdersError || completedOrdersError || rejectedOrdersError) {
        return <DisplayError/>
    }

    function resourceTable(resource: any, page: number, setPage: any, columns: any) {
        if (resource.data.data.length > 0) {
            return <MuiDataTable title="Total Orders" data={resource.data} columns={columns}
                                 page={page} setPage={setPage}/>
        }
        return (
            <Card className={'py-3'}>
                <p className={'text-center'}>No Orders Type Found</p>
            </Card>
        )
    }


    if (allOrdersSuccess || underApprovalOrdersSuccess || inProgressOrdersSuccess || completedOrdersSuccess || rejectedOrdersSuccess) {
        orders = (
            <Tabs
                activeKey={key}
                onSelect={(k) => setKey(k!)}
                className="mb-3 tabs"
            >
                <Tab eventKey={ORDER_KEY.totalOrder} title="Total" className={'w-100'}>
                    {resourceTable(allOrders, allOrdersPageNo, setAllOrdersPageNo, columns)}
                </Tab>
                <Tab eventKey={ORDER_KEY.underApprovalOrders} title='Under-Approval' className={'w-100'}>
                    {resourceTable(underApprovalOrders, underApprovalOrdersPageNo, setUnderApprovalOrdersPageNo, columns)}
                </Tab>
                <Tab eventKey={ORDER_KEY.inProgressOrders} title='In-Progress' className={'w-100'}>
                    {resourceTable(inProgressOrders, inProgressOrdersPageNo, setInProgressOrdersPageNo, columns)}
                </Tab>
                <Tab eventKey={ORDER_KEY.completedOrders} title='Completed' className={'w-100'}>
                    {resourceTable(completedOrders, completedOrdersPageNo, setCompletedOrdersPageNo, columns)}
                </Tab>
                <Tab eventKey={ORDER_KEY.rejectedOrders} title='Rejected' className={'w-100'}>
                    {resourceTable(rejectedOrders, rejectedOrdersPageNo, setRejectedOrdersPageNo, columns)}
                </Tab>
            </Tabs>
        )
    }

    return (
        <div className={'page_responsive'}>
            {orders}
        </div>
    );
};

export default Orders;
