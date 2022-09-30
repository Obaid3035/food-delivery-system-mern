import React from 'react';
import {Modal} from "react-bootstrap";
import {AiFillCloseCircle} from "react-icons/ai";
import {IReview} from "../../../../../interface";
import {NavLink} from "react-router-dom";

interface IShopReviewModal {
    show: boolean
}

const ShopLocationErrorModal: React.FC<IShopReviewModal>  = ({ show }) => {
    return (
        <Modal show={show} centered={true} className={'h-100 w-100 review_modal'}>
            <Modal.Header className="d-flex justify-content-between align-items-center review_header">
                <h5 className={"m-0"}> Error </h5>
            </Modal.Header>
            <Modal.Body>
                <div className={'text-center'}>
                    <h5>This shop is not available in your area</h5>
                    <NavLink to={'/'}>
                        <button className={'btn-send'} >Go Back to Search</button>
                    </NavLink>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ShopLocationErrorModal;
