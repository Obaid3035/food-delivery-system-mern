import {IController, IRequest} from '../../interface';
import {Router, Request, Response, NextFunction} from 'express';
import auth from '../../middleware/auth';
import {Container} from 'typedi';
import ProductService from '../../service/vendor/ProductService';
import {USER_ROLE} from '../../model/user';
import upload from '../../middleware/multer';

class ProductController implements IController {
    path = '/vendor/products';
    router = Router();

    constructor() {
        this.router
            .get(`${this.path}`, auth(USER_ROLE.VENDOR), this.index)
            .get(`${this.path}/:id`, auth(USER_ROLE.VENDOR), this.show)
            .get(`${this.path}-options`, auth(USER_ROLE.VENDOR), this.getMenuOptions)
            .post(
                `${this.path}`,
                auth(USER_ROLE.VENDOR),
                upload.single('productPicture'),
                this.create
            )
            .put(
                `${this.path}/:id`,
                auth(USER_ROLE.VENDOR),
                upload.single('productPicture'),
                this.update
            )
            .delete(`${this.path}/:id`, auth(USER_ROLE.VENDOR), this.delete);
    }

    private index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const productServiceInstance = await Container.get(ProductService);
            const {product, productCount} = await productServiceInstance.index(shopId.toString());
            res.status(200).json({
                data: product,
                count: productCount
            });
        } catch (e) {
            next(e);
        }
    };

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const productServiceInstance = await Container.get(ProductService);
            const {message} = await productServiceInstance.create(
                req.body,
                shopId.toString(),
                req.file.path
            );
            res.status(201).json({
                message,
            });
        } catch (e) {
            next(e);
        }
    };

    private show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.id;
            const productServiceInstance = await Container.get(ProductService);
            const product = await productServiceInstance.show(productId);
            res.status(200).json(product)
        } catch (e) {
            next(e);
        }
    }

    private getMenuOptions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const productServiceInstance = await Container.get(ProductService);
            const { category, menuType, addOn} = await productServiceInstance.getMenuOptions(shopId.toString());
            res.status(200).json({
                category,
                menuType,
                addOn
            })
        } catch (e) {
            next(e);
        }
    }

    private update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const productId = req.params.id;
            const productServiceInstance = await Container.get(ProductService);
            const {message} = await productServiceInstance.update(
                req.body,
                productId,
                req.file,
                shopId.toString()
            );
            res.status(200).json({
                message,
            });
        } catch (e) {
            next(e);
        }
    };

    private delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.id;
            const productServiceInstance = await Container.get(ProductService);
            const {message} = await productServiceInstance.delete(productId)
            res.status(200).json({
                message,
            });
        } catch (e) {
            next(e);
        }
    }
}

export default ProductController;
