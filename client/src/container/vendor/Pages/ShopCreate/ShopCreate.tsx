import React, {useEffect, useState} from 'react';
import {Card, Col, Form, Row} from "react-bootstrap";
import {useForm, Controller} from "react-hook-form";
import ReactQuill from 'react-quill';
import Select from "react-select";
import {shopCreateValidation} from "../../../../lib/validation";
import {quilFormats, quilModules, TOKEN} from "../../../../lib/helper";
import MapInput from "./MapInput";
import {errorNotify, successNotify} from "../../../../utils/toast";
import {ICoordinates, IShopInput} from "../../../../interface";
import { useCreateShop } from "../../../../hooks/vendor/shop";
import Loader from "../../../../components/Loader/Loader";
import {DELIVERY_TYPE, errorMessage} from "../../../../App";
import {useNavigate} from "react-router-dom";


const ShopCreate = () => {
    const navigate = useNavigate();
    const [selectedCoordinates, setSelectedCoordinates] = useState<ICoordinates | null>(null)
    const {mutate, isSuccess, isLoading, isError, error, data: res} = useCreateShop();
    const deliveryTypeOptions = [
        {value: DELIVERY_TYPE.LOCAL_DELIVERY, label: 'Local Delivery'},
        {value: DELIVERY_TYPE.POSTAL_DELIVERY, label: 'Postal Delivery'},
        {value: 'pickUp', label: 'Pick Up'},
    ]

    const {register, handleSubmit, control, watch, reset, formState: {errors}} = useForm<IShopInput>({
        defaultValues: {
            deliveryType: deliveryTypeOptions[0]
        }
    });

    useEffect(() => {
        if (isError) {
            reset({
                shopImage: [],
                shopBannerImage: []
            })
        }
    }, [isError])




    const onSubmit = handleSubmit((data) => {
        if (selectedCoordinates) {
            const formData =  new FormData();
            const formDataObject: any = {
                ...data,
                deliveryType: data.deliveryType.value,
                shopImage: data.shopImage[0],
                shopBannerImage: data.shopBannerImage[0],
                location: {
                    coordinates: [selectedCoordinates.lat, selectedCoordinates.lng]
                }
            }

            for (const field in formDataObject) {
                if (field === "location") {
                    formData.append(field, JSON.stringify(formDataObject[field]))
                } else {
                    formData.append(field, formDataObject[field])
                }
            }
            mutate(formData)
        } else {
            errorNotify("Please select a location")
        }
    });

    if (isLoading) {
        return <Loader/>
    }


    if (isSuccess) {
        localStorage.removeItem(TOKEN);
        localStorage.setItem(TOKEN, res.data.token)
        navigate("/vendor/create-subscription")
        successNotify(res.data.message)
    }



    return (
        <div className={'page_responsive'}>
            <h3 className={'text-center'}>Create Your Shop</h3>
            <Row className={'justify-content-center'}>
                { isError ? errorMessage(error?.response.data.message!) : "" }
                <Col md={10}>
                    <Form onSubmit={onSubmit}>
                        <Card>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label> Shop Name </Form.Label>
                                    <Form.Control type={'text'}
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
                                <Card className={'my-4 p-4'}>
                                    <p className={'text-center'}> Address </p>
                                    <Form.Group className={'py-3'}>
                                        <Form.Label> Shop Address </Form.Label>
                                        <Form.Control type={'text'}
                                                      {...register("address", shopCreateValidation.address)} />

                                        <small className="text-danger">
                                            {errors.address?.message}
                                        </small>
                                    </Form.Group>
                                    <Form.Group className={'py-3'}>
                                        <Form.Label> Postal Code </Form.Label>
                                        <Form.Control type={'text'}
                                                      {...register("postalCode", shopCreateValidation.postalCode)} />

                                        <small className="text-danger">
                                            {errors.postalCode?.message}
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
                                    </Form.Group>
                                </Card>
                            </Card.Body>
                        </Card>
                        <Card className={'my-4'}>
                            <Card.Body>
                                <p className={'text-center'}>Gallery</p>
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input"
                                           id="customFile" {...register('shopImage', shopCreateValidation.shopImage)}  />
                                    <label className="custom-file-label"
                                           htmlFor="inputGroupFile01">{watch("shopImage") ? watch("shopImage")[0]?.name : "Shop Image"}</label>
                                </div>
                                <small className="text-danger my-2">
                                    {/*@ts-ignore*/}
                                    {errors.shopImage?.message}
                                </small>
                                <div className="custom-file my-2">
                                    <input type="file" className="custom-file-input"
                                           id="customFile" {...register('shopBannerImage', shopCreateValidation.shopBannerImage)} />
                                    <label className="custom-file-label"
                                           htmlFor="inputGroupFile01">{watch("shopBannerImage") ? watch("shopBannerImage")[0]?.name : "Banner Image"}</label>
                                </div>
                                <small className="text-danger my-2">
                                    {/*@ts-ignore*/}
                                    {errors.shopBannerImage?.message}
                                </small>
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

export default ShopCreate;



