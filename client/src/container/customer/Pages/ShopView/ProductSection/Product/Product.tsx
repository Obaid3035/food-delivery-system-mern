import React, {useEffect, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import {IProduct} from "../../../../../vendor/Pages/Product/Product";
import {getDecryptedCartItems, role_symbol, storeEncryptedCartItems, timeFormat} from "../../../../../../lib/helper";
import {MdTimer} from "react-icons/md"
import AuthModal from "./AuthModal/AuthModal";
import {useIfOrdered} from "../../../../../../hooks/customer/shop";
import {useParams} from "react-router-dom";
import {USER_ROLE} from "../../../../../../App";
import AddOnModal from "./AddOnModal/AddOnModal";
import './Product.css';
import {errorNotify} from "../../../../../../utils/toast";
import { useNavigate } from "react-router-dom";

interface IProductItemProps {
    product: IProduct
    onModalChange: (allergyInfo: string) => void,
    onCartChangeHandler: (cart: any) => void,
    deliveryType: string
}

export interface ICart {
    deliveryType: string,
    cart: any[]
}

const Product: React.FC<IProductItemProps> = ({product, onModalChange, onCartChangeHandler, deliveryType}) => {
    const navigation = useNavigate();
    const [authModalShow, setAuthModalShow] = useState(false)
    const [addOnShow, setAddOnShow] = useState(false)
    const {slug} = useParams();
    const [isAuth, setIsAuth] = useState(false);
    const {data: ifOrderedRes, isSuccess: ifOrderedIsSuccess} = useIfOrdered(slug!, isAuth);

    useEffect(() => {
        if (!slug) {
            errorNotify("Shop does not exist");
            navigation("/")
        } else if (role_symbol(USER_ROLE.CUSTOMER)) {
            setIsAuth(true)
        }
    }, [])

    function checkIfItemPresentInCart() {
        const cartItem = getDecryptedCartItems().cart;
        if (cartItem.length > 0) {
            const found = cartItem.find((item: any) => product._id === item._id);
            return !!found;
        }
        return false
    }

    function addToCartBtnChangeHandler() {
        if (!isAuth) {
            return <button onClick={() => setAuthModalShow(!authModalShow)} className={"btn-send"}>ADD TO CART</button>
        } else if (ifOrderedIsSuccess && !ifOrderedRes.data) {
            if (checkIfItemPresentInCart()) {
                return <button disabled className={"btn-send disabled_add_to_cart_btn"}>ADD TO CART</button>
            } else if (product.addOn.length > 0 && isAuth) {
                return <button onClick={() => setAddOnShow(!addOnShow)} className={"btn-send"}>ADD TO CART</button>
            } else if (isAuth) {
                return <button onClick={() => onAddToCartHandler()} className={"btn-send"}>ADD TO CART</button>
            }
        } else {
            return <button disabled className={"btn-send"}>ADD TO CART</button>
        }
    }




    const onAddToCartHandler = () => {
        const cart = {
            _id: product._id,
            cookingTime: product.cookingTime,
            productName: product.productName,
            productPrice: product.productPrice,
            qty: 1,
            addOn: []
        }
        const cartItem: ICart = getDecryptedCartItems()
        cartItem.deliveryType = deliveryType;
        cartItem.cart.push(cart)
        onCartChangeHandler(cartItem)
        storeEncryptedCartItems(cartItem)
    }

    return (
        <React.Fragment>
            <AuthModal show={authModalShow} handleChange={() => setAuthModalShow(!authModalShow)}/>
            <AddOnModal deliveryType={deliveryType} onCartChangeHandler={onCartChangeHandler} addOnShow={addOnShow}
                        onAddOnModalChange={() => setAddOnShow(!addOnShow)} product={product}/>
            <Col md={6} className={'mt-5 mb-5'}>
                <Row className="mr-1 product_item">
                    <Col md={7}>
                        <div className="mt-2">
                            <div className="d-flex justify-content-between product_details">
                                <h5>{product.productName}</h5>
                                <p>{product.menuType.title} </p>
                                <p className={"d-flex align-items-center"}><MdTimer
                                    className={"mr-1"}/> {timeFormat(product.cookingTime)}</p>
                            </div>
                            <hr/>
                            <p className={'mt-3'}>£ {product.productPrice}</p>
                            <div className={'d-flex'}>
                                <div>
                                    {addToCartBtnChangeHandler()}
                                </div>
                                <div>
                                    <button
                                        className={' btn-send ml-2'}
                                        onClick={() => onModalChange(product.allergyInfo!)}
                                    >
                                        ALLERGY INFO.
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={5}>
                        <div className={'menu_img'}>
                            <img className="pt-3 w-100" alt={'img'} src={product.productPicture.avatar}/>
                        </div>
                    </Col>
                </Row>
            </Col>
        </React.Fragment>
    );
};

export default Product;
