import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {getTokenFormat} from "../../../../../lib/helper";
import {useForm} from "react-hook-form";
import Loader from "../../../../../components/Loader/Loader";
import {successNotify} from "../../../../../utils/toast";
import {errorMessage} from "../../../../../App";
import {Form, FormControl, FormGroup} from "react-bootstrap";
import { menuTypeValidation} from "../../../../../lib/validation";
import {useCreateMenuType, useEditMenuType} from "../../../../../hooks/vendor/shop";

export interface IMenuType{
    _id: string,
    title: string,
}

const CreateMenuType = () => {
    const navigate = useNavigate();
    const { id} = useParams()
    const isAddMode = !id;

    useEffect(() => {
        if (!isAddMode) {
            axios.get(`/vendor/menu-types/${id}`, getTokenFormat())
                .then((res) => {
                    setValue("title", res.data.title);
                })
        }
    }, []);

    const {mutate: createMenuType, isSuccess: isCreateSuccess, isLoading: isCreateLoading, isError: isCreateError, error: createError, data: createRes} = useCreateMenuType();

    const {mutate: editMenuType, isSuccess: isEditSuccess, isLoading: isEditLoading, isError: isEditError, error: editError, data: editRes} = useEditMenuType(id!);


    const { register, handleSubmit, setValue, formState: { errors } } = useForm<IMenuType>();

    const menuTypeDataSubmit = handleSubmit((data) => {
        if (!isAddMode) {
            editMenuType(data)
        } else {
            createMenuType(data)
        }
    });

    if (isCreateLoading || isEditLoading) {
        return <Loader/>
    }

    if (isCreateSuccess) {
        successNotify(createRes.data.message)
        navigate("/vendor/product-type")
    }
    if (isEditSuccess) {
        successNotify(editRes.data.message)
        navigate("/vendor/product-type")
    }


    return (
        <div className={'page_responsive'}>
            <div className='d-flex justify-content-between'>
                { isCreateError ? errorMessage(createError?.response.data.message!) : ""}
                { isEditError ? errorMessage(editError?.response.data.message!) : ""}
                <h2>{isAddMode ? "Create" : "Update"} Menu Type</h2>
                <button className={'btn-send px-4 mr-2 mb-4'} onClick={() =>  navigate('/vendor/menu-type')}>Back</button>
            </div>
            <div className={'mt-5'}>
                <Form onSubmit={menuTypeDataSubmit}>
                    <FormGroup>
                        <FormControl
                            {...register("title", menuTypeValidation.title)}
                            placeholder={'Enter a Menu Type title'}
                        />
                        { errorMessage(errors.title?.message!)}
                    </FormGroup>

                    <button type="submit" className={'btn btn-send btn-block px-4 mt-3'}>{isAddMode ? "Create": "Update"} Menu Type</button>
                </Form>
            </div>
        </div>

    );
};

export default CreateMenuType;
