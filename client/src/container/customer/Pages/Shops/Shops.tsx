import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import RatingStar from "../../../../components/RatingStar/RatingStar";
import './Shops.css';
import Loader from "../../../../components/Loader/Loader";
import { useSearchParams, useNavigate } from "react-router-dom";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import {ICoordinates, IShopClient} from "../../../../interface";
import ShopMap from "./ShopMap/ShopMap";
import {errorNotify} from "../../../../utils/toast";
import {Row} from "react-bootstrap";
import {useGetShops} from "../../../../hooks/customer/shop";
import {PAGINATION_LIMIT} from "../../../../lib/helper";
import Pagination from "../../../../components/Pagination/Pagination";



const Shops = () => {
    let [searchParams] = useSearchParams();
    const navigation = useNavigate();

    const [page, setPage] = useState(0);
    const [isParams, setIsParams] = useState(false)
    const [selectedCoordinates, setSelectedCoordinates] = useState<ICoordinates>({
        lat: 0,
        lng: 0
    });


    useEffect(() => {
        const paramsLat = searchParams.get("latitude");
        const paramsLng = searchParams.get("longitude");
        if (!paramsLat || !paramsLng) {
            errorNotify("Invalid location");
            navigation("/")
        }

        const lat = parseFloat(paramsLat!)
        const lng = parseFloat(paramsLng!)


        setSelectedCoordinates({
            lat,
            lng
        })
        setIsParams(true)

    }, [])

    const {isLoading, isError, data: res, isSuccess} = useGetShops(selectedCoordinates!, isParams, page)

    if (isLoading) {
        return <Loader/>
    }

    if (isError) {
        return <DisplayError/>
    }



    let showShops: any;
    if (isSuccess) {
        const totalPage = Math.ceil(res.data.shopsCount / PAGINATION_LIMIT)
        const totalPostalShopPage = Math.ceil(res.data.postalDeliveryShopCount / PAGINATION_LIMIT)

        showShops = (
            <React.Fragment>
                <div>
                    <Row className="justify-content-center">
                        {
                            res.data.shops.length > 0 ?
                                res.data.shops.map((shop: IShopClient) => (
                                    <div className="col-md-4 col-lg-4 shop_cart mb-5" key={shop._id}>
                                        <img src={shop.shopImage.avatar} alt={'pro-img'} />
                                        <div className="pro-head">
                                            <div>
                                                <h3 className="text-left">{ shop.shopName }</h3>
                                                <RatingStar avgRating={shop.avgRating} />
                                                <FaMapMarkerAlt style={{color: "#ff4200"}} />
                                                <span>{ shop.address }</span>
                                                <hr />
                                            </div>
                                            <NavLink to={`/shops/${shop.slug}`}><button className={'btn btn-visit'}>Visit</button></NavLink>
                                        </div>
                                    </div>
                                ))
                                : <h2> No Shop Found </h2>
                        }
                    </Row>
                    <Pagination page={page} setPage={setPage} totalPage={totalPage}/>
                </div>
            </React.Fragment>
        )

    }

    return (
        <div className={'shops'}>
            {
                isSuccess ?
                    <ShopMap selectedCoordinates={selectedCoordinates!} shops={res.data.shops}/>
                    : null
            }
            <section className="py-5 restaurant-section">
                <h1 className='text-center'> All Restaurants </h1>
                <div className={"bar-three"}/>
                <div className={"bar-four"}/>
                <div className='container text-center'>

                    { showShops}
                </div>
            </section>
        </div >
    )
}
export default (Shops);

