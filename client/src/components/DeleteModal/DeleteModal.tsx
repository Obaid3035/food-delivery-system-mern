import React from 'react';
import {Modal} from "react-bootstrap";
import './DeleteModal.css';

interface IDeleteModal {
    show: boolean,
    onSubmit: () => void,
    onClose: () => void
}

const DeleteModal: React.FC<IDeleteModal> = ({ show, onClose, onSubmit }) => {
    return (
        <Modal show={show} centered={true} className={'w-100 justify-content-center'}>
            <Modal.Header className={'text-muted d-flex align-items-center justify-content-between w-100'}>
                <Modal.Header>Are you sure you want to delete/cancel</Modal.Header>
            </Modal.Header>
            <Modal.Body className={"d-flex justify-content-center w-100"}>
                <button onClick={onSubmit} className={"yes_btn btn btn-success mr-2"}>Yes</button>
                <button onClick={onClose} className={"no_btn btn btn-danger ml-2"}>No</button>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteModal;
