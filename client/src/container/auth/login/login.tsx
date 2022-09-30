import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import Lock from "../../../assets/img/lock.png";
import "./login.css";
import {useForm} from "react-hook-form";
import {authValidation} from "../../../lib/validation";
import Env from "../../../assets/img/env.png";
import {useLogin} from "../../../hooks/vendor/auth";
import {IAuthInput, IUser} from "../../../interface";
import Loader from "../../../components/Loader/Loader";
import {USER_ROLE} from "../../../App";
import jwt from "jwt-decode"
import {RegisterType} from "../register/register";
import {successNotify} from "../../../utils/toast";

export enum LoginType {
    customer = '/login',
    vendor = "/vendor/login",
    admin = "/admin/login"
}

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const [loginType, setLoginType] = useState("")

    const {register, handleSubmit, setValue, formState: {errors}} = useForm<IAuthInput>();

    useEffect(() => {
        switch (location.pathname) {
            case LoginType.customer:
                setValue("role", USER_ROLE.CUSTOMER)
                setLoginType(LoginType.customer)
                break;
            case LoginType.vendor:
                setValue("role", USER_ROLE.VENDOR)
                setLoginType(LoginType.vendor)
                break;

            case LoginType.admin:
                setValue("role", USER_ROLE.ADMIN)
                setLoginType(LoginType.admin)
                break;
        }
    }, [])


    const {mutate, isSuccess, isLoading, isError, error, data: res} = useLogin()


    const loginDataSubmit = handleSubmit((data) => {
        mutate(data)
    });

    if (isLoading) {
        return <Loader/>
    }

    if (isSuccess) {
        localStorage.setItem("token", res.data.token)
        const decode: { user: IUser } = jwt(res.data.token);
        switch (loginType) {
            case LoginType.vendor:
                if (decode.user.profileSetup && decode.user.subscriptionSetup) {
                    navigate('/vendor/dashboard')
                } else if (!decode.user.subscriptionSetup && decode.user.profileSetup) {
                    navigate('/vendor/create-subscription')
                } else {
                    navigate('/vendor/shop')
                }
                break;
            case LoginType.customer:
                navigate('/')
                break;

            case LoginType.admin:
                navigate('/admin/dashboard')
                successNotify("Successfully Logged In!")
        }
    }

    const toRegisterHandler = () => {
        switch (loginType) {
            case LoginType.customer:
                navigate(RegisterType.customer)
                break
            case LoginType.vendor:
                navigate(RegisterType.vendor)
                break
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
                                <h2 style={{
                                    fontWeight: "bold",
                                    fontSize: "23px"
                                }}
                                >LOGIN</h2>
                                <Form className="mt-5" onSubmit={loginDataSubmit}>
                                    <div className=" form-row justify-content-center">
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
                                            <button type={'submit'} className="btn btn-send btn-block">LOGIN</button>
                                        </div>
                                    </div>
                                </Form>
                                <NavLink to="/forgetPassword"><p className='forgetPassword_btn'> Forget Password ? </p>
                                </NavLink>

                                {
                                    loginType !== LoginType.admin ?
                                        (
                                            <div className={'customer__login__bottom-02 text-center p-4'}>
                                                <p>Don't have account?</p>
                                                <button onClick={toRegisterHandler}
                                                        className="btn btn-send btn-block">REGISTER NOW
                                                </button>
                                            </div>
                                        ) : null
                                }


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
    );
};
export default Login;
