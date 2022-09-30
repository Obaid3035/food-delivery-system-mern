import { Router, Request, Response, NextFunction } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../model/user';
import { Container } from 'typedi';
import AddOnService from '../../service/vendor/AddOnService';
import { IRequest } from '../../interface';

class AddOnController {
   path = '/vendor/add-on';
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
         const addOnServiceInstance = Container.get(AddOnService);
         const { formattedAddOns, addOnCount} = await addOnServiceInstance.index(
             shopId.toString(),
             skip,
             limit
         );
         res.status(200).json({
            data: formattedAddOns,
            count: addOnCount
         });
      } catch (e) {
         next(e);
      }
   };

   private create = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const shopId = (<IRequest>req).user.shop;
         const addOnServiceInstance = Container.get(AddOnService);
         const { message } = await addOnServiceInstance.create(
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
         const addOnId = req.params.id;
         const addOnServiceInstance = Container.get(AddOnService);
         const addOn = await addOnServiceInstance.show(addOnId);
         res.status(200).json(addOn);
      } catch (e) {
         next(e);
      }
   };

   private update = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const addOnId = req.params.id;
         const addOnServiceInstance = Container.get(AddOnService);
         const { message } = await addOnServiceInstance.update(
            req.body,
            addOnId
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
         const addOnId = req.params.id;
         const shopId = (<IRequest>req).user.shop;
         const addOnServiceInstance = Container.get(AddOnService);
         const { message } = await addOnServiceInstance.delete(
            shopId.toString(),
            addOnId.toString()
         );
         res.status(200).json({
            message,
         });
      } catch (e) {
         next(e);
      }
   };
}

export default AddOnController;
