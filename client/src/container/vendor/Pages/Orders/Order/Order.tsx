import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./Order.css";
import axios from "axios";
import DisplayError from "../../../../../components/DisplayError/DisplayError";
import Loader from "../../../../../components/Loader/Loader";
import {getTokenFormat} from "../../../../../lib/helper";
import {Container, Row} from "react-bootstrap";
import OrderItem from "./OrderItem/OrderItem";

const Order = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/vendor/orders/${id}`, getTokenFormat())
            .then((res) => {
                setIsLoading(false)
                setOrder(res.data)
            })
            .catch(() => {
                setIsLoading(false)
                setIsError(true)
            })
    }, [])

    if (isError) {
        return <DisplayError/>
    }

    if (isLoading) {
        return <Loader/>
    }


    return (
        <div className='page_responsive'>
            <div className='d-flex justify-content-between'>
                <h2>Show Orders</h2>
                <button className={'btn-send px-4 mr-2 mb-4'} onClick={() => navigate("/vendor/order")}>Back</button>
            </div>
            <Container>
                <Row className={'justify-content-center'}>
                    {
                        order && order.items.map((item: any) => (
                            <OrderItem item={item}/>
                        ))
                    }
                </Row>
            </Container>
        </div>
    )
};

export default Order;
