import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import {Form, FormControl, FormGroup} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { categoryValidation } from '../../../../../lib/validation';
import {errorMessage} from "../../../../../App";
import {useCreateCategory, useEditCategory} from "../../../../../hooks/vendor/shop";
import Loader from "../../../../../components/Loader/Loader";
import {successNotify} from "../../../../../utils/toast";
import { useParams } from "react-router-dom";
import axios from "axios";
import {getTokenFormat} from "../../../../../lib/helper";

export interface ICategory {
    _id?: string
    title: string,
}

const CreateCategory = () => {
    const navigate = useNavigate();
    const { id} = useParams()
    const isAddMode = !id;

    useEffect(() => {
        if (!isAddMode) {
            axios.get(`/vendor/category/${id}`, getTokenFormat())
                .then((res) => {
                    setValue("title", res.data.title);
                })
        }
    }, []);

    const {mutate: createCategory, isSuccess: isCreateSuccess, isLoading: isCreateLoading, isError: isCreateError, error: createError, data: createRes} = useCreateCategory();

    const {mutate: editCategory, isSuccess: isEditSuccess, isLoading: isEditLoading, isError: isEditError, error: editError, data: editRes} = useEditCategory(id!);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ICategory>();

    const categoryDataSubmit = handleSubmit((data) => {
        if (!isAddMode) {
            editCategory(data)
        } else {
            createCategory(data)
        }
    });

    if (isCreateLoading || isEditLoading) {
        return <Loader/>
    }

    if (isCreateSuccess) {
        successNotify(createRes.data.message)
        navigate("/vendor/category")
    }
    if (isEditSuccess) {
        successNotify(editRes.data.message)
        navigate("/vendor/category")
    }


    return (
        <div className={'page_responsive'}>
            <div className='d-flex justify-content-between'>
                { isCreateError ? errorMessage(createError?.response.data.message!) : ""}
                { isEditError ? errorMessage(editError?.response.data.message!) : ""}
                <h2>{isAddMode ? "Create" : "Update"} Category</h2>
                <button className={'btn-send px-4 mr-2 mb-4'} onClick={() =>  navigate('/vendor/category')}>Back</button>
            </div>
            <div className={'mt-5'}>
                <Form onSubmit={categoryDataSubmit}>
                    <FormGroup>
                        <FormControl
                            {...register("title", categoryValidation.title)}
                            placeholder={'Enter a Category Name'}
                        />
                        { errorMessage(errors.title?.message!)}
                    </FormGroup>

                    <button type="submit" className={'btn btn-send btn-block px-4 mt-3'}>{isAddMode ? "Create": "Update"} Category</button>
                </Form>
            </div>
        </div>
    );
};

export default CreateCategory;
