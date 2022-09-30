import {IController, IRequest} from '../../interface';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import ReviewService from '../../service/customer/ReviewService';
import auth from "../../middleware/auth";
import {USER_ROLE} from "../../model/user";

class ReviewController implements IController {
   path = '/reviews';
   router = Router();

   constructor() {
      this.router
         .get(`${this.path}/:slug`, this.index)
         .post(`${this.path}/:id`, auth(USER_ROLE.CUSTOMER),this.create);
   }

   private index = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const shopSlug = req.params.slug;
         const pageNo = parseInt(<string>req.query.page);
         const size = parseInt(<string>req.query.size);
         const skip = size * pageNo;
         const reviewServiceInstance = Container.get(ReviewService); const limit = size;

         const {reviews, reviewsCount} = await reviewServiceInstance.index(shopSlug, skip, limit);
         res.status(200).json({
            reviews, reviewsCount
         });
      } catch (e) {
         next(e);
      }
   };
   private create = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const orderId = req.params.id;
         const user = (<IRequest>req).user;
         const reviewServiceInstance = Container.get(ReviewService);
         const { message } = await reviewServiceInstance.create(
            req.body,
             user._id,
            orderId
         );
         res.status(201).json({ message });
      } catch (e) {
         next(e);
      }
   };
}

export default ReviewController;
