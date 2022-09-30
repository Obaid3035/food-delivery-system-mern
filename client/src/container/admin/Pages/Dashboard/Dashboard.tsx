import React from 'react';
import { FaCheck } from 'react-icons/fa';
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import {Container, Row, Col, Card} from "react-bootstrap";
import "./Dashboard.css";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import {useAdminDashboard} from "../../../../hooks/admin/vendor";

const Dashboard = () => {

    const {data: res, isSuccess, isLoading, isError} = useAdminDashboard()

    if (isLoading) {
        return <Loader/>
    }

    if (isError) {
        return <DisplayError/>
    }
    const columns = [{
        name: "ID",
        options: {
            display: false,
        }
    },
        'ShopName',
        'VendorEmail',
        'ShopAddress',
        'Status'
    ];

    let dashboard: any;
    if (isSuccess) {
        dashboard = (
            <Row>
                <Col md={8}>
                    {
                        res.data.vendor.count > 0 ?
                            <MuiDataTable title={'Orders List'} data={res.data.vendor} columns={columns} />
                            : <Card className={'py-3'}>
                                <p className={'text-center'}>No Order Found</p>
                            </Card>
                    }
                </Col>

                <Col md={4}>
                    <div className={'dashboard active_main'}>
                        <p><FaCheck /> ACTIVE</p>
                        <p>{res.data.activeVendorCount}</p>
                    </div>

                    <div className={'dashboard in_active_main mt-3'}>
                        <p><FaCheck /> IN-ACTIVE</p>
                        <p>{res.data.inActiveVendorCount}</p>
                    </div>
                </Col>
            </Row>
        )
    }


    return (
        <div className={'page_responsive'}>
            <Container fluid>
                { dashboard}
            </Container>
        </div>
    );
};
export default Dashboard;
