import React, {useEffect, useState} from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {useNavigate, useParams} from "react-router-dom";
import {Controller, useForm} from 'react-hook-form';
import {menuValidation} from '../../../../../lib/validation';
import {LocalizationProvider, TimePicker} from '@mui/lab';
import TextField from '@mui/material/TextField';
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import Select from 'react-select';
import "../Product.css";
import {ISelect} from "../../../../../interface";
import {errorMessage} from "../../../../../App";
import axios from "axios";
import {getTokenFormat} from "../../../../../lib/helper";
import {useCreateProduct, useEditProduct} from "../../../../../hooks/vendor/shop";
import Loader from "../../../../../components/Loader/Loader";
import DisplayError from "../../../../../components/DisplayError/DisplayError";
import {errorNotify, successNotify} from "../../../../../utils/toast";
import {IMenuType} from "../../MenuType/CreateMenuType/CreateMenuType";
import {ICategory} from "../../Category/CreateCategory/CreateCategory";

export interface IProductInput {
    productName: string,
    productInfo: string,
    productPrice: number,
    cookingTime: Date,
    allergyInfo: string,
    productPicture: [File]
    menuType: ISelect,
    addOn: [ISelect],
    category: ISelect
}

export interface IProductInputResponse {
    productName: string,
    productInfo: string,
    productPrice: number,
    cookingTime: string,
    allergyInfo: string,
    productPicture: {
        avatar: string
    },
    menuType: IMenuType,
    addOn: {
        _id: string,
        title: string
    }[],
    category: ICategory
}

