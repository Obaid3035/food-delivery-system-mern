import React, {useEffect, useState} from "react";
import "./ShopView.css";
import ProductSection from "./ProductSection/ProductSection";
import {FaMapMarkerAlt} from 'react-icons/fa';
import {useParams} from "react-router-dom";
import {useGetAllReviews, useGetShopById} from "../../../../hooks/customer/shop";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import Loader from "../../../../components/Loader/Loader";
import ShopReviewModal from "./ShopReviewModal/ShopReviewModal";
import ShopLocationErrorModal from "./ShopLocationErrorModal/ShopLocationErrorModal";

const ShopView = () => {

    const {slug} = useParams();
    const [isParams, setIsParams] = useState(false);
    const [show, setShow] = useState(false)
    const [locationErrorShow, setLocationErrorShow] = useState(false)
    useEffect(() => {
        if (slug) {
            setIsParams(true)
        }
    }, [])

    const {isLoading, isError, data: res, isSuccess} = useGetShopById(slug!, isParams);
    if (isLoading) {
        return <Loader/>
    }

    if ( isError) {
        return <DisplayError/>
    }

    if (isSuccess) {
        // navigator.geolocation.getCurrentPosition( (position) => {
        //     const currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        //     const shopLocation = { lat: res.data.shop.location[0], lng: res.data.shop.location[1]};
        //
        //     const isNear = arePointsNear(currentLocation, shopLocation, 10)
        //
        //     if (!res.data.shop.shopVisibility) {
        //         setLocationErrorShow(true)
        //     } else if (!isNear && !(res.data.deliveryType === DELIVERY_TYPE.PICKUP)) {
        //         setLocationErrorShow(true)
        //     }
         return (
            <div className={'container w-100 shadow res_div'}>
                <ShopLocationErrorModal show={locationErrorShow}/>
                {
                    res.data.reviewCount > 0 ?
                        <ShopReviewModal slug={slug!} show={show} onModalChange={() => setShow(!show)}/>
                        : null
                }
                <img className={'res-img'} src={res.data.shop.shopBannerImage.avatar} alt="img"/>
                <div className="d-flex align-items-center justify-content-between mt-4">
                    <div>
                        <h3 style={{fontWeight: "700"}}>{res.data.shop.shopName}</h3>
                        <div className="bar-view1 w-100" />
                        <div className="bar-view2 w-100"/>
                    </div>
                    <div>
                        <button
                            className={'btn-send ml-2'}
                            onClick={() => setShow(!show)}
                            disabled={res.data.reviewCount <= 0}
                        >
                            <span className={"mr-2"}>{res.data.reviewCount}</span>
                            Reviews
                        </button>
                    </div>
                </div>
                <div className={'d-flex align-items-center mt-3'}>
                    <FaMapMarkerAlt className={"map-alt"} />
                    <p className={"m-0 ml-2"}> {res.data.shop.address} </p>
                </div>
                <p className={'text-left mt-3'}>
                    <td dangerouslySetInnerHTML={{__html: res.data.shop.description}}/>
                </p>
                <div className="mt-2">
                    <ProductSection deliveryType={res.data.shop.deliveryType} slug={slug!}  product={res.data.products} category={res.data.category}/>
                </div>
            </div>
        )
    }

    return <Loader/>
}
export default ShopView;
