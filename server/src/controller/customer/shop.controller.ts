import { IController, ICoordinates, IRequest } from '../../interface';
import { NextFunction, Router, Request, Response } from 'express';
import { Container } from 'typedi';
import ShopService from '../../service/customer/ShopService';
import auth from '../../middleware/auth';
import {USER_ROLE} from "../../model/user";

class ShopController implements IController{
   router = Router();
   path = '/shops';

   constructor() {
      this.router
          .get(`${this.path}`, this.index)
          .get(`${this.path}/postal`, this.getPostalShops)
         .get(`${this.path}/:slug`, this.show)
         .get(`${this.path}/already-ordered/:slug`, auth(USER_ROLE.CUSTOMER), this.alreadyOrdered)
   }

   private index = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { lat, lng } = req.query as unknown as ICoordinates;
         const pageNo = parseInt(<string>req.query.page);
         const size = parseInt(<string>req.query.size);
         const skip = size * pageNo;
         const limit = size;
         const shopServiceInstance = Container.get(ShopService);
         const {shops, shopsCount}  = await shopServiceInstance.index({ lat, lng}, skip, limit)
         res.status(200).json({
            shops, shopsCount
         });
      } catch (err) {
         next(err);
      }
   }

   private getPostalShops = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const pageNo = parseInt(<string>req.query.page);
         const size = parseInt(<string>req.query.size);
         const skip = size * pageNo;
         const limit = size;
         const shopServiceInstance = Container.get(ShopService);
         const {postalDeliveryShopCount, postalDeliveryShop}  = await shopServiceInstance.getPostalShops( skip, limit)
         res.status(200).json({
           postalDeliveryShop, postalDeliveryShopCount
         });
      } catch (err) {
         next(err);
      }
   }

   private show = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const shopSlug = req.params.slug;
         const shopServiceInstance = Container.get(ShopService);
         const { shop, products, category, reviewCount }  = await shopServiceInstance.show(shopSlug);
         res.status(200).json({
            shop,
            products,
            category,
            reviewCount
         });
      } catch (err) {
         next(err)
      }
   }

   private alreadyOrdered = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const shopSlug = req.params.slug;
         const user = (<IRequest>req).user;
         const shopServiceInstance = Container.get(ShopService);
         const isOrdered = await shopServiceInstance.alreadyOrdered(shopSlug, user);
         res.status(200).json(isOrdered );
      } catch (err) {
         next(err)
      }
   }

}

export default ShopController;
