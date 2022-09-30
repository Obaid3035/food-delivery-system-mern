import React from 'react';
import {FaPlus, FaMinus, FaTrash} from 'react-icons/fa';
import {IAddOn} from "../../../../vendor/Pages/AddOn/CreateAddOn/CreateAddOn";
import {CartStatus} from "../Checkout";
import {ICart} from "../../ShopView/ProductSection/Product/Product";

interface ICartItem {
    cart: ICart,
    onCartChangeHandler: (itemId: string, status: CartStatus) => void,
    totalCalculateHandler: (item: {productPrice: number, qty: number }, addOn: IAddOn[]) => number,
    orderBillHandler: () => number,
    serviceFeeCalculator: () => number,
    overAllCalculator: () => number
}

const CartItems: React.FC<ICartItem> = ( {cart, onCartChangeHandler, totalCalculateHandler, orderBillHandler, serviceFeeCalculator, overAllCalculator} ) => {

    return (
        <div style={{width: "45%"}} className={'container main-section mb-5 shadow border-0 bg-white h-100 mr-3 '}>
            <h3 className={' cart-sec mt-3 text-center'}>IN YOUR CART</h3>
            <hr/>
            {
                cart.cart.map((item: any) => (
                    <div className="mt-4">
                        <div className="cart-details d-flex justify-content-between">
                            <div className="cart_name">
                                <p className={'m-0 p-0'}> {item.productName} </p>
                                {
                                    item.addOn.length > 0 && item.addOn.map((addOn: IAddOn) => (
                                        <p key={addOn._id} className={'text-muted m-0 p-0'}>+{addOn.name} -
                                            £ {addOn.price}</p>
                                    ))
                                }
                            </div>
                            <span>£ {item.productPrice}</span>
                            <div className="inc-dec">
                                {
                                    item.qty > 1 ?
                                        <span className="minus" onClick={() => onCartChangeHandler(item._id, CartStatus.DECREMENT)}>
                                            <FaMinus/>
                                        </span>
                                        : null
                                }
                                <span className="quantity">
                                    {item.qty}
                                </span>
                                <span className="plus" onClick={() => onCartChangeHandler(item._id, CartStatus.INCREMENT)}>
                                    <FaPlus/>
                                </span>
                            </div>
                            <span>  £ { totalCalculateHandler(item, item.addOn) } </span>

                            <div className="delete" onClick={() => onCartChangeHandler(item._id, CartStatus.REMOVE)}>
                                <FaTrash/>
                            </div>
                        </div>
                        <hr/>
                    </div>
                ))
            }
            <div className={'summary'}>
                <hr/>
                <h4>ORDER SUMMARY</h4>
                <div className={'order-sum'}>
                    <h5>ORDER BILL</h5>
                    <h4> £ { orderBillHandler() } </h4>
                </div>
                <div className={'order-sum'}>
                    <h5>Service Fee</h5>
                    <h4> £ {serviceFeeCalculator()} </h4>
                </div>
                <div className={'order-sum'}>
                    <h5>TOTAL</h5>
                    <h4> £ {overAllCalculator()} </h4>
                </div>
            </div>
        </div>
    )
};

export default CartItems;
