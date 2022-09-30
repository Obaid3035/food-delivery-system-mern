import {IController, IRequest} from "../../interface";
import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import StripeService from "../../service/vendor/StripeService";
import auth from "../../middleware/auth";
import {USER_ROLE} from "../../model/user";


class StripeController implements IController {
    path = "/vendor/account"
    router = Router()

    constructor() {
        this.router
            .post(`${this.path}`, auth(USER_ROLE.VENDOR), this.createConnectAccount)
    }

    private createConnectAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (<IRequest>req).user;
            const stripeServiceInstance = Container.get(StripeService);
            const accountLink = await stripeServiceInstance.createConnectAccount(user)
            res.status(200).json(accountLink)
        } catch (e) {
            next(e);
        }
    }
}

export default StripeController;
