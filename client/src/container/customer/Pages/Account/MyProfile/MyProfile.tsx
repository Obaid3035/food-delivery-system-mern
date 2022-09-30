import React from "react";
import { useForm } from "react-hook-form";
import Env from "../../../../../assets/img/env.png";
import User from "../../../../../assets/img/user.png"
import Phone from "../../../../../assets/img/phone.png";
import Lock from "../../../../../assets/img/lock.png";

const Profile = () => {

    const { register, handleSubmit } = useForm();

    const handleFormSubmit = handleSubmit((data) => {

        if (data.CurrentPassword !== data.NewPassword) {

            if (data.NewPassword === data.ConfirmPassword) {

                const updatedPassword = {
                    currentPassword: data.CurrentPassword,
                    newPassword: data.NewPassword
                }
            }
            else {

            }
        }
        else {

        }

    })


    let formButton = <button type="submit" className={'btn-send w-50'} >Submit</button>

    return (
        <>
            <section className=" sign-up-section sign-in">
                <div className="container">
                    <div className="row">
                        <div className="col-8 sign-card">
                            <div>
                                <div className="card-body text-center ">
                                    <h5>MY PROFILE</h5>
                                    <hr className={'mb-5'} />
                                    <form className="mt-3" onSubmit={handleFormSubmit}>
                                        <div className="form-row justify-content-center">
                                            <div className="col-md-8 mb-4">
                                                <img src={User} className="img-form" alt={'user'} />
                                                <input type="text"
                                                    className="form-control"
                                                    disabled
                                                    value={'Hamza Mughal'}
                                                    placeholder="Type your Name" />
                                            </div>
                                            <div className="col-md-8 mb-4">
                                                <img src={Env} className="img-form" alt={'env'} />
                                                <input type="text"
                                                    className="form-control"
                                                    disabled
                                                    value={'hamza19mughal99@gmail.com'}
                                                    placeholder="Type your Email" />
                                            </div>
                                            <div className="col-md-8 mb-2">
                                                <img src={Phone} className="img-form" alt={'lock'} />
                                                <input type="number"
                                                    className="form-control"
                                                    disabled
                                                    value={'03492496204'}
                                                    placeholder="Type Your Mobile Number" />
                                            </div>

                                            <div className="col-md-8 mb-3">
                                                <img src={Lock} className="img-form" alt={'lock'} />
                                                <input type="password"
                                                    className="form-control"
                                                    {...register('CurrentPassword')}
                                                    placeholder="Type Current Password" />
                                            </div>

                                            <div className="col-md-8 mb-3">
                                                <img src={Lock} className="img-form" alt={'lock'} />
                                                <input type="password"
                                                    className="form-control"
                                                    {...register('NewPassword')}
                                                    placeholder="Type New Password" />
                                            </div>

                                            <div className="col-md-8 mb-3">
                                                <img src={Lock} className="img-form" alt={'lock'} />
                                                <input type="password"
                                                    className="form-control"
                                                    {...register('ConfirmPassword')}
                                                    placeholder="ReType New Password" />
                                            </div>
                                            <div className="col-md-8 mb-3">
                                                {formButton}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Profile;
