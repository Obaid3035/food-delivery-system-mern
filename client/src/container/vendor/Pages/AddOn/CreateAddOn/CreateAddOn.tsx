import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { AiOutlinePlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { Form, Row } from "react-bootstrap";
import "./CreateAddOn.css";
import {errorNotify, successNotify} from "../../../../../utils/toast";
import {useCreateAddOn, useEditAddOn} from "../../../../../hooks/vendor/shop";
import Loader from "../../../../../components/Loader/Loader";
import axios from "axios";
import {getTokenFormat} from "../../../../../lib/helper";
import DisplayError from "../../../../../components/DisplayError/DisplayError";


export interface IAddOns {
    _id?: string,
    title: string,
    addOn: IAddOn[]
}

export interface IAddOn {
    _id?: string
    name: string,
    price: number
}


const CreateAddOn = () => {
    const navigate = useNavigate();
    const { id} = useParams()
    const isAddMode = !id;
    const [addOn, setAddOn] = useState<IAddOn[] | []>([]);
    const [title, setTitle] = useState("");
    const [addOnInput, setAddOnInput] = useState({
        name: '',
        price: 0
    });

    useEffect(() => {
        if (!isAddMode) {
            axios.get(`/vendor/add-on/${id}`, getTokenFormat())
                .then((res) => {
                    setTitle(res.data.title);
                    setAddOn(res.data.addOn);
                })
        }
    }, []);

    const {mutate: createAddOn, isSuccess: isCreateSuccess, isLoading: isCreateLoading, isError: isCreateError, data: createRes} = useCreateAddOn();

    const {mutate: editAddOn, isSuccess: isEditSuccess, isLoading: isEditLoading, isError: isEditError, data: editRes} = useEditAddOn(id!);



    const onAddHandler = () => {
        if (!(title.length > 0)) {
            errorNotify('Title is required')
        } else {
            if ((addOnInput.name.length === 0)) {
                errorNotify('Add on name is required')
            } else if (parseInt(String(addOnInput.price)) <= 0 ) {
                errorNotify('Add on price must be greater than zero')
            } else {
                let addOnClone = addOn.concat();
                let currentAddOn: IAddOn = {
                    name: addOnInput.name,
                    price: addOnInput.price
                }
                addOnClone.push(currentAddOn);
                setAddOn(addOnClone);
                setAddOnInput({
                    name: '',
                    price: 0
                })
            }
        }

    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddOnInput({
            ...addOnInput,
            [name]: value
        })
    }

    const onRemoveHandler = (index: number) => {
        let addOnClone = addOn.concat();
        if (addOnClone.length > 0) {
            addOnClone.splice(index, 1);
            setAddOn(addOnClone);
        }
    }

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (addOn.length > 0) {
            const formData = {
                title,
                addOn
            }
            if (isAddMode) {
                createAddOn(formData)
            } else {
                editAddOn(formData)
            }


        } else {
            errorNotify("Please add a add on")
        }
    }

    if (isCreateLoading || isEditLoading) {
        return <Loader/>
    }

    if (isCreateError || isEditError) {
        return <DisplayError/>
    }

    if (isEditSuccess) {
        successNotify(editRes.data.message)
        navigate("/vendor/add-on")
    }

    if (isCreateSuccess) {
        successNotify(createRes.data.message)
        navigate("/vendor/add-on")
    }

    return (
        <div className='page_responsive'>
            <div className='d-flex justify-content-between'>
                <h2>{!isAddMode ? "Update" : "Create"} AddOn</h2>
                <button className={'btn-send px-4 mr-2 mb-4'} onClick={() =>  navigate('/vendor/add-on')}>Back</button>
            </div>


            <Form onSubmit={onFormSubmit}>
                <Form.Label >Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder='Enter Title'
                    disabled={addOn.length > 0}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />

                <Row >
                        <Form.Group className={'col-md-6 animate__animated animate__fadeInDown'}>
                            <Form.Control    type="text"
                                             name={"name"}
                                             placeholder='Enter Name'
                                             value={addOnInput.name}
                                             onChange={onChangeHandler} />
                        </Form.Group>
                        <Form.Group className={'col-md-5 animate__animated animate__fadeInDown'}>
                            <Form.Control  type="number"
                                           name={"price"}
                                           placeholder='Enter Price'
                                           value={addOnInput.price}
                                           onChange={onChangeHandler}  />
                        </Form.Group>
                        <AiOutlinePlusCircle className='add_on_plus_icon mb-3' onClick={onAddHandler} />

                    {
                        addOn.length > 0 && addOn.map((item, index) => (
                            <React.Fragment key={index}>

                                <Form.Group className={'col-md-6 animate__animated animate__fadeInDown'}>
                                    <Form.Control type="text" name={'description'} disabled value={item && item.name}  />
                                </Form.Group>
                                <Form.Group className={'col-md-5 animate__animated animate__fadeInDown'}>
                                    <Form.Control type="number" name={'amount'} disabled  value={item && item.price}   />
                                </Form.Group>
                                <AiFillMinusCircle className='add_on_plus_icon'  onClick={() => onRemoveHandler(index)} />
                            </React.Fragment>
                        ))
                    }
                </Row>

                <div className={'text-center'}>
                    <button type={'submit'} className={'px-5 mt-3 btn btn-send btn-block'}>{!isAddMode ? "Edit" : "Add"}</button>
                </div>
            </Form>
        </div>
    )
};

export default CreateAddOn;
