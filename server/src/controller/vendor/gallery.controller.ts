import {IController, IRequest} from "../../interface";
import {NextFunction, Request, Response, Router} from "express";
import auth from "../../middleware/auth";
import {USER_ROLE} from "../../model/user";
import {Container} from "typedi";
import GalleryService from "../../service/vendor/GalleryService";
import upload from "../../middleware/multer";

class GalleryController implements IController {
    path = '/vendor/gallery';
    router = Router();

    constructor() {
        this.router
            .get(`${this.path}`, auth(USER_ROLE.VENDOR), this.index)
        this.router
            .put(`${this.path}-main`,
                auth(USER_ROLE.VENDOR),
                upload.single('shopImage'),
                this.updateMainImage)

        this.router
            .put(`${this.path}-banner`,
                auth(USER_ROLE.VENDOR),
                upload.single('shopBannerImage'),
                this.uploadBannerImage)
    }

    private index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const galleryServiceInstance = Container.get(GalleryService);
            const shopImage = await galleryServiceInstance.index(shopId.toString())
            res.status(200).json(shopImage)
        } catch (e) {
            next(e);
        }
    }

    private updateMainImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const galleryServiceInstance = Container.get(GalleryService);
            const { message } = await galleryServiceInstance.updateMainImage(
                shopId.toString(),
                req.file.path
            )
            res.status(200).json({
                message
            })
        } catch (e) {
            next(e);
        }
    }

    private uploadBannerImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const galleryServiceInstance = Container.get(GalleryService);
            const { message } = await galleryServiceInstance.uploadBannerImage(
                shopId.toString(),
                req.file.path
            )
            res.status(200).json({
                message
            })
        } catch (e) {
            next(e);
        }
    }
}

export default GalleryController
