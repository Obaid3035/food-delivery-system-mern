import { Service } from 'typedi';
import Shop from '../../model/shop';
import { BadRequest } from '../../lib/errorCode';
import Review from '../../model/review';
import { IResponseMessage, IReview } from '../../interface';
import Order from '../../model/order';

@Service()
class ReviewService {
   async index(shopSlug: string, skip: number, limit: number) {
      const shop = await Shop.findOne({
         slug: shopSlug,
      }).select('_id');
      if (!shop) {
         throw new BadRequest('Shop does not exist');
      }
      const reviews = await Review.find({ shop: shop._id }).populate('customer')
          .skip(skip).limit(limit);

      const reviewsCount = await Review.find().count();
      return {
         reviews,
         reviewsCount
      }
   }

   async create(
      userInput: IReview,
      userId: string,
      orderId: string
   ): Promise<IResponseMessage> {
      userInput.customer = userId;
      const orderPromise = Order.findByIdAndUpdate(orderId, {
         isReviewed: true,
      });
      const reviewPromise = Review.create(userInput);
      const [review, order] = await Promise.all([reviewPromise, orderPromise]);
      if (order && review) {
         await Shop.findByIdAndUpdate(userInput.shop, {
            $push: { reviews: review._id },
         });
         return {
            message: 'Review created successfully',
         };
      }
      throw new BadRequest('Something went wrong');
   }
}

export default ReviewService;
