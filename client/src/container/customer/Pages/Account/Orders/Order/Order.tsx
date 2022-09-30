import React, {useEffect, useState} from 'react';
import {DELIVERY_TYPE, ORDER_STATUS} from "../../../../../../App";
import ReviewModal from "../ReviewModal/ReviewModal";
import Countdown from 'react-countdown';
import moment from "moment";

interface IOrder {
    orderData: any
}

const Order: React.FC<IOrder> = ({orderData} ) => {
    const [show, setShow] = useState(false);
    let showAddress: any, reviewBtn: any, showTimer: any;

    if (orderData.timer && orderData.orderStatus === ORDER_STATUS.IN_PROGRESS) {
        showTimer = (
            <div className="offset-md-8">
                <Countdown date={moment().utc() + orderData.timer} />
            </div>
        )
    }

    if ((orderData.orderStatus === ORDER_STATUS.IN_PROGRESS || orderData.orderStatus === ORDER_STATUS.COMPLETED) && orderData.deliveryType === DELIVERY_TYPE.PICKUP) {
        showAddress = (
            <div className="col-md-7">
                <p>Address:<span className={"mx-2"}>{orderData.shop.address}</span></p>
                <p>Zip Code:<span className={"mx-2"}>{orderData.shop.postalCode}</span></p>
            </div>
        )
    }

    if (orderData.orderStatus === ORDER_STATUS.COMPLETED && !orderData.isReviewed ) {
        reviewBtn = (
            <div className={'col-md-5'}>
                <button onClick={() => setShow(!show)} className={'give_review_btn'}>Give Review</button>
            </div>
        )
    }

    let addOns = orderData.items.map((item: any) => (
        <div className="mt-2 pl-3 pr-3" key={item._id}>
            <div className="d-flex justify-content-between">
                <p>
                    {item.itemName} <span className="mr-2"> x {item.quantity}</span>
                    {
                        item.addOn.length > 0 && item.addOn.map((addOn: any) => (
                            <span key={addOn._id}>{addOn.name}</span>
                        ))
                    }
                </p>
                <p className={'d-flex justify-content-end'}>£ {item.itemPrice}</p>
            </div>
            <hr/>
        </div>
    ));



    function orderMessage() {
        switch (orderData.orderStatus) {
            case ORDER_STATUS.UNDER_APPROVAL:
                return "Orders is Under approval"
            case ORDER_STATUS.IN_PROGRESS:
                return "Orders is In progress"
            case ORDER_STATUS.COMPLETED:
                return "Orders is Ready"
        }
    }

    return (
        <div className="row m-1 w-100">
            <ReviewModal show={show} onModalChange={() => setShow(!show)} shopId={orderData.shop._id} orderId={orderData._id}/>
            <div className="col-md-6 mb-3">
                <div className={'card sign-up-card rounded shadow border-0 bg-white'}>
                    <div className="shop-name">
                        <div className={'res-name row'}>
                            <div className={'col-md-6'}>
                                <h5>{orderData.shop.shopName}</h5>
                            </div>
                            <div className={'col-md-6'}>
                                <div className="d-flex mt-0">
                                    <p className='order_text'>{orderMessage()}</p>
                                </div>
                            </div>
                            { showAddress }
                            { reviewBtn }
                            { showTimer }
                        </div>
                    </div>
                    {addOns}
                    <div className={'d-flex justify-content-between'}>
                        <h5 className="ml-2">Total:</h5>
                        <h5 className={'mt-0 d-flex justify-content-end mr-2'}>£ {orderData.totalPrice} </h5>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Order;
