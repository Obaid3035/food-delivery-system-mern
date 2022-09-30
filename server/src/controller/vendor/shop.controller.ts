import { IController, IRequest, IUploadMultiple } from '../../interface';
import { NextFunction, Request, Router, Response } from 'express';
import upload from '../../middleware/multer';
import { Container } from 'typedi';
import ShopService from '../../service/vendor/ShopService';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../model/user';

const uploadMultiple = upload.fields([
   { name: 'shopImage', maxCount: 1 },
   { name: 'shopBannerImage', maxCount: 1 },
]);

class ShopController implements IController {
   path = '/vendor/shops';
   router = Router();

   constructor() {
      this.router.post(`${this.path}`, auth(USER_ROLE.VENDOR), uploadMultiple, this.create);
      this.router.get(`${this.path}`, auth(USER_ROLE.VENDOR), this.show);
      this.router.put(`${this.path}`, auth(USER_ROLE.VENDOR), this.update);
   }


   private update = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const shopId = (<IRequest>req).user.shop;
         const shopServiceInstance = Container.get(ShopService);
         const { message } = await shopServiceInstance.update(shopId.toString(), req.body)
         res.status(200).json({
            message
         })
      } catch (e) {
         next(e);
      }
   }

   private show = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const shopId = (<IRequest>req).user.shop;
         const shopServiceInstance = Container.get(ShopService);
         const {shop, accountSetup} = await shopServiceInstance.show(shopId.toString())
         res.status(200).json({
            shop,
            accountSetup
         })
      } catch (e) {
         next(e);
      }
   }

   private create = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const userId = (<IRequest>req).user._id;
         const { shopImage, shopBannerImage } =
            req.files as unknown as IUploadMultiple;
         let location = JSON.parse(req.body.location);
         const shopServiceInstance = Container.get(ShopService);
         const { token, message } = await shopServiceInstance.create(
            req.body,
            userId,
            shopImage,
            shopBannerImage,
             location
         );
         res.status(200).json({ token, message });
      } catch (e) {
         next(e);
      }
   };
}

export default ShopController;
