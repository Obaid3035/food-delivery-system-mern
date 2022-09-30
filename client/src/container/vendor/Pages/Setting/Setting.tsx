import React, {useEffect, useState} from 'react';
import {Card, Col, Form, Row} from "react-bootstrap";
import {Controller, useForm} from "react-hook-form";
import ReactQuill from 'react-quill';
import {Switch} from "@material-ui/core"
import 'react-quill/dist/quill.snow.css';
import {quilFormats, quilModules} from "../../../../lib/helper";
import {shopCreateValidation} from "../../../../lib/validation";
import MapInput from "../ShopCreate/MapInput";
import {ICoordinates, IShopInput, SHOP_STATUS} from "../../../../interface";
import Select from "react-select";
import {useGetShop, useUpdateShop} from "../../../../hooks/vendor/shop";
import {errorNotify, successNotify} from "../../../../utils/toast";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import {NavLink} from "react-router-dom";


const Setting = () => {
    const [selectedCoordinates, setSelectedCoordinates] = useState<ICoordinates | null>(null)

    const deliveryTypeOptions = [
        {value: 'delivery', label: 'Delivery'},
        {value: 'pickUp', label: 'Pick Up'},
        {value: 'both', label: 'Both'}
    ]

    const {mutate, isSuccess, isLoading, reset, isError, data: res} = useUpdateShop();
    const { data: shopRes, isLoading: isShopLoading, isSuccess: isShopSuccess, isError: isShopError } = useGetShop()

    const {register, handleSubmit, setValue, control, formState: {errors}} = useForm<IShopInput>();


    const onSubmit = handleSubmit((data) => {
        if (selectedCoordinates) {
            const formData = {
                ...data,
                deliveryType: data.deliveryType.value,
                location: {
                    coordinates: [selectedCoordinates.lat, selectedCoordinates.lng]
                }
            }
            mutate(formData)
        } else {
            errorNotify("Please select a location")
        }
    });


    let shopVisibility= (
        <div className="text-center">
            <p className={'text-center'}>This option will be available when your shop is active</p>
        </div>
    );

    useEffect(() => {
        if(isShopSuccess) {
            setSelectedCoordinates({
                lat: shopRes.data.shop.location.coordinates[0],
                lng: shopRes.data.shop.location.coordinates[1]
            })
        }
    }, [isShopSuccess])

    if (isShopSuccess) {
        const shop = shopRes.data.shop;
        setValue("shopName", shop.shopName)
        setValue("description", shop.description)
        setValue("address", shop.address)
        setValue("postalCode", shop.postalCode)
        setValue("shopVisibility", shop.shopVisibility)
        setValue("deliveryType", deliveryTypeOptions.find(option => option.value === shop.deliveryType)!)
        if (shop.shopStatus === SHOP_STATUS.ACTIVE && shopRes.data.accountSetup) {
            shopVisibility = (
                <React.Fragment>
                    <span> OFF </span>
                    <Controller
                        control={control}
                        name="shopVisibility"
                        render={({field: {onChange, value}}) => (
                            <Switch
                                checked={value}
                                onChange={onChange}
                                color={'primary'}
                            />

                        )}
                    />
                    <span> ON </span>
                </React.Fragment>
            )
        } else if (!shopRes.data.accountSetup) {
            shopVisibility = (
                <div className="text-center">
                    <p className={'text-center'}>This option will be available when your shop is active</p>
                    <NavLink to={"/vendor/account"}>
                        <button className={'btn btn-send'}>Setup bank account detail</button>
                    </NavLink>
                </div>
            )
        }
    }



    if (isLoading || isShopLoading) {
        return <Loader/>
    }

    if (isError || isShopError) {
        return <DisplayError/>
    }

    if (isSuccess) {
        successNotify(res.data.message)
        reset()
    }


    return (
        <div id="settings" className={'page_responsive'}>
            <h3 className={'text-center'}>Update Shop</h3>
            <Row className={'justify-content-center'}>
                <Col md={10}>
                    <Form onSubmit={onSubmit}>
                        <Card>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label> Shop Name </Form.Label>
                                    <Form.Control type={'text'}
                                                  defaultValue={'Pizza Hut'}
                                                  {...register("shopName", shopCreateValidation.shopName)} />

                                    <small className="text-danger">
                                        {errors.shopName?.message}
                                    </small>
                                </Form.Group>
                                <Form.Group className={'py-3'}>
                                    <Form.Label> Shop Description </Form.Label>
                                    <Controller
                                        control={control}
                                        name="description"
                                        rules={shopCreateValidation.description}
                                        render={({field: {onChange, value}}) => (
                                            <ReactQuill
                                                onChange={onChange}
                                                value={value || ""}
                                                modules={quilModules}
                                                formats={quilFormats}
                                                placeholder="Leave Your Description"/>

                                        )}
                                    />
                                    <small className="text-danger">
                                        {errors.description?.message}
                                    </small>
                                </Form.Group>
                                <small className="text-danger">
                                    {errors.shopName?.message}
                                </small>
                                <Form.Group>
                                    <Form.Label htmlFor="name">Shop Visibility</Form.Label> <br/>
                                    { shopVisibility }
                                </Form.Group>
                                <Form.Group className={'py-3'}>
                                    <Form.Label> Postal Code </Form.Label>
                                    <Form.Control type={'text'}
                                                  {...register("postalCode", shopCreateValidation.postalCode)} />

                                    <small className="text-danger">
                                        {errors.postalCode?.message}
                                    </small>
                                </Form.Group>
                                <Card className={'my-4 p-4'}>
                                    <p className={'text-center'}> Shop Address </p>
                                    <Form.Group className={'py-3'}>
                                        <Form.Label> Shop Address </Form.Label>
                                        <Form.Control type={'text'}
                                                      {...register("address", shopCreateValidation.address)} />

                                        <small className="text-danger">
                                            {errors.address?.message}
                                        </small>
                                    </Form.Group>
                                    <Form.Group className={'py-3'}>
                                        <Form.Label>Delivery Type</Form.Label>
                                        <Controller
                                            control={control}
                                            name="deliveryType"
                                            render={({field: {onChange, value}}) => (
                                                <Select
                                                    isSearchable={false}
                                                    value={value}
                                                    onChange={onChange}
                                                    options={deliveryTypeOptions}
                                                />

                                            )}
                                        />
                                    </Form.Group>
                                    <Form.Group className={'py-3'}>
                                        <Form.Label>Select Location</Form.Label>
                                        <MapInput
                                            selectedCoordinates={selectedCoordinates}
                                            setSelectedCoordinates={setSelectedCoordinates}
                                        />
                                    </Form.Group> </Card>
                            </Card.Body>
                        </Card>

                        <div className={'text-center'}>
                            <button className={'btn btn-send btn-block px-4'} type={'submit'}>Save</button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default Setting;
