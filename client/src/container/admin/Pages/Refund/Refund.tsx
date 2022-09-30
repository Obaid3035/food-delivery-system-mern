import React, {useState} from 'react';
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import {useGetRejectedOrders, useRefundOrder} from "../../../../hooks/admin/vendor";
import {Card} from "react-bootstrap";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import * as AiIcons from "react-icons/ai";
import {errorNotify, successNotify} from "../../../../utils/toast";

const Refund = () => {

    const [pageNo, setPageNo] = useState(0)

    const columns = [{
        name: "ID",
        options: {
            display: false,
        }
    },'customer Name', 'Email', 'Phone', 'Shops Name', 'Total Price', 'isRefunded',    {
        name: "Actions",
        options: {
            customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                return (
                    <button className={'action close_action'} onClick={() => toRefundOrder(tableMeta.rowData[0])}>
                        <AiIcons.AiFillCheckSquare/>
                    </button>
                )
            }
        }
    }];

    const {
        data: res, isError, isLoading, isSuccess
    } = useGetRejectedOrders(pageNo)

    const {
        mutate: toRefundOrder,
        isLoading: isRefundOrder,
        isSuccess: inRefundOrderSuccess,
        data: RefundOrderRes,
        isError: isRefundedOrderError,
        error: refundedOrderError,
        reset: RefundOrderReset
    } = useRefundOrder()

    if (inRefundOrderSuccess) {
        successNotify(RefundOrderRes.data.message);
        RefundOrderReset()
    }

    let orders;
    if(isSuccess){
        if (res.data.data.length > 0) {
            orders = <MuiDataTable title={'Order List'} data={res.data} columns={columns} page={pageNo} setPage={setPageNo} />
        } else {
            orders = (
                <Card className={'py-3'}>
                    <p className={'text-center'}>No Orders Found</p>
                </Card>
            )
        }
    }

    if (isLoading || isRefundOrder) {
        return <Loader/>
    }

    if (isRefundedOrderError) {
        errorNotify(refundedOrderError?.response.data.message!)
        RefundOrderReset()
    }

    if (isError) {
        return <DisplayError/>
    }

    return (
        <div className={'page_responsive'}>
            {orders}
        </div>
    );
};

export default Refund;
