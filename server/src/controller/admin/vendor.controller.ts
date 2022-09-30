import {IController} from "../../interface";
import {NextFunction, Request, Response, Router} from "express";
import auth from "../../middleware/auth";
import {USER_ROLE} from "../../model/user";
import {Container} from "typedi";
import VendorService from "../../service/admin/VendorService";

class VendorController implements IController {
    path = "/admin/vendors";
    router = Router();

    constructor() {
        this.router
            .get(`${this.path}/subscription`, auth(USER_ROLE.ADMIN), this.subscription)
            .get(`${this.path}`, auth(USER_ROLE.ADMIN), this.allVendors)
            .get(`${this.path}/active`, auth(USER_ROLE.ADMIN), this.activeVendor)
            .get(`${this.path}/inactive`, auth(USER_ROLE.ADMIN), this.inActiveVendor)
            .put(`${this.path}/active/:id`, auth(USER_ROLE.ADMIN), this.toActiveVendor)
            .put(`${this.path}/inactive/:id`, auth(USER_ROLE.ADMIN), this.toInActiveVendor)
    }


    private subscription = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const vendorServiceInstance = Container.get(VendorService);
            const {formattedSubscription, subscriptionCount} = await vendorServiceInstance.subscription(skip, limit)
            res.status(200).json({
                data: formattedSubscription,
                count: subscriptionCount
            })
        } catch (e) {
            next(e);
        }
    }


    private allVendors = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const vendorServiceInstance = Container.get(VendorService);
            const {formattedVendor, vendorCount} = await vendorServiceInstance.allVendors(skip, limit)
            res.status(200).json({
                data: formattedVendor,
                count: vendorCount
            })
        } catch (e) {
            next(e);
        }
    }

    private activeVendor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const vendorServiceInstance = Container.get(VendorService);
            const {formattedActiveVendor, activeVendorCount} = await vendorServiceInstance.activeVendor(skip, limit)
            res.status(200).json({
                data: formattedActiveVendor,
                count: activeVendorCount
            })
        } catch (e) {
            next(e);
        }
    }

    private inActiveVendor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const skip = size * pageNo;
            const limit = size;
            const vendorServiceInstance = Container.get(VendorService);
            const {
                formattedInActiveVendor,
                inActiveVendorCount
            } = await vendorServiceInstance.inActiveVendor(skip, limit)
            res.status(200).json({
                data: formattedInActiveVendor,
                count: inActiveVendorCount
            })
        } catch (e) {
            next(e);
        }
    }

    private toActiveVendor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = req.params.id
            const vendorServiceInstance = Container.get(VendorService);
            const {message} = await vendorServiceInstance.toActiveVendor(shopId)
            res.status(200).json({
                message
            })
        } catch (e) {
            next(e);
        }
    }

    private toInActiveVendor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = req.params.id
            const vendorServiceInstance = Container.get(VendorService);
            const {message} = await vendorServiceInstance.toInActiveVendor(shopId)
            res.status(200).json({
                message
            })
        } catch (e) {
            next(e);
        }
    }



}

export default VendorController;
