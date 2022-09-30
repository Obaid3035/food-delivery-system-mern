import React, {useState} from 'react';
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import {useGetAllCustomers} from "../../../../hooks/admin/vendor";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import {Card} from "react-bootstrap";

const CustomerView = () => {
    const [pageNo, setPageNo] = useState(0)

    const columns = [{
        name: "ID",
        options: {
            display: false,
        }
    }, 'customer name', 'Email', 'Phone'];

    const {
        data: res, isError, isLoading, isSuccess
    } = useGetAllCustomers(pageNo);

    let customers;
    if(isSuccess){
        if (res.data.data.length > 0) {
            customers = <MuiDataTable title={'Review List'} data={res.data} columns={columns} page={pageNo} setPage={setPageNo} />
        } else {
            customers = (
                <Card className={'py-3'}>
                    <p className={'text-center'}>No Customers Found</p>
                </Card>
            )
        }
    }

    if (isLoading) {
        return <Loader/>
    }

    if (isError) {
        return <DisplayError/>
    }


    return (
        <div className={'page_responsive'}>
            {customers}
        </div>
    );
};

export default CustomerView;
