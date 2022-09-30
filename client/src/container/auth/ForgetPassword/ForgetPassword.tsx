import React, {useState} from 'react';
import {Col, Container, Form, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import axios from "axios";
import Paper from '@material-ui/core/Paper';
import {authValidation} from "../../../lib/validation";
import {IAuthInput} from "../../../interface";
import Loader from "../../../components/Loader/Loader";
import {errorNotify, successNotify} from "../../../utils/toast";

const ForgetPassword = () => {
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm<IAuthInput>();

    const onFormSubmit = handleSubmit((data) => {
        setLoading(true)
        const {email} = data;

        axios.post('/auth/reset-link', {email})
            .then((res) => {
                setLoading(false)
                successNotify(res.data.message);
            }).catch((err) => {
            setLoading(false);
            errorNotify(err?.response.data.message);
        })
    })

    if (loading) {
        return <Loader/>
    }


    return (
        <div className={' h-100 justify-content-center align-items-center'}>
            <Container className={'h-100 text-center'}>
                <Row style={{height: "100vh"}} className={' align-items-center justify-content-center'}>
                    <Col md={8}>
                        <Form onSubmit={onFormSubmit}>
                            <Paper elevation={3}>
                                <Row className={' justify-content-center text-center p-4'}>
                                    <Col md={8}>
                                        <div>
                                            <Form.Control type={'email'} placeholder={'Enter your email for recovery '}
                                                          required={true}
                                                          className={'recovery__email py-4'} {...register('email', authValidation.email)} />
                                        </div>
                                        <small className={"text-danger"}>{errors.name?.message}</small>
                                    </Col>

                                    <Col md={8}>
                                        <div className={' text-center mt-3 '}>
                                            <button type="submit" className={'btn-send'}>Recover your Password</button>
                                        </div>
                                    </Col>
                                </Row>
                            </Paper>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ForgetPassword;
