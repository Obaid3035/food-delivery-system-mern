import {IController, IRequest} from '../../interface';
import {NextFunction, Request, Response, Router} from 'express';
import auth from '../../middleware/auth';
import {USER_ROLE} from '../../model/user';
import {Container} from 'typedi';
import CategoryService from '../../service/vendor/CategoryService';

class CategoryController implements IController {
    path = '/vendor/category';
    router = Router();

    constructor() {
        this.router
            .get(`${this.path}`, auth(USER_ROLE.VENDOR), this.index)
            .post(`${this.path}`, auth(USER_ROLE.VENDOR), this.create)
            .get(`${this.path}/:id`, auth(USER_ROLE.VENDOR), this.show)
            .put(`${this.path}/:id`, auth(USER_ROLE.VENDOR), this.update)
            .delete(`${this.path}/:id`, auth(USER_ROLE.VENDOR), this.delete);
    }

    private index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const categoryServiceInstance = Container.get(CategoryService);
            const { formattedCategory, categoryCount} = await categoryServiceInstance.index(
                shopId.toString(),
                skip,
                limit
            );
            res.status(200).json({
                data: formattedCategory,
                count: categoryCount
            });
        } catch (e) {
            next(e);
        }
    };

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const categoryServiceInstance = Container.get(CategoryService);
            const {message} = await categoryServiceInstance.create(
                req.body,
                shopId.toString()
            );
            res.status(200).json({
                message,
            });
        } catch (e) {
            next(e);
        }
    };

    private show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.id;
            const categoryServiceInstance = Container.get(CategoryService);
            const category = await categoryServiceInstance.show(categoryId);
            res.status(200).json(category);
        } catch (e) {
            next(e);
        }
    };

    private update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.id;
            const categoryServiceInstance = Container.get(CategoryService);
            const {message} = await categoryServiceInstance.update(
                req.body,
                categoryId
            );
            res.status(200).json({
                message
            });
        } catch (e) {
            next(e);
        }
    };

    private delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.id;
            const shopId = (<IRequest>req).user.shop;
            const categoryServiceInstance = Container.get(CategoryService);
            const {message} = await categoryServiceInstance.delete(
                categoryId,
                shopId.toString()
            );
            res.status(200).json({
                message,
            });
        } catch (e) {
            next(e);
        }
    };
}

export default CategoryController;
