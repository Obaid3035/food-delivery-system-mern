import React, {useState} from 'react';
import {Container, Row, Col, Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import "./Product.css";
import {useDeleteProduct, useGetProduct} from "../../../../hooks/vendor/shop";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import {timeFormat} from "../../../../lib/helper";
import {successNotify} from "../../../../utils/toast";
import DeleteModal from "../../../../components/DeleteModal/DeleteModal";
import {ICategory} from "../Category/CreateCategory/CreateCategory";
import {IMenuType} from "../MenuType/CreateMenuType/CreateMenuType";
import {IAddOns} from "../AddOn/CreateAddOn/CreateAddOn";

export interface IProduct {
    _id: string,
    productName: string,
    productPicture: {
        avatar: string
    }
    cookingTime: string,
    category: ICategory
    addOn: IAddOns[]
    menuType: IMenuType
    shop: string
    allergyInfo: string,
    productPrice: number
}

const Product = () => {
    const navigate = useNavigate();
    const [id, setId] = useState<string | null>(null)
    const [pageNo, setPageNo] = useState(0)
    const [show, setShow] = useState(false)
    const {data: res, isError, isSuccess, isLoading} = useGetProduct(pageNo);

    const { mutate, isSuccess: isDeleteSuccess, reset, isLoading: isDeleteLoading, isError: isDeleteError, data: deleteRes } = useDeleteProduct(id!)

    const deleteMenuHandler = (productId: string) => {
        setId(productId)
        setShow(!show)
    }

    const onDeleteSubmit = () => {
        mutate(id!)
        setShow(!show)
    }


    if (isLoading || isDeleteLoading) {
        return <Loader/>
    }
    let products;
    if(isSuccess){
       if (res.data.data.length > 0) {
           products = res.data.data.map((product: IProduct) => (
               <Col md={5} className={'mr-3'} key={product._id}>
                   <Row className={'shadow border-0 bg-white mt-2 mb-4'}>
                       <Col md={7}>
                           <div className="mt-2">
                               <h5>{product.productName}</h5>
                               <div className="d-flex justify-content-between align-items-center">
                                   <p>£ {product.productPrice} </p>
                                   <p>Halal</p>
                                   <p>{timeFormat(product.cookingTime)}</p>
                               </div>
                               <button className={' btn-send px-3 mr-1'} onClick={() => navigate(`/vendor/create-product/${product._id}`)}>
                                   EDIT </button>
                               <button className={' btn-send px-3'} onClick={() => deleteMenuHandler(product._id)}> DELETE </button>
                           </div>
                       </Col>
                       <Col md={5} >
                           <div className={'vendor_menu'}>
                               <img alt={'img'} src={product.productPicture.avatar} />
                           </div>
                       </Col>
                   </Row>
               </Col>
           ))
       } else {
           products = (
               <Card className={'py-3 w-100'}>
                   <p className={'text-center'}>No Products Found</p>
               </Card>
           )
       }
    }
    if (isError || isDeleteError) {
        return <DisplayError/>
    }

    if (isDeleteSuccess) {
        successNotify(deleteRes.data.message)
        reset()
    }



    return (
        <div className={'page_responsive'}>
            <DeleteModal show={show} onClose={() => setShow(!show)} onSubmit={onDeleteSubmit}/>
            <div className={'d-flex justify-content-end'}>
                <button className={'btn-send px-4 mr-2'} onClick={() => navigate('/vendor/create-product')}>Create Menu</button>
            </div>

            <div className={'main_menu'}>
                <Container fluid>
                    <Row className={"justify-content-center"}>
                        {products}
                    </Row>
                </Container>

            </div>
        </div>
    );
};

export default Product;
