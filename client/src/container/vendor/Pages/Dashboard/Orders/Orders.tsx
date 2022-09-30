import React from 'react';
import {Card, Col, Container, Row} from "react-bootstrap";
import MuiDataTable from "../../../../../components/MuiDataTable/MuiDataTable";
import CountUp from 'react-countup';
import { FaShoppingCart } from 'react-icons/fa';
import Spinner from '../../../../../components/Loader/Loader';
import { FaCheck } from "react-icons/fa";

interface IOrder {
    dailyOrderCount: number,
    pendingOrdersCount: number,
    completedOrdersCount: number,
    recentOrders: any
}

const Orders: React.FC<IOrder> = ({ completedOrdersCount, pendingOrdersCount, dailyOrderCount, recentOrders }) => {

    const columns = [
        'customer Name',
        'customer Email',
        'Phone',
        'Status'
    ];

    let orders;

    if (recentOrders.data.length > 0) {
        orders = <MuiDataTable title={'Orders List'} data={recentOrders} columns={columns} />
    } else {
        orders = (
            <Card className={'py-3'}>
                <p className={'text-center'}>No Order Found</p>
            </Card>
        )
    }


    return (
        <div>
            <Container fluid>
                <Row>
                    <Col md={8}>
                        {orders}
                    </Col>

                    <Col md={4}>
                        <div className="d-flex w-100 dashboard_card justify-content-between align-items-center">
                            <div className={'card_title'}>
                                <h5>Today Orders</h5>
                                <p className={'value'}> <CountUp end={dailyOrderCount} duration={1} /></p>
                            </div>
                            <div>
                                <FaShoppingCart className='pl-4 dashboard_icon' />
                            </div>
                        </div>

                        <div className={'dashboard active_main'}>
                            <p><FaCheck /> ACTIVE</p>
                            <p>{ completedOrdersCount }</p>
                        </div>

                        <div className={'dashboard in_active_main mt-3'}>
                            <p><FaCheck /> IN-ACTIVE</p>
                            <p>{ pendingOrdersCount } </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default Orders;
