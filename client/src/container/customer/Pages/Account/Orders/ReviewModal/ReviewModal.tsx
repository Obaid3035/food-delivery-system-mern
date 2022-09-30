import React, {useEffect, useState} from 'react';
import {Col, Form, Modal, ModalBody, Row} from "react-bootstrap";
import {AiFillCloseCircle} from "react-icons/ai";
import Rating from "react-rating"
import {useCreateReview} from "../../../../../../hooks/customer/shop";
import Loader from "../../../../../../components/Loader/Loader";
import {successNotify} from "../../../../../../utils/toast";

interface IAddressModal {
    show: boolean,
    onModalChange: () => void,
    shopId: string,
    orderId: string
}

const ReviewModal: React.FC<IAddressModal> = ({ show, onModalChange, shopId, orderId}) => {

    const [rating, setRating] = useState(2);
    const [comment, setComment] = useState("");

    const { mutate, isSuccess, isLoading, data: res } = useCreateReview(orderId);

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            rating,
            comment,
            shop: shopId
        }
        mutate(formData)
    }

    useEffect(() => {
        if (isSuccess) {
            successNotify(res.data.message)
            setRating(0);
            setComment("")
            onModalChange()
        }
    }, [isSuccess])

    if (isLoading) {
        return <Loader/>
    }

    return (
        <Modal show={show} size={'lg'} id={'service__modal'}>
            <Modal.Header className="d-flex justify-content-between align-items-center review_header">
                <h5 className={"m-0"}> Review </h5>
                <AiFillCloseCircle onClick={onModalChange} className={"m-0 close_modal"}/>
            </Modal.Header>
            <ModalBody className={'px-5'}>
                <Row className={'mt-4'}>
                    <Col className={'appointment__model'}>
                        <h3 className={'text-center '}>Write a Review</h3>
                    </Col>
                </Row>
                <Form onSubmit={onFormSubmit}>
                    <div className="text-center d-flex justify-content-center">
                         <Rating
                             onChange={(value) => setRating(value)}
                             initialRating={rating}
                         />
                    </div>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label className={'comment-head'} >COMMENTS</Form.Label>
                        <Form.Control as="textarea" rows={3}
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      required
                                      className={'comment'} />
                    </Form.Group>
                    <button type={"submit"} className={"btn-send"}>Save</button>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default ReviewModal;
