import React from 'react';
import {Modal} from "react-bootstrap";
import {AiFillCloseCircle} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface IAuthModal {
    show: boolean,
    handleChange: () => void
}

const AuthModal: React.FC<IAuthModal> = ({ show, handleChange }) => {
    const navigation = useNavigate();
    return (
        <Modal show={show} className={'h-100 w-100'} >
            <Modal.Header className="d-flex justify-content-between align-items-center review_header">
                <h5 className={"m-0"}> Reviews </h5>
                <AiFillCloseCircle onClick={handleChange} className={"m-0 close_modal"}/>
            </Modal.Header>
            <Modal.Body>
                <div className={'mb-5'}>
                    <h5>Have An Account?</h5>
                    <button onClick={() => navigation("/login")} className="btn btn-send btn-block">LOGIN</button>
                </div>
                <div>
                    <h5>Don't Have An Account?</h5>
                    <button onClick={() => navigation("/register")} className={'btn btn-send btn-block'}>Fast Sign Up</button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AuthModal;
