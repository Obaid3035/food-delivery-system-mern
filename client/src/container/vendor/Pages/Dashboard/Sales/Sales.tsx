import React from 'react';
import {Container, Row, Col} from "react-bootstrap";
import CountUp from 'react-countup';
import { FaShoppingCart } from 'react-icons/fa';
import "./Sales.css";


interface ISales {
    dailySales: number,
    weeklySales: number,
    monthlySales: number
}

const Sales: React.FC<ISales> = ({ monthlySales, weeklySales, dailySales}) => {

    const cardStats = [
        {
            title: 'Daily Sales',
            value: dailySales,
            icon: <FaShoppingCart className='pl-4 dashboard_icon'/>
        },
        {
            title: 'Weekly Sales',
            value: weeklySales,
            icon: <FaShoppingCart className='pl-4 dashboard_icon'/>
        },
        {
            title: 'Monthly Sales',
            value: monthlySales,
            icon: <FaShoppingCart className='pl-4 dashboard_icon'/>
        }
    ]

    return (
        <Container fluid>
            <Row className={'mt-4'}>
                {
                    cardStats.map((item, index) => (
                        <Col md={4} key={index}>
                        <div className="d-flex w-100 dashboard_card mt-4 justify-content-between align-items-center">
                            <div className={'card_title'}>
                                <p>{ item.title }</p>
                                <p className={'value'}> <CountUp end={ item.value } duration={1}/></p>
                            </div>
                            <div>
                                { item.icon }
                            </div>
                        </div>
                        </Col>
                    ))
                }
            </Row>
        </Container>
    );
};

export default Sales;