const CreateProduct = () => {
    const navigate = useNavigate();
    const {id} = useParams()
    const isAddMode = !id;

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [menuTypeOptions, setMenuTypeOptions] = useState([]);
    const [addOnOptions, setAddOnOptions] = useState([]);
    const [optionsError, setOptionsError] = useState({
        categoryOptions: "",
        menuTypeOptions: "",
        addOnOptions: ""
    });

    useEffect(() => {
        if (!isAddMode) {
            axios.get(`/vendor/products/${id}`, getTokenFormat())
                .then((res: { data: IProductInputResponse }) => {
                    setValue("productName", res.data.productName)
                    setValue("productInfo", res.data.productInfo)
                    setValue("productPrice", res.data.productPrice)
                    setValue("cookingTime", new Date(res.data.cookingTime))
                    setValue("allergyInfo", res.data.allergyInfo)
                    setValue("menuType", {
                        label: res.data.menuType.title,
                        value: res.data.menuType._id
                    })
                    // @ts-ignore
                    setValue("addOn", res.data.addOn.map((addOn) => {
                        return {
                            label: addOn.title,
                            value: addOn._id,
                        }
                    }))
                    setValue("category", {
                        label: res.data.category.title,
                        value: res.data.category._id!
                    })
                })
        }
    }, []);

    const {mutate, isSuccess, isLoading, isError, data: res} = useCreateProduct();
    const {
        mutate: editProduct,
        isSuccess: isEditSuccess,
        isLoading: isEditLoading,
        isError: isEditError,
        data: editRes
    } = useEditProduct(id!);


    useEffect(() => {
        axios.get('/vendor/products-options', getTokenFormat())
            .then((res) => {
                const errorObj = {
                    menuTypeOptions: "",
                    addOnOptions: "",
                    categoryOptions: ""
                }

                if (res.data.menuType.length > 0) {
                    setMenuTypeOptions(res.data.menuType)
                } else {
                    errorObj.menuTypeOptions = "Please create a menu type first"
                }
                if (res.data.addOn.length > 0) {
                    setAddOnOptions(res.data.addOn)
                } else {
                    errorObj.addOnOptions = "Please create a add on first"
                }

                if (res.data.category.length > 0) {
                    setCategoryOptions(res.data.category)
                } else {
                    errorObj.categoryOptions = "Please create a category first"
                }

                setOptionsError(errorObj)
            })
    }, []);

    const {register, handleSubmit, watch, setValue, formState: {errors}, control} = useForm<IProductInput>({
        defaultValues: {
            cookingTime: new Date(0, 0, 0, 1, 0, 0)
        }
    });

    const menuDataSubmit = handleSubmit((data) => {
        const formData = new FormData();
        if (!data.category || !data.addOn || !data.menuType){
            errorNotify("Please fill all the required fields")
        } else {
            const formDataObject: any = {
                ...data,
                menuType: data.menuType.value,
                category: data.category.value,
                addOn: data.addOn.map(addOn => addOn.value),
                productPicture: data.productPicture[0]
            }

            for (const field in formDataObject) {
                if (field === "addOn") {
                    formData.append(field, JSON.stringify(formDataObject[field]))
                } else {
                    formData.append(field, formDataObject[field])
                }
            }

            if (!isAddMode) {
                editProduct(formData)
            } else {
                mutate(formData)
            }
        }

    });

    if (isSuccess) {
        successNotify(res.data.message)
        navigate("/vendor/product")
    }

    if (isEditSuccess) {
        successNotify(editRes.data.message)
        navigate("/vendor/product")
    }

    if (isError || isEditError) {
        return <DisplayError/>
    }

    if (isLoading || isEditLoading) {
        return <Loader/>
    }


    return (
        <div className={'page_responsive'}>
            <div className='d-flex justify-content-between'>
                <h2>{!isAddMode ? "Update" : "Create"} Product</h2>
                <button className={'btn-send px-4 mr-2 mb-4'} onClick={() => navigate('/vendor/product')}>Back</button>
            </div>
            <div className={'mt-5'}>
                <Row className={'justify-content-center'}>
                    <Col md={10} className={'create_menu'}>
                        <Form onSubmit={menuDataSubmit}>
                            <div className="form-row">
                                <Form.Group className="mb-3 col-md-6" controlId="formBasicEmail">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register("productName", menuValidation.productName)}
                                        placeholder="Product Name"/>
                                    {errorMessage(errors.productName?.message!)}
                                </Form.Group>

                                <Form.Group className="mb-3 col-md-6" controlId="formBasicEmail">
                                    <Form.Label>Product Information</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register("productInfo", menuValidation.productInfo)}
                                        placeholder="Product Information"/>
                                    {errorMessage(errors.productInfo?.message!)}
                                </Form.Group>

                                <Form.Group className="mb-3 col-md-6" controlId="formBasicEmail">
                                    <Form.Label>Product Price £</Form.Label>
                                    <Form.Control
                                        type="number"
                                        {...register("productPrice", menuValidation.productPrice)}
                                        placeholder="Product Price £"/>
                                    {errorMessage(errors.productPrice?.message!)}
                                </Form.Group>

                                <Form.Group className="mb-3 col-md-6" controlId="formBasicEmail">
                                    <Form.Label>Cooking time</Form.Label>
                                    <div className={'d-flex'}>
                                        <Controller
                                            control={control}
                                            name="cookingTime"
                                            render={({field: {onChange, value}}) => (
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <TimePicker
                                                        label="Hour"
                                                        ampm={false}
                                                        maxTime={new Date(0, 0, 0, 3, 0, 0)}
                                                        value={value}
                                                        onChange={onChange}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            )}/>
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Category</Form.Label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({field: {value, onChange, ref}}) => (
                                            <Select options={categoryOptions}
                                                    value={value}
                                                    onChange={onChange}
                                            />
                                        )}
                                    />
                                    {errorMessage(optionsError.categoryOptions)}
                                </Form.Group>

                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Add Ons</Form.Label>
                                    <Controller
                                        name="addOn"
                                        control={control}
                                        render={({field: {value, onChange, ref}}) => (
                                            <Select options={addOnOptions}
                                                    value={value}
                                                    isMulti
                                                    onChange={onChange}
                                            />
                                        )}
                                    />
                                    {errorMessage(optionsError.addOnOptions)}
                                </Form.Group>

                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Product Type</Form.Label>
                                    <Controller
                                        name="menuType"
                                        control={control}
                                        render={({field: {value, onChange, ref}}) => (
                                            <Select options={menuTypeOptions}
                                                    value={value}
                                                    onChange={onChange}
                                            />
                                        )}
                                    />
                                    {errorMessage(optionsError.menuTypeOptions)}
                                </Form.Group>

                                <Form.Group className="mb-3 col-md-12" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Allergy Info</Form.Label>
                                    <Form.Control as="textarea"
                                                  {...register("allergyInfo", menuValidation.allergyInfo)}
                                                  rows={3}
                                    />
                                    {errorMessage(errors.allergyInfo?.message!)}
                                </Form.Group>

                                <div className="custom-file col-md-12">
                                    <input
                                        type="file" {...register('productPicture', isAddMode ? menuValidation.productPicture : {})}
                                        className="custom-file-input" id="inputGroupFile01"/>
                                    <label className="custom-file-label"
                                           htmlFor="inputGroupFile01">{watch("productPicture") ? watch("productPicture")[0]?.name : "ProductSection Image"}</label>
                                </div>
                                {/*@ts-ignore*/}
                                {errorMessage(errors.productPicture?.message)}

                                <button type="submit"
                                        className={'btn btn-send btn-block px-4 mt-4'}>{!isAddMode ? "Update" : "Create"} Product
                                </button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default CreateProduct;
