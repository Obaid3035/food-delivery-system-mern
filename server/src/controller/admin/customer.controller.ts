import {IController} from "../../interface";
import {NextFunction, Request, Response, Router} from "express";
import auth from "../../middleware/auth";
import {USER_ROLE} from "../../model/user";
import {Container} from "typedi";
import CustomerService from "../../service/admin/CustomerService";

class CustomerController implements IController{
    path = "/admin/customers";
    router = Router();

    constructor() {
        this.router
            .get(`${this.path}`, auth(USER_ROLE.ADMIN), this.index)
    }

    private index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const customerInstance = Container.get(CustomerService);
            const {formattedCustomer, customerCount} = await customerInstance.index(
                skip,
                limit
            )
            res.status(200).json({
                data: formattedCustomer,
                count: customerCount
            })
        } catch (e) {
            next(e);
        }
    }
}

export default CustomerController
