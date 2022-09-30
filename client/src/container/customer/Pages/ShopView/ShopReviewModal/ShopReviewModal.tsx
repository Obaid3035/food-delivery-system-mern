import React, {useState} from 'react';
import {Modal, Spinner} from "react-bootstrap";
import {AiFillCloseCircle} from "react-icons/ai"
import './ShopReviewModal.css'
import RatingStar from "../../../../../components/RatingStar/RatingStar";
import {IReview} from "../../../../../interface";
import Pagination from "../../../../../components/Pagination/Pagination";
import {useGetAllReviews} from "../../../../../hooks/customer/shop";
import {PAGINATION_LIMIT} from "../../../../../lib/helper";

interface IShopReviewModal {
    show: boolean
    onModalChange: () => void,
    slug: string
}

const ShopReviewModal: React.FC<IShopReviewModal> = ({show, onModalChange, slug}) => {
    const [page, setPage] = useState(0);

    const {isLoading, isError, data: res, isSuccess} = useGetAllReviews(page, slug)

    let data;

    if (isLoading) {
        data = (
            <div className="text-center">
                <Spinner animation={"border"}/>
            </div>
        )
    }

    if (isSuccess) {
        const totalPage = Math.ceil(res.data.reviewsCount / PAGINATION_LIMIT)

        data = (
            <React.Fragment>
                {
                    res.data.reviews.map((review: any) => (
                        <div className={'container modal_body'}>
                            <h5>{review.customer.name}</h5>
                            <RatingStar avgRating={review.rating}/>
                            <p className={"m-0 mt-2"}>{review.comment}</p>
                            <hr/>
                        </div>
                    ))
                }
                <Pagination page={page} setPage={setPage} totalPage={totalPage}/>
            </React.Fragment>
        )
    }

    return (
        <Modal show={show} size={'lg'} className={'h-100 w-100 review_modal'}>
            <Modal.Header className="d-flex justify-content-between align-items-center review_header">
                <h5 className={"m-0"}> Reviews </h5>
                <AiFillCloseCircle onClick={onModalChange} className={"m-0 close_modal"}/>
            </Modal.Header>
            <Modal.Body>
                { data }
            </Modal.Body>
        </Modal>
    );
};

export default ShopReviewModal;
