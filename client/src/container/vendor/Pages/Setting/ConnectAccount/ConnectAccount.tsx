import React, {useEffect} from 'react';
import './ConnectAccount.css';
import {Col, Row} from "react-bootstrap";
import axios from "axios";
import {getTokenFormat} from "../../../../../lib/helper";
import {errorNotify} from "../../../../../utils/toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../../components/Loader/Loader";

const ConnectAccount = () => {
    const navigation = useNavigate();
    const [loader, setLoader] = React.useState(false);
    useEffect(() => {
        axios.post("/vendor/account", {}, getTokenFormat())
            .then((res) => {
                setLoader(true);
                window.location.href = res.data.url
            })
            .catch((err) => {
                setLoader(true);
                errorNotify("Account cannot be setup right now");
                navigation("/vendor/setting");
            })
    }, [])

    if (loader) {
        return <Loader/>
    }

    return (
        <Row className={"justify-content-center align-items-center connect_account"}>
            <Col md={12} className={"w-100 text-center"}>
                <h4>
                    Please Wait While we are processing your request
                </h4>
            </Col>
        </Row>
    );
};

export default ConnectAccount;
