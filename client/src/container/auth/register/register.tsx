import React, {useEffect, useState} from 'react';
import Env from "../../../assets/img/env.png";
import User from "../../../assets/img/user.png";
import Lock from "../../../assets/img/lock.png";
import Phone from "../../../assets/img/phone.png";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {authValidation, shopCreateValidation} from "../../../lib/validation";
import { useRegister } from "../../../hooks/vendor/auth";
import "./register.css";
import {IAuthInput, IUser} from "../../../interface";
import Loader from "../../../components/Loader/Loader";
import {USER_ROLE} from "../../../App";
import { useLocation } from "react-router-dom";
import {LoginType} from "../login/login";
import jwt from "jwt-decode"

export enum RegisterType {
    customer = '/register',
    vendor = "/vendor/register",
    admin = "/admin/register"
}

const Register = () => {
    const location = useLocation()
    const navigate = useNavigate();

    const [registerType, setRegisterType] = useState("")

    const {register, handleSubmit, setValue, formState: {errors}} = useForm<IAuthInput>({
        defaultValues: {
            phoneNumber: "+44"
        }
    });

    useEffect(() => {
        switch (location.pathname) {
            case RegisterType.customer:
                setValue("role", USER_ROLE.CUSTOMER)
                setRegisterType(RegisterType.customer)
                break;
            case RegisterType.vendor:
                setValue("role", USER_ROLE.VENDOR)
                setRegisterType(RegisterType.vendor)
                break;
        }
    }, [])


    const {mutate, isSuccess, isLoading, isError, error, data: res} = useRegister()

    const registerSubmit = handleSubmit((data) => {
        mutate(data)
    });

    if (isLoading) {
        return <Loader/>
    }

    if (isSuccess) {
        localStorage.setItem("token", res.data.token)
        const decode: { user: IUser } = jwt(res.data.token);
        switch (registerType) {
            case RegisterType.vendor:
                if (decode.user.profileSetup) {
                    navigate('/vendor/dashboard')
                } else {
                    navigate('/vendor/shop')
                }
                break;
            case RegisterType.customer:
                navigate('/')
                break;
        }
    }

    const toLoginHandler = () => {
        switch (registerType) {
            case RegisterType.customer:
                navigate(LoginType.customer)
                break;
            case RegisterType.vendor:
                navigate(LoginType.vendor)
                break;
        }
    }


    return (
        <section className=" py-5 sign-up-section sign-in">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 sign-card">
                        <div className="card sign-up-card rounded shadow border-0 bg-white">
                            <div className="card-body text-center">
                                <small className={"text-danger"}>{isError ? error?.response.data.message : ""}</small>
                                <h2> REGISTRATION </h2>
                                <form className="mt-5" onSubmit={registerSubmit}>
                                    <div className="container form-row justify-content-center">
                                        <div className={errors.name ? "col-md-12 mb-2" : "col-md-12 mb-4"}>
                                            <label>Full Name</label>
                                            <img src={User} className="img-form" alt={'user'}/>
                                            <input type="text"
                                                   className={errors.name ? "form-control sign_in_error" : "form-control sign_in"}
                                                   placeholder="Enter Your Name"
                                                   {...register("name", authValidation.name)}
                                            />
                                        </div>
                                        <small className={"text-danger"}>{errors.name?.message}</small>

                                        <div className={errors.email ? "col-md-12 mb-2" : "col-md-12 mb-4"}>
                                            <label>Email</label>
                                            <img src={Env} className="img-form" alt={'env'}/>
                                            <input type="text"
                                                   className={errors.email ? "form-control sign_in_error" : "form-control sign_in"}
                                                   placeholder="Enter Your Email"

                                                   {...register("email", authValidation.email)}
                                            />
                                        </div>
                                        <small className={"text-danger"}>{errors.email?.message}</small>

                                        <div className={errors.phoneNumber ? "col-md-12 mb-2" : "col-md-12 mb-4"}>
                                            <label>Phone</label>
                                            <img src={Phone} className="img-form" alt={'phone'}/>
                                            <input type="text"
                                                   className={errors.phoneNumber ? "form-control sign_in_error" : "form-control sign_in"}
                                                   placeholder="Enter Your Phone Number"
                                                   {...register("phoneNumber", authValidation.phoneNumber)}
                                            />
                                        </div>
                                        <small className={"text-danger"}>{errors.phoneNumber?.message}</small>

                                        {
                                            registerType === RegisterType.customer ?
                                                <React.Fragment>
                                                    <div className={errors.address ? "col-md-12 mb-2" : "col-md-12 mb-4" }>
                                                        <label>Address</label>
                                                        <img src={Phone} className="img-form" alt={'address'} />
                                                        <input type="text"
                                                               className={errors.address ? "form-control sign_in_error" : "form-control sign_in"}
                                                               placeholder="Enter Your Address"
                                                               {...register("address", authValidation.address)}
                                                        />
                                                    </div>
                                                    <small className={"text-danger"}>{errors.address?.message}</small>

                                                    <div className={errors.postalCode ? "col-md-12 mb-2" : "col-md-12 mb-4" }>
                                                        <label>Postal Code</label>
                                                        <img src={Phone} className="img-form" alt={'phone'} />
                                                        <input type="text"
                                                               className={errors.postalCode ? "form-control sign_in_error" : "form-control sign_in"}
                                                               placeholder="Enter Your Postal Code"
                                                               {...register("postalCode", shopCreateValidation.postalCode)}
                                                        />
                                                    </div>
                                                    <small className={"text-danger"}>{errors.postalCode?.message}</small>

                                                </React.Fragment>
                                                : null
                                        }
                                        <div className={errors.password ? "col-md-12 mb-2" : "col-md-12 mb-4"}>
                                            <label>Password</label>
                                            <img src={Lock} className="img-form" alt={'lock'}/>
                                            <input type="password"
                                                   className={errors.password ? "form-control sign_in_error" : "form-control sign_in"}
                                                   placeholder="min 8 character"
                                                   {...register("password", authValidation.password)}
                                            />
                                        </div>
                                        <small className={"text-danger"}>{errors.password?.message}</small>

                                        <div className="col-md-10 my-4">
                                            <button type="submit" className="btn btn-send btn-block">REGISTER</button>
                                        </div>
                                    </div>
                                </form>
                                <div className={'customer__login__bottom-02 text-center p-4'}>
                                    <p>Already have an account?</p>
                                    <button onClick={toLoginHandler}
                                            className={'btn btn-send btn-block'}>Login
                                    </button>
                                </div>

                                <div>
                                    <p className='text-center'>or</p>
                                    <button onClick={() => navigate('/')} className="btn btn-send btn-block">Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register;

