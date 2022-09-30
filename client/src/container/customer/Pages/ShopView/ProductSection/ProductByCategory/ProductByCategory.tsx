import React, { memo} from 'react';
import Product from "../Product/Product";
import {IProduct} from "../../../../../vendor/Pages/Product/Product";
import {Container, Row} from "react-bootstrap";

interface IProductByCategory {
    categoryId: string,
    product: IProduct[],
    onModalChange: (allergyInfo: string) => void,
    onCartChangeHandler: (cart: any) => void
    deliveryType: string
}

const ProductByCategory: React.FC<IProductByCategory> = ({ categoryId, product, onModalChange, onCartChangeHandler, deliveryType}) => {
    let data: any = <h5 className={"py-4 text-center"}>No Product Found</h5>
    if (product.length > 0) {
        data =(
            <Container>
                <Row>
                    {
                        product.filter((product) => {
                            return product.category._id === categoryId;
                        }).map((filteredProduct) => (
                            <Product key={filteredProduct._id} deliveryType={deliveryType} onCartChangeHandler={onCartChangeHandler} product={filteredProduct} onModalChange={onModalChange}/>
                        ))
                    }
                </Row>
            </Container>
        )
    }
    if (Array.isArray(data) && data.length <= 0) {
        data = <h5 className={"py-4 text-center"}>No Product Found</h5>
    }
    return data
};

export default memo(ProductByCategory);
