import React, {useEffect, useState, useMemo} from "react";
import "./Checkout.css";
import PersonalDetails from "./PersonalDetails/PersonalDetails";
import CartItems from "./CartItems/CartItems";
import {getDecryptedCartItems, role_symbol, storeEncryptedCartItems, TOKEN} from "../../../../lib/helper";
import {USER_ROLE} from "../../../../App";
import {errorNotify} from "../../../../utils/toast";
import {IUser} from "../../../../interface";
import {useNavigate, useParams} from "react-router-dom";
import jwt from "jwt-decode"
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js";
import Loader from "../../../../components/Loader/Loader";
import {IAddOn} from "../../../vendor/Pages/AddOn/CreateAddOn/CreateAddOn";
import {ICart} from "../ShopView/ProductSection/Product/Product";

export interface IUserDetail  {
    name: string,
    email: string,
    phoneNumber: string
}

export interface ITotalCalculator {
    productPrice: number,
    qty: number,
}

export enum CartStatus {
    INCREMENT= "increment",
    DECREMENT= "decrement",
    REMOVE = "remove",
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);


const Checkout = () => {
    const navigation = useNavigate();
    const [userDetails, setUserDetails] = useState<IUserDetail | null>(null);
    const { slug } = useParams();
    const [cart, setCart] = useState<ICart>({
        deliveryType: "",
        cart: []
    })


    useEffect(() => {
        const token = localStorage.getItem(TOKEN);
        if (!token) {
            errorNotify("Not Authorize")
            navigation("/")
        }  else if (getDecryptedCartItems().cart.length <= 0 || (getDecryptedCartItems().deliveryType === "") ){
            errorNotify("Cart is empty")
            navigation("/shops/" + slug)
        } else if (!role_symbol(USER_ROLE.CUSTOMER)) {
            errorNotify("Not Authorize")
            navigation("/")
        } else {
            const decode: { user: IUser } = jwt(token);
            setUserDetails({
                name: decode.user.name,
                email: decode.user.email,
                phoneNumber: decode.user.phoneNumber
            })
            setCart(getDecryptedCartItems())
        }
    }, [])

    const orderBillHandler = () => {
        let totalAddOnPrice= 0
        return cart.cart.reduce((acc, val) => {
            if (val.addOn.length > 0) {
                totalAddOnPrice = val.addOn.reduce((acc: number, val2: IAddOn) => {
                    return acc + (+val2.price)
                }, 0)
            }
            return (acc + (+val.productPrice) + totalAddOnPrice) * val.qty
        }, 0)
    }

    const serviceFeeCalculator = () => {
        let calculateAmount = 1;
        let totalAmount = orderBillHandler()
        if (totalAmount >= 10) {
            return parseFloat((totalAmount * 0.1).toFixed(2))
        }
        return calculateAmount
    }

    const overAllCalculator = () => {
        const calculateAmount = serviceFeeCalculator();
        const totalAmount = orderBillHandler()
        return parseFloat((parseFloat(String(calculateAmount)) + parseFloat(totalAmount)).toFixed(2))
    }

    const onCartChangeHandler = (itemId: string, status: CartStatus) => {
        const cartClone = getDecryptedCartItems();
        const cartItemIndex = cartClone.cart.findIndex(((item: any) => item._id === itemId));
        if (parseInt(cartItemIndex) >= 0) {
            switch (status) {
                case CartStatus.INCREMENT:
                    cartClone.cart[cartItemIndex].qty += 1
                    break;
                case CartStatus.DECREMENT:
                    cartClone.cart[cartItemIndex].qty -= 1
                    break;
                case CartStatus.REMOVE:
                    cartClone.cart.splice(cartItemIndex, 1);
                    break;
            }
            if (status === CartStatus.REMOVE && cartClone.cart.length <= 0) {
                localStorage.removeItem("cart");
                navigation(`/shops/${slug}`)
            } else {
                storeEncryptedCartItems(cartClone)
            }
            setCart(cartClone)
        }
    }

    const totalCalculateHandler = (item: ITotalCalculator, addOn: IAddOn[]) => {
        if (addOn.length > 0) {
            return item.qty * (
                item.productPrice + addOn.reduce((acc, curVal) => acc + (+curVal.price), 0)
            )
        } else  {
            return item.qty * item.productPrice;
        }
    }





    return userDetails?
        (
            <div className="d-flex justify-content-around flex-wrap">
                <Elements stripe={stripePromise}>
                    <PersonalDetails
                        userDetails={userDetails}
                        cart={cart}
                        slug={slug!}
                        orderBillHandler={orderBillHandler}
                        serviceFeeCalculator={serviceFeeCalculator}
                        overAllCalculator={overAllCalculator}
                    />
                </Elements>
                <CartItems
                    cart={cart}
                    onCartChangeHandler={onCartChangeHandler}
                    totalCalculateHandler={totalCalculateHandler}
                    orderBillHandler={orderBillHandler}
                    serviceFeeCalculator={serviceFeeCalculator}
                    overAllCalculator={overAllCalculator}
                />
            </div>
        ) : <Loader/>
}
export default Checkout;
