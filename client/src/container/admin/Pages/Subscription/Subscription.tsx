import React, {useState} from 'react';
import {useAdminSubscription} from "../../../../hooks/admin/vendor";
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import {Card} from "react-bootstrap";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";

const Subscription = () => {

    const [pageNo, setPageNo] = useState(0)

    const columns = [{
        name: "ID",
        options: {
            display: false,
        }
    }, 'Email', 'Phone Number', 'Status'];

    const {
        data: res, isError, isLoading, isSuccess
    } = useAdminSubscription(pageNo);

    let subscription;
    if(isSuccess){
        if (res.data.data.length > 0) {
            subscription = <MuiDataTable title={'Subscription List'} data={res.data} columns={columns} page={pageNo} setPage={setPageNo} />
        } else {
            subscription = (
                <Card className={'py-3'}>
                    <p className={'text-center'}>No Subscription Found</p>
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
            {subscription}
        </div>
    );
};

export default Subscription;
