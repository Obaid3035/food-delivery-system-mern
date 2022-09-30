import {IController, IRequest} from '../../interface';
import {Router, Request, Response, NextFunction} from 'express';
import auth from '../../middleware/auth';
import {Container} from 'typedi';
import OrderService from '../../service/vendor/OrderService';
import {USER_ROLE} from "../../model/user";

class OrderController implements IController {
    router = Router()
    path = '/vendor/orders';

    constructor() {
        this.router
            .get(`${this.path}-all`, auth(USER_ROLE.VENDOR), this.allOrders)
            .get(`${this.path}-under-approval`, auth(USER_ROLE.VENDOR), this.underApprovalOrders)
            .get(`${this.path}-in-progress`, auth(USER_ROLE.VENDOR), this.inProgressOrders)
            .get(`${this.path}-completed`, auth(USER_ROLE.VENDOR), this.completedOrders)
            .get(`${this.path}-rejected`, auth(USER_ROLE.VENDOR), this.rejectedOrders)
            .put(`${this.path}/accepted/:id`, auth(USER_ROLE.VENDOR), this.toAcceptedOrder)
            .put(`${this.path}/rejected/:id`, auth(USER_ROLE.VENDOR), this.toRejectedOrder)
            .put(`${this.path}/completed/:id`, auth(USER_ROLE.VENDOR), this.toCompletedOrder)
            .get(`${this.path}/:id`, auth(USER_ROLE.VENDOR), this.show)

    }

    private toCompletedOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = req.params.id;
            const orderServiceInstance = Container.get(OrderService);
            const { message } = await orderServiceInstance.toCompletedOrder(
                orderId.toString(),
            );
            res.status(200).json({
                message
            })
        } catch (e) {
            next(e);
        }
    }

    private toRejectedOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = req.params.id;
            const orderServiceInstance = Container.get(OrderService);
            const { message } = await orderServiceInstance.toRejectedOrder(
                orderId.toString(),
            );
            res.status(200).json({
                message
            })
        } catch (e) {
            next(e);
        }
    }

    private toAcceptedOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = req.params.id;
            const orderServiceInstance = Container.get(OrderService);
            const { message } = await orderServiceInstance.toAcceptedOrder(
                orderId.toString(),
            );
            res.status(200).json({
                message
            })
        } catch (e) {
            next(e);
        }
    }

    private show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = req.params.id;
            const orderServiceInstance = Container.get(OrderService);
            const order = await orderServiceInstance.show(
                orderId.toString(),
            );

            res.status(200).json(order)
        } catch (e) {
            next(e);
        }
    }

    private allOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const orderServiceInstance = Container.get(OrderService);
            const {formattedAllOrders, allOrdersCount} = await orderServiceInstance.allOrders(
                shopId.toString(),
                skip,
                limit
            );
            res.status(200).json({
                data: formattedAllOrders,
                count: allOrdersCount
            })
        } catch (e) {
            next(e);
        }
    }


    private underApprovalOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const orderServiceInstance = Container.get(OrderService);
            const {formattedUnderApprovalOrders, underApprovalOrdersCount} = await orderServiceInstance.underApprovalOrders(
                shopId.toString(),
                skip,
                limit
            );
            res.status(200).json({
                data: formattedUnderApprovalOrders,
                count: underApprovalOrdersCount
            })
        } catch (e) {
            next(e);
        }
    }


    private inProgressOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const orderServiceInstance = Container.get(OrderService);
            const {formattedInProgressOrders, inProgressOrdersCount} = await orderServiceInstance.inProgressOrders(
                shopId.toString(),
                skip,
                limit
            );
            res.status(200).json({
                data: formattedInProgressOrders,
                count: inProgressOrdersCount
            })
        } catch (e) {
            next(e);
        }
    }


    private completedOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const orderServiceInstance = Container.get(OrderService);
            const {formattedCompletedOrders, completedOrdersCount} = await orderServiceInstance.completedOrders(
                shopId.toString(),
                skip,
                limit
            );
            res.status(200).json({
                data: formattedCompletedOrders,
                count: completedOrdersCount
            })
        } catch (e) {
            next(e);
        }
    }

    private rejectedOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = (<IRequest>req).user.shop;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const orderServiceInstance = Container.get(OrderService);
            const {formattedRejectedOrders, rejectedOrdersCount} = await orderServiceInstance.rejectedOrders(
                shopId.toString(),
                skip,
                limit
            );
            res.status(200).json({
                data: formattedRejectedOrders,
                count: rejectedOrdersCount
            })
        } catch (e) {
            next(e);
        }
    }


}

export default OrderController
