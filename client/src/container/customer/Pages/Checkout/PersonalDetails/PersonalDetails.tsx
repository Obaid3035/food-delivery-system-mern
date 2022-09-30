import React, {useEffect, useState, memo} from 'react';
import {Form, Spinner} from "react-bootstrap";
import {IUserDetail} from "../Checkout";
import {DELIVERY_TYPE} from "../../../../../App";
import Select from "react-select";
import axios from "axios";
import {ICart} from "../../ShopView/ProductSection/Product/Product";
import {useCreateOrder} from "../../../../../hooks/customer/shop";
import Loader from "../../../../../components/Loader/Loader";
import DisplayError from "../../../../../components/DisplayError/DisplayError";
import { useNavigate } from "react-router-dom";
import {errorNotify, successNotify} from "../../../../../utils/toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {getTokenFormat} from "../../../../../lib/helper";


interface IPersonalDetails {
    userDetails: IUserDetail,
    cart: ICart,
    orderBillHandler: () => number,
    serviceFeeCalculator: () => number,
    overAllCalculator: () => number,
    slug: string
}


const PersonalDetails: React.FC<IPersonalDetails> = ({userDetails, cart, orderBillHandler, overAllCalculator, serviceFeeCalculator, slug}) => {
    const navigation = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [notes, setNotes] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("")

    const [deliveryOption, setDeliveryOption] = useState<any>([])

    const [deliveryType, setDeliveryType] = useState<{value: string, label: string} | null>(null)
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        switch (cart.deliveryType) {
            case DELIVERY_TYPE.BOTH:
                setDeliveryOption([
                    {value: DELIVERY_TYPE.LOCAL_DELIVERY, label: 'Local Delivery'},
                    {value: 'pickUp', label: 'Pick Up'},
                ])
                setDeliveryType({value: DELIVERY_TYPE.LOCAL_DELIVERY, label: "Local Delivery"},)
                break;
            case DELIVERY_TYPE.LOCAL_DELIVERY:
                setDeliveryOption([
                    {value: DELIVERY_TYPE.LOCAL_DELIVERY, label: 'Local Delivery'},
                ])
                setDeliveryType({value: DELIVERY_TYPE.LOCAL_DELIVERY, label: 'Local Delivery'},)
                break;
            case DELIVERY_TYPE.POSTAL_DELIVERY:
                setDeliveryOption([
                    {value: DELIVERY_TYPE.POSTAL_DELIVERY, label: 'Postal Delivery'},
                ])
                setDeliveryType({value: DELIVERY_TYPE.POSTAL_DELIVERY, label: 'Postal Delivery'},)
                break;
            case DELIVERY_TYPE.PICKUP:
                setDeliveryOption([
                    {value: 'pickUp', label: 'Pick Up'},
                ])
                setDeliveryType({value: 'pickUp', label: 'Pick Up'},)

                break;
        }
    }, [])


    const {mutate, isLoading, isSuccess, isError, data: res} = useCreateOrder(slug)

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true)
        if (!stripe || !elements) {
            setLoader(false)
            return;
        }
        const cardElement = elements.getElement(CardElement)!

        const paymentIntent = await axios.post(`/orders/payment/secret/${slug}`, {
            totalPrice: overAllCalculator(),
            orderBill: orderBillHandler(),
        }, getTokenFormat())

        const card = await stripe.confirmCardPayment(paymentIntent.data.secret, {
            payment_method: {
                card: cardElement,
            }
        })
        if (card.error) {
            setLoader(false)
            errorNotify(card.error.message!)
        } else {
            const data = {
                notes,
                deliveryType: (deliveryType!).value,
                deliveryAddress,
                orderBill: orderBillHandler(),
                serviceCharge: serviceFeeCalculator(),
                totalPrice: overAllCalculator(),
                paymentIntentId: paymentIntent.data.paymentIntentId,
                items: cart.cart.map((item) => ({
                    itemName: item.productName,
                    itemPrice: item.productPrice,
                    itemTime: item.cookingTime,
                    quantity: item.qty,
                    addOn: item.addOn
                }))
            }
            setLoader(false)
            mutate(data)
        }
    }

    if (isLoading) {
        return <Loader/>
    }

    if (isError) {
        return <DisplayError/>
    }

    if (isSuccess) {
        successNotify(res.data.message)
        localStorage.removeItem("cart")
        navigation("/")
    }

    return (
        <div style={{width: "45%"}} className={'container main-section mb-5 shadow border-0 bg-white h-100 mr-3'}>
            <h2 className={'mt-3 text-center'}>DELIVERY DETAILS</h2>
            <hr/>
            <h3>Personal Details</h3>
            <div className=" p-details shadow border-0 bg-white mb-5 pl-2 pt-2 pb-2 w-75">
                <h5> {userDetails.name} </h5>
                <hr/>
                <p>{userDetails.email}</p>
                <hr/>
                <p> {userDetails.phoneNumber} </p>
            </div>

                <Form onSubmit={onSubmitHandler}>
                   <Form.Group>
                       <Form.Label>Personalisation</Form.Label>
                       <Form.Control
                           type={'textarea'}
                           as={'textarea'}
                           required
                           value={notes}
                           className={'mb-3'}
                           onChange={(e) => setNotes(e.target.value)}
                       />
                   </Form.Group>

                    <Form.Group>
                        <Form.Label>Delivery Address</Form.Label>
                        <Form.Control
                            type={'textarea'}
                            as={'textarea'}
                            required
                            value={deliveryAddress}
                            className={'mb-3'}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Delivery Type</Form.Label>
                        <Select
                            isSearchable={false}
                            value={deliveryType}
                            onChange={(value) => setDeliveryType(value!)}
                            options={deliveryOption}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className={"mt-3"}>Card Details</Form.Label>
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
                    </Form.Group>

                    <div>
                        <div className={'card-details'}>
                            <div className="container">
                                {
                                    !loader ?
                                        <button type={'submit'} className=" place-order btn-send btn-block mb-5">
                                            PLACE ORDER
                                        </button>
                                        : <div className="text-center">
                                            <Spinner animation={"border"}/>
                                        </div>
                                }
                            </div>
                        </div>
                        <hr/>
                    </div>
                </Form>
        </div>
    );
};
export default memo(PersonalDetails);
