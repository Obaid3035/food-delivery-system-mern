import React from 'react';
import { Card, Col, Form, Row } from "react-bootstrap";
import GalleryImg from "../../../../assets/img/res1.jpg";
import BannerImg from "../../../../assets/img/res2.jpg"
import {
    useGetGallery,
    useUploadBannerImage,
    useUploadMainImage
} from "../../../../hooks/vendor/shop";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import {successNotify} from "../../../../utils/toast";
import {useForm} from "react-hook-form";

const Gallery = () => {


    const {data: res, isError, isSuccess, isLoading} = useGetGallery();
    const {mutate: uploadMainImage, isSuccess: isMainSuccess, reset:mainReset, isLoading: isMainLoading, isError: isMainError, data: mainRes} = useUploadMainImage();
    const {mutate: uploadBannerImage, isSuccess: isBannerSuccess, reset:bannerReset, isLoading: isBannerLoading, isError: isBannerError, data: bannerRes} = useUploadBannerImage();

    const { register: mainImageRegister, handleSubmit: mainImageSubmit, watch: mainImageWatch } = useForm<{  shopImage: [File]}>()
    const { register: bannerImageRegister, handleSubmit: bannerImageSubmit, watch: bannerImageWatch } = useForm<{shopBannerImage: [File],}>()


    const onGallerySubmit = mainImageSubmit((data) => {
        const formData = new FormData();
        formData.append("shopImage", data.shopImage[0])
        uploadMainImage(formData)
    });

    const onBannerSubmit = bannerImageSubmit((data) => {
        const formData = new FormData();
        formData.append("shopBannerImage", data.shopBannerImage[0])
        uploadBannerImage(formData)
    })


    if (isLoading || isMainLoading || isBannerLoading) {
        return <Loader/>
    }

    if (isError || isMainError || isBannerError) {
        return  <DisplayError/>
    }

    let mainImage = <img alt={'shopMain'} className={'img-fluid p-4'} src={GalleryImg} />

    let bannerImage = <img alt={'shopBanner'} className={'img-fluid p-4'} src={BannerImg} />

    if (isSuccess) {
        mainImage = <img alt={'shopMain'} className={'img-fluid p-4'} src={res.data.shopImage.avatar} />
        bannerImage = <img alt={'shopBanner'} className={'img-fluid p-4'} src={res.data.shopBannerImage.avatar} />
    }

    if (isMainSuccess) {
        successNotify(mainRes.data.message)
        mainReset()
    }

    if (isBannerSuccess) {
        successNotify(bannerRes.data.message)
        bannerReset()
    }


    return (
        <div className={'page_responsive'}>
            <Card>
                <Card.Header><h2>Restaurant Banner Image</h2></Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={12}>
                            <Form onSubmit={onBannerSubmit}>
                                <div className={'form-row align-items-center'}>
                                    <Col md={10}>
                                        <div className="input-group main__img_input">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Shop Banner Image</span>
                                            </div>
                                            <div className="custom-file">
                                                <input type="file" required {...bannerImageRegister('shopBannerImage')} className="custom-file-input" id="inputGroupFile01" />
                                                <label className="custom-file-label" htmlFor="inputGroupFile01">{bannerImageWatch("shopBannerImage") ? bannerImageWatch("shopBannerImage")[0]?.name : "Banner Image"}</label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className={'text-center'}>
                                            <button type={'submit'} className={'btn btn-send btn-block px-4'}>Upload</button>
                                        </div>
                                    </Col>
                                </div>
                            </Form>
                        </Col>
                        <Col md={12}>
                            <div className={'text-center'}>
                                { bannerImage }
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card className={'my-4'}>
                <Card.Header> <h2>Shop Main Image</h2> </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={12}>
                            <Form onSubmit={onGallerySubmit}>
                                <div className={'form-row align-items-center'}>
                                    <Col md={10}>
                                        <div className="input-group main__img_input">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Shop Main Image</span>
                                            </div>
                                            <div className="custom-file">
                                                <input type="file" required {...mainImageRegister('shopImage')} className="custom-file-input" id="inputGroupFile01" />
                                                <label className="custom-file-label" htmlFor="inputGroupFile01">{mainImageWatch("shopImage") ? mainImageWatch("shopImage")[0]?.name : "Main Image"}</label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className={'text-center'}>
                                            <button type={'submit'} className={'btn btn-send btn-block px-4'}>Upload</button>
                                        </div>
                                    </Col>
                                </div>
                            </Form>
                        </Col>
                        <Col md={12}>
                            <div className={'text-center'}>
                                { mainImage }
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};
export default Gallery;
