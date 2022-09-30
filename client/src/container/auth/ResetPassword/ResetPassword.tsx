import React, { useState, useEffect } from "react";
import {  Form, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import Paper from '@material-ui/core/Paper';
import Loader from "../../../components/Loader/Loader";
import {errorNotify} from "../../../utils/toast";
import { useParams } from "react-router-dom"
import {authValidation} from "../../../lib/validation";

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const { id } = useParams()

    useEffect(() => {
        axios.get(`/auth/authorize/${id}`)
            .then((res) => {
                if (!res.data.authenticate) {
                    window.location.href = '/'
                }
            })
            .catch((err) => {
                errorNotify("Session Expired")
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmit = handleSubmit((data) => {
        setLoading(true);
        if (data.newPassword !== data.confirmPassword) {
            errorNotify("Password does not match")
            setLoading(false)
        } else {
            axios.put(`/auth/reset-password`, { password: data.newPassword },
                { headers: { "Authorization": `Bearer ${id}` } })
                .then((res) => {
                    window.location.href = '/'
                }).catch((err) => {
                setLoading(false)
                errorNotify("Session Expired")
            })
        }
    })

    if (loading) {
        return <Loader/>
    }


    return (
        <div className={' h-100 justify-content-center align-items-center'}>
            <Container className={'h-100 text-center'}>
                <Row style={{ height: "100vh" }} className={' align-items-center justify-content-center'}>
                    <Col md={8}>

                        <Form onSubmit={onSubmit}>
                            <Paper elevation={3} >
                                <Row className={' justify-content-center text-center p-4'}>

                                    <Col md={8}>
                                        <div >
                                            <Form.Control type={'password'}
                                                          placeholder={'New Password'}
                                                          {...register('newPassword', authValidation.password)} className={'recovery__email py-4'} />
                                        </div>
                                        <small className="text-danger" style={{ fontSize: "10px" }}>
                                            {errors.newPassword && errors.newPassword.message}
                                        </small>
                                    </Col>

                                    <Col md={8}>
                                        <div >
                                            <Form.Control
                                                type={'password'}
                                                placeholder={'Confirm Password'}
                                                {...register('confirmPassword', authValidation.password)}
                                                className={'recovery__email py-4'}
                                            />
                                        </div>
                                        <small className="text-danger" style={{ fontSize: "10px" }}>
                                            {errors.password && errors.password.message}
                                        </small>
                                    </Col>

                                    <Col md={8}>
                                        <div className="text-center">
                                            <button type={'submit'} className={'btn-send w-75'} >Reset Password</button>
                                        </div>
                                    </Col>
                                </Row>
                            </Paper>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ResetPassword
