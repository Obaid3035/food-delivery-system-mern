import React, {useState} from 'react';
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import {AiFillCloseCircle} from "react-icons/ai";
import {errorNotify, successNotify} from "../../../../../utils/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {getTokenFormat, TOKEN} from "../../../../../lib/helper";

interface IPaymentModal {
    show: boolean,
    onModalChange: () => void,
    priceId: string
}

const PaymentModal: React.FC<IPaymentModal> = ({show, onModalChange, priceId}) => {
    const navigation = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [loader, setLoader] = useState(false)


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true)
        if (!stripe || !elements) {
            setLoader(false)
            return;
        }
        const cardElement = elements.getElement(CardElement)!
        const card = await stripe.createToken(cardElement)
        if (card.error) {
            setLoader(false)
            errorNotify(card.error.message!)
        } else {
            axios.post("/vendor/subscription", {
                stripeToken: card.token.id,
                priceId
            }, getTokenFormat()).then((res) => {
                setLoader(false)
                localStorage.removeItem(TOKEN);
                localStorage.setItem(TOKEN, res.data.token)
                successNotify(res.data.message)
                navigation("/vendor/dashboard")
            }).catch((err) => {
                setLoader(false)
                errorNotify(err?.response.data.message!)
            })

        }

    }
    return (
        <Row>
            <Col md={4}>
                <Modal show={show} size={'lg'} id={'service__modal'}>
                    <Modal.Header className="d-flex justify-content-between align-items-center review_header">
                        <h5 className={"m-0"}> Subscribe </h5>
                        <AiFillCloseCircle onClick={onModalChange} className={"m-0 close_modal"}/>
                    </Modal.Header>
                    <Modal.Body className={'px-5'}>
                        <Form onSubmit={onSubmit}>
                            <Form.Group>
                                <Form.Label>Card Number</Form.Label>
                                <CardElement
                                    className={"mb-3"}
                                    options={{
                                        hidePostalCode: true,
                                        style: {
                                            base: {
                                                fontSize: '20px',
                                                color: '#424770',
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                },
                                            },
                                            invalid: {
                                                color: '#9e2146',
                                            },
                                        },
                                    }}
                                />
                                {
                                    !loader ?
                                        <button type={'submit'} className=" place-order btn-send btn-block">
                                            Pay
                                        </button>
                                        : <div className="text-center">
                                            <Spinner animation={"border"}/>
                                        </div>
                                }
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Col>
        </Row>
    );
};

export default PaymentModal;
