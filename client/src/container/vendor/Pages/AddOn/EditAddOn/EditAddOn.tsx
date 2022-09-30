import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import "../AddOn.css";
import { Form, Row, Col } from "react-bootstrap";

const EditAddOn = () => {
    const navigate = useNavigate();

    const backAddOn = () => {
        navigate('/vendor/add-on')
    }

    return (
        <div className='page_responsive'>
            <div className='d-flex justify-content-between'>
                <h2>Edit AddOn</h2>
                <button className={'btn-send px-4 mr-2 mb-4'} onClick={backAddOn}>Back</button>
            </div>


            <Form>
                <Form.Label >Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder='Enter Title'
                />
                <br />

                <Row >
                    <Col md={5}>
                        <Form.Label >Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Enter Name'
                        />
                    </Col>

                    <Col md={5}>
                        <Form.Label >Price</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Enter Price'
                        />
                    </Col>

                    <Col md={2} className={'d-flex align-items-center'}>
                        <AiOutlinePlusCircle className='add_on_plus_icon' />
                    </Col>
                </Row>
                <div className={'addOn_data'}>
                    <p> <span> No. </span> 1 </p>
                    <p> <span> Name: </span> Drink</p>
                    <p> <span>  Price: </span> 2</p>
                    <i className="zmdi zmdi-close-circle"  />
                    <AiOutlineCloseCircle className='add_on_plus_icon' />
                </div>

                <div className={'text-center'}>
                    <button type={'submit'} className={'px-5 mt-3 btn btn-send btn-block'}>Add</button>
                </div>
            </Form>
        </div>
    )
};

export default EditAddOn;
