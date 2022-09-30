import React from 'react';
import {Modal} from "react-bootstrap";
import * as BiIcons from 'react-icons/bi'
import './DisplayError.css';

const DisplayError = () => {

    const errorMessage = () => {
        return  'Unavailable at this time'
    }
    return (
        <Modal show={true} className={'error_modal mb-5'} centered>
            <Modal.Header className={'text-muted header text-center w-100'}>
                <BiIcons.BiErrorAlt className={'error_icon w-100'} />
            </Modal.Header>
            <Modal.Body className={'text-center'}>
                <h3>Ooops!</h3>
                <p>{ errorMessage() }!</p>
                <button className="brand-btn px-3 py-2" onClick={() => window.location.reload()}>Reload</button>
            </Modal.Body>
        </Modal>
    )
};

export default DisplayError;
