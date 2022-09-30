import React from 'react';
import {errorNotify} from "../../utils/toast";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import jwt from "jwt-decode"
import {IUser} from "../../interface";
import axios from "axios";
import {USER_ROLE} from "../../App";

interface IPrivateRouteProps {
    children: JSX.Element,
    role: string
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({children, role}) => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate()
    if (!token) {
        errorNotify("You are not authorize")
        return <Navigate to={'/'}/>
    }
    const decode: { user: IUser } = jwt(token);
    if (decode.user.role !== role) {
        errorNotify("You are not authorize")
        return <Navigate to={'/'}/>
    }


    if (decode.user.role === USER_ROLE.VENDOR) {
        if (location.pathname === "/vendor/shop") {
            if (decode.user.profileSetup) {
                errorNotify("You are not authorize")
                return <Navigate to={'/'}/>
            }
        } else {
            if (!decode.user.profileSetup) {
                errorNotify("You are not authorize")
                return <Navigate to={'/'}/>
            }
        }
        if (location.pathname === "/vendor/create-subscription") {
            if (decode.user.profileSetup && decode.user.subscriptionSetup) {
                errorNotify("You are not authorize")
                return <Navigate to={'/'}/>
            }
        } else {
            if (decode.user.profileSetup && !decode.user.subscriptionSetup) {
                errorNotify("You are not authorize")
                return <Navigate to={'/'}/>
            }
        }
    }



    axios.get(`/auth/authorize/${token}`)
        .catch((err) => {
            if (err) {
                errorNotify("You are not authorize")
                navigate("/")
            }
        })
    return children
};

export default PrivateRoute;
