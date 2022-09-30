import React, {useState} from 'react';
import {Container, Row, Col} from "react-bootstrap";
import { BsArrowRightShort } from 'react-icons/bs';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js";
import './CreateSubscription.css';
import PaymentModal from "./PaymentModal/PaymentModal";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

const CreateSubscription = () => {
    const [show, setShow] = useState(false)
    const [priceId, setPriceId] = useState<null | string>(null);

    const onChangeHandler = (e: React.MouseEvent<HTMLDivElement>, priceId: string) => {
        setShow(!show)
        setPriceId(priceId)
    }

    return  (
        <div className={'packages text-center'}>
            <Elements stripe={stripePromise}>
                <PaymentModal priceId={priceId!} show={show} onModalChange={() => setShow(!show)}/>
            </Elements>
            <h2>SELECT PACKAGE PLAN</h2>
            <Container>
                <Row className={'packages_row'}>
                    <Col md={3} className={'packages_plan'}>
                        <div className={'package_name'}>
                            <h3>Monthly</h3>
                        </div>

                        <div className={'package_detail text-muted'}>
                            <p>1 domain</p>
                            <p>Unlimited Storage</p>
                            <p>Free Domain</p>
                        </div>

                        <div className={'package_price'}>
                            <h2>2.99 GBP</h2>
                            <p>PER MONTH</p>
                        </div>

                        <div className={'w-100'}>
                            <div className={'package_btn'} onClick={(e) => onChangeHandler(e, "price_1KbJoPJiA9XMfF1vsXXzowHw")}>
                                <BsArrowRightShort />
                            </div>
                        </div>

                    </Col>
                    <Col md={3} className={'packages_plan'}>
                        <div className={'package_name'}>
                            <h3>Yearly</h3>
                        </div>

                        <div className={'package_detail text-muted'}>
                            <p>1 domain</p>
                            <p>Unlimited Storage</p>
                            <p>Free Domain</p>
                        </div>

                        <div className={'package_price'}>
                            <h2>28.99 GBP</h2>
                            <p>PER Year</p>
                        </div>

                        <div className={'w-100'}>
                            <div className={'package_btn'} onClick={(e) => onChangeHandler(e, "price_1KbJpSJiA9XMfF1vh44TFWES")}>
                                <BsArrowRightShort />
                            </div>
                        </div>

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CreateSubscription;
