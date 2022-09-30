import {IController, IRequest} from "../../interface";
import {NextFunction, Request, Response, Router} from "express";
import auth from "../../middleware/auth";
import {USER_ROLE} from "../../model/user";
import {Container} from "typedi";
import SubscriptionService from "../../service/vendor/SubscriptionService";

class SubscriptionController implements IController {
    path = "/vendor/subscription"
    router = Router()

    constructor() {
        this.router
            .post(`${this.path}`, auth(USER_ROLE.VENDOR), this.subscribe)
            .get(`${this.path}`, auth(USER_ROLE.VENDOR), this.show)
            .put(`${this.path}/cancel`, auth(USER_ROLE.VENDOR), this.cancelSubscription)
    }

    private subscribe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (<IRequest>req).user._id;
            const stripeToken = req.body.stripeToken;
            const priceId = req.body.priceId;
            const subscriptionServiceInstance = Container.get(SubscriptionService);
            const {message, token} = await subscriptionServiceInstance.subscribe(userId, stripeToken, priceId);
            res.status(200).json({
                message,
                token
            })
        } catch (e) {
            next(e);
        }
    }

    private show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (<IRequest>req).user._id;
            const userEmail = (<IRequest>req).user.email;
            const subscriptionServiceInstance = Container.get(SubscriptionService);
            const subscription = await subscriptionServiceInstance.show(userId, userEmail);
            res.status(200).json(subscription)
        } catch (e) {
            next(e);
        }
    }

    private cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (<IRequest>req).user._id;
            const subscriptionServiceInstance = Container.get(SubscriptionService);
            const {message, token} = await subscriptionServiceInstance.cancelSubscription(userId);
            res.status(200).json({
                message,
                token
            })
        } catch (e) {
            next(e);
        }
    }
}

export default SubscriptionController;
