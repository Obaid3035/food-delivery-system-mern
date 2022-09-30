import React from 'react';
import {Modal} from "react-bootstrap";
import {AiFillCloseCircle} from "react-icons/ai";

interface IAllergyModal {
    show: boolean,
    onModalChange: () => void,
    text: string
}

const AllergyModal: React.FC<IAllergyModal> = ({ show, onModalChange, text }) => {

    return (
        <Modal show={show}>
            <Modal.Header className="d-flex justify-content-between align-items-center review_header">
                <h5 className={"m-0"}> Allergy Information </h5>
                <AiFillCloseCircle onClick={onModalChange} className={"m-0 close_modal"}/>
            </Modal.Header>
            <Modal.Body>
                <div>
                    { text }
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AllergyModal;
