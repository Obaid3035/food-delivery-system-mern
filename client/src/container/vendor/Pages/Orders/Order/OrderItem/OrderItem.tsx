import React from 'react';
import {Col} from "react-bootstrap";

interface IOrderItem {
    item: {
        _id: number,
        itemName: string,
        quantity: number,
        itemPrice: number,
        addOn: {
            name: string,
            price: number
        }[]
    }
}

const OrderItem: React.FC<IOrderItem> = ({ item}) => {

    let addOn: any = <div className={'addOns_detail text-muted'}>
        <p>No AddOn added</p>
    </div>

    if (item.addOn.length > 0) {
        addOn = item.addOn.map((addon) => (
            <div className={'addOns_detail text-muted'}>
                <p>{addon.name}</p>
                <span>${addon.price}</span>
            </div>
        ))
    }

    return (
        <Col md={3} className={'show_order_main_col'} key={item._id}>
            <div className={'main_item'}>
                <p>{item.itemName}</p>
            </div>
            <div className={'main_item_detail'}>
                <div className={'quantity'}>
                    <p>Quantity</p>
                    <p>{item.quantity}</p>
                </div>
                <hr className={'divider'} />
                <div className={'addOns'}>
                    <p>Addons</p>
                    { addOn }
                </div>
                <hr />
                <div className={'price'}>
                    <p>PRICE</p>
                    <span>${item.itemPrice * item.quantity }</span>
                </div>
            </div>
        </Col>

    );
};

export default OrderItem;
