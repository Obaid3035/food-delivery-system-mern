import {IController} from "../../interface";
import {NextFunction, Request, Response, Router} from "express";
import auth from "../../middleware/auth";
import {USER_ROLE} from "../../model/user";
import {Container} from "typedi";
import OrderService from "../../service/admin/OrderService";

class OrderController implements IController {
    path = "/admin/orders"
    router = Router()

    constructor() {
        this.router
            .get(`${this.path}/rejected`, auth(USER_ROLE.ADMIN), this.rejectedOrders)
            .put(`${this.path}/refund/:id`, auth(USER_ROLE.ADMIN), this.refundOrder)
    }

    private rejectedOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const vendorServiceInstance = Container.get(OrderService);
            const {formattedOrders, ordersCount} = await vendorServiceInstance.rejectedOrders(skip, limit)
            res.status(200).json({
                data: formattedOrders,
                count: ordersCount
            })
        } catch (e) {
            next(e);
        }
    }

    private refundOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = req.params.id;
            const vendorServiceInstance = Container.get(OrderService);
            const { message } = await vendorServiceInstance.refundOrder(orderId.toString())
            res.status(200).json({
                message,
            })
        } catch (e) {
            next(e);
        }
    }
}

export default OrderController
