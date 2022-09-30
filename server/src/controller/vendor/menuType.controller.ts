import { IController, IRequest } from '../../interface';
import { NextFunction, Request, Router, Response } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../model/user';
import { Container } from 'typedi';
import MenuTypeService from '../../service/vendor/MenuTypeService';

class MenuTypeController implements IController{
   path: string = "/vendor/menu-types";
   router = Router();

   constructor() {
      this.router
         .get(`${this.path}`, auth(USER_ROLE.VENDOR), this.index)
         .get(`${this.path}/:id`, auth(USER_ROLE.VENDOR), this.show)
         .post(`${this.path}`, auth(USER_ROLE.VENDOR), this.create)
         .put(`${this.path}/:id`, auth(USER_ROLE.VENDOR), this.update)
         .delete(`${this.path}/:id`, auth(USER_ROLE.VENDOR), this.delete)


   }

   private index = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const shopId = (<IRequest>req).user.shop;
         const pageNo = parseInt(<string>req.query.page);
         const size = parseInt(<string>req.query.size);
         const skip = size * pageNo;
         const limit = size;
         const menuTypeInstance = Container.get(MenuTypeService);
         const {formattedMenuTypes, menuTypeCount} = await menuTypeInstance.index(
             shopId.toString(),
             skip,
             limit
         )
         res.status(200).json({
            data: formattedMenuTypes,
            count: menuTypeCount
         })
      } catch (e) {
         next(e);
      }
   }

   private show = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const menuTypeId = req.params.id
         const menuTypeInstance = Container.get(MenuTypeService);
         const menuType = await menuTypeInstance.show(menuTypeId);
         res.status(201).json(menuType)
      } catch (e) {
         next(e);
      }
   }

   private create = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const shopId = (<IRequest>req).user.shop;
         const menuTypeInstance = Container.get(MenuTypeService);
         const { message } = await menuTypeInstance.create(req.body, shopId.toString());
         res.status(201).json({
            message
         })
      } catch (e) {
         next(e);
      }
   }

   private update = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const menuTypeId = req.params.id
         const menuTypeInstance = Container.get(MenuTypeService);
         const { message } = await menuTypeInstance.update(req.body, menuTypeId)
         res.status(200).json({
            message
         })
      } catch (e) {
         next(e);
      }
   }

   private delete = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const menuTypeId = req.params.id
         const shopId = (<IRequest>req).user.shop
         const menuTypeInstance = Container.get(MenuTypeService);
         const { message } = await menuTypeInstance.delete(shopId.toString(), menuTypeId)
         res.status(200).json({
            message
         })

      } catch (e) {
         next(e);
      }
   }

}

export default MenuTypeController;
