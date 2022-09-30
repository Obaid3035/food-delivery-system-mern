import React, {useState, useCallback, memo} from 'react';
import {NavLink} from 'react-router-dom';
import {FiShoppingCart} from 'react-icons/fi';
import {Container, Row, Tab, Tabs} from "react-bootstrap";
import "./ProductSection.css";
import {IProduct} from "../../../../vendor/Pages/Product/Product";
import {ICategory} from "../../../../vendor/Pages/Category/CreateCategory/CreateCategory";
import Product, {ICart} from "./Product/Product";
import ProductByCategory from "./ProductByCategory/ProductByCategory";
import AllergyModal from "./AllergyModal/AllergyModal";
import {getDecryptedCartItems} from "../../../../../lib/helper";

interface IProductProps {
    category: ICategory[],
    product: IProduct[],
    slug: string,
    deliveryType: string
}

const ProductSection: React.FC<IProductProps> = (props) => {

    const [key, setKey] = useState<string>('All');
    const [show, setShow] = useState<boolean>(false);
    const [allergyInfo, setAllergyInfo] = useState("")
    const [cart, setCart] = useState<ICart>(getDecryptedCartItems());
    const memoizedOnModalOpen = (allergyInfo: string) => onModalOpen(allergyInfo)
    const memoizedOnCartChangeHandler = useCallback((cart: any) => onCartChangeHandler(cart), []);

    const onModalOpen = (allergyInfo: string) => {
        setAllergyInfo(allergyInfo)
        setShow(!show)
    }

    const onCartChangeHandler = (cart: any) => {
        setCart(cart)
    }


    let tabs, allTab: any = <h5 className={"py-4 text-center"}>No Product Found</h5>

    if (props.product.length > 0) {
        allTab = (
            <Container>
                <Row>
                    {
                        props.product.map((product) => (
                            <Product key={product._id} deliveryType={props.deliveryType} onCartChangeHandler={memoizedOnCartChangeHandler} product={product} onModalChange={memoizedOnModalOpen}/>
                        ))
                    }
                </Row>
            </Container>
        )
    }

    if (props.category.length > 0) {
        const tab = props.category.map((category) => {
                return (
                    <Tab key={category._id} eventKey={category._id!} title={category.title} className={'w-100'}>
                        <ProductByCategory
                            categoryId={category._id!}
                            deliveryType={props.deliveryType}
                            onCartChangeHandler={memoizedOnCartChangeHandler}
                            product={props.product}
                            onModalChange={memoizedOnModalOpen}
                        />
                    </Tab>
                )
            }
        )

        tabs = (
            <Tabs
                activeKey={key}
                onSelect={(key) => {
                    setKey(key!)
                }}
                className="mb-3 tabs d-flex justify-content-center"
            >
                <Tab eventKey="All" title="All" className={'w-100'}>
                    {allTab}
                </Tab>
                {tab}
            </Tabs>
        )
    }


    return (
        <React.Fragment>
            <AllergyModal show={show} onModalChange={() => setShow(!show)} text={allergyInfo}/>
            <div className={'checkoutBtn'}>
                <NavLink to={`/checkout/${props.slug}`}>
                    <button className={cart.cart.length > 0 ? "checkout_btn" : "checkout_btn disabled_checkout_btn"} disabled={getDecryptedCartItems().length <= 0}>Go To Checkout
                        <FiShoppingCart className={'cart_icon'}/>
                        <span className={'disable-counter'}>{cart.cart.length}</span>
                    </button>
                </NavLink>
            </div>
            <hr/>
            <div>
                <div className={'tabs_section'}>
                    <h3 className={'text-center py-3'}>Menu</h3>
                    {tabs}
                </div>
            </div>
        </React.Fragment>
    );
};

export default memo(ProductSection);
