import { IController, IRequest } from '../../interface';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import ReviewService from '../../service/vendor/ReviewService';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../model/user';

class ReviewController implements IController{
   path = "/vendor/reviews"
   router = Router()

   constructor() {
      this.router.get(`${this.path}`, auth(USER_ROLE.VENDOR), this.index);

   }

   private index = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const shopId = (<IRequest>req).user.shop
         const pageNo = parseInt(<string>req.query.page);
         const size = parseInt(<string>req.query.size);
         const skip = size * pageNo;
         const limit = size;
         const reviewServiceInstance = Container.get(ReviewService)
         const {formattedReviews, reviewCount} = await reviewServiceInstance.index(
             shopId.toString(),
             skip,
             limit
         )
         res.status(200).json({
            data: formattedReviews,
            count: reviewCount
         });
      } catch (e) {
         next(e);
      }
   }
}

export default ReviewController;
