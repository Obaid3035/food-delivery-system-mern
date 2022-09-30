import {IController} from "../../interface";
import {NextFunction, Request, Response, Router} from "express";
import auth from "../../middleware/auth";
import {USER_ROLE} from "../../model/user";
import {Container} from "typedi";
import DashboardService from "../../service/admin/DashboardService";

class DashboardController implements IController {
    path = "/admin/dashboard";
    router = Router();

    constructor() {
        this.router
            .get(`${this.path}`, auth(USER_ROLE.ADMIN), this.index);
    }

    private index = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const dashboardServiceInstance = Container.get(DashboardService);
            const {formattedVendors, vendorsCount, activeVendorCount, inActiveVendorCount} = await dashboardServiceInstance.index()
            res.send({
                vendor: {
                    data: formattedVendors,
                    count: vendorsCount
                },
                activeVendorCount,
                inActiveVendorCount
            })
        } catch (e) {
            next(e);
        }

    }
}

export default DashboardController;
