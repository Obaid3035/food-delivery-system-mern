import {IController, IRequest} from "../../interface";
import {NextFunction, Request, Response, Router} from "express";
import auth from "../../middleware/auth";
import {USER_ROLE} from "../../model/user";
import {Container} from "typedi";
import OrderService from "../../service/customer/OrderService";

class OrderController implements IController{
    path = "/orders"
    router = Router()

    constructor() {
        this.router
            .get(`${this.path}`, auth(USER_ROLE.CUSTOMER), this.index)
            .post(`${this.path}/payment/secret/:slug`, auth(USER_ROLE.CUSTOMER), this.createPaymentIntent)
            .post(`${this.path}/:slug`, auth(USER_ROLE.CUSTOMER), this.create)
    }

    private index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (<IRequest>req).user;
            const orderServiceInstance = Container.get(OrderService);
            const { rejectedOrders, pastOrders, pendingOrders } = await orderServiceInstance.index(user._id.toString())
            res.status(200).json({
                pendingOrders,
                pastOrders,
                rejectedOrders
            })
        } catch (e) {
            next(e);
        }
    }

    private createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopSlug = req.params.slug;
            const orderServiceInstance = Container.get(OrderService);
            const { paymentIntentId, secret } = await orderServiceInstance.createPaymentIntent(req.body, shopSlug)
            res.status(200).json({
                paymentIntentId,
                secret
            })
        } catch (e) {
            next(e);
        }
    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopSlug = req.params.slug;
            const user = (<IRequest>req).user;
            const orderServiceInstance = Container.get(OrderService);
            const { message } = await orderServiceInstance.create(req.body, user, shopSlug)
            res.status(200).json({
                message
            })
        } catch (e) {
            next(e);
        }
    }
}
export default OrderController;
