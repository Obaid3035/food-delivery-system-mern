import React from 'react'
import {GiHamburgerMenu} from "react-icons/gi";
import {AiOutlineCloseCircle} from "react-icons/ai";
import {NavLink, useNavigate} from "react-router-dom";
import Logo from "../../../../assets/img/logo.png";
import jwt from "jwt-decode"
import {IUser} from "../../../../interface";
import {USER_ROLE} from "../../../../App";
import {successNotify} from "../../../../utils/toast";
import "./Header.css";

const Header = () => {

    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const onLogOutHandler = () => {
        localStorage.clear();
        successNotify("Successfully logged out")
        navigate('/')
    }

    let navItem = (
        <React.Fragment>
            <NavLink to={'/login'}><button className={'btn btn-main mr-1'}> Customer login/signup </button> </NavLink>
            <NavLink to={'/vendor/login'}> <button className={'btn btn-main ml-1'}> Partner login/signup </button> </NavLink>
        </React.Fragment>
    )

    if (token) {
        const decode: { user: IUser } = jwt(token);

        switch (decode.user.role) {
            case USER_ROLE.VENDOR:
                if (!decode.user.profileSetup) {
                    navItem = (
                        <React.Fragment>
                            <NavLink to={'/vendor/shop'}><button className={'btn btn-main mr-1'}> Create your shop </button> </NavLink>
                            <button className={'btn btn-main'} onClick={onLogOutHandler}> Log Out </button>
                        </React.Fragment>
                    )
                } else if (!decode.user.subscriptionSetup && decode.user.profileSetup) {
                    navItem = (
                        <React.Fragment>
                            <NavLink to={'/vendor/create-subscription'}><button className={'btn btn-main mr-1'}> Subscribe </button> </NavLink>
                            <button className={'btn btn-main'} onClick={onLogOutHandler}> Log Out </button>
                        </React.Fragment>
                    )
                } else {
                    navItem = (
                        <React.Fragment>
                            <NavLink to={'/vendor/dashboard'}><button className={'btn btn-main mr-1'}> Go to Dashboard </button> </NavLink>
                            <button className={'btn btn-main'} onClick={onLogOutHandler}> Log Out </button>
                        </React.Fragment>
                    )
                }
                break;

            case USER_ROLE.ADMIN:
                navItem = (
                    <React.Fragment>
                        <NavLink to={'/admin/dashboard'}><button className={'btn btn-main mr-1'}> Go to Dashboard </button> </NavLink>
                        <button className={'btn btn-main'} onClick={onLogOutHandler}> Log Out </button>
                    </React.Fragment>
                )

                break;

            case USER_ROLE.CUSTOMER:
                navItem =  (
                    <React.Fragment>
                        <NavLink to={'/orders'}><button className={'btn btn-main'}> Orders </button> </NavLink>
                        <button className={'btn btn-main'} onClick={onLogOutHandler}> Log Out</button>
                    </React.Fragment>
                )
                break;
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12 col-lg-12">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 mt-5 mb-3">
                                <div id="myNav" className="overlay">
                                    <a href=".." className="closeBtn" ><AiOutlineCloseCircle style={{ fontSize: "30px" }} /></a>
                                    <div className="overlay-content">
                                        <NavLink to="/" ><li>Home</li> </NavLink>
                                        <NavLink to="/about"><li>About</li> </NavLink>
                                        <NavLink to="/policies"><li>Policies</li> </NavLink>
                                    </div>
                                </div>
                                <span style={{ fontSize: '30px', cursor: 'pointer', color: "#FF4200" }}><GiHamburgerMenu /></span>
                            </div>
                            <div className="col-md-6 mt-5 mb-3 d-flex justify-content-around">
                                { navItem}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 logo-sec text-center">
                    <NavLink to="/" className="navbar-brand active">
                        <img src={Logo} className="logo_img" alt="logo" /> </NavLink>
                </div>
            </div>
        </div>
    )
}
export default Header;
