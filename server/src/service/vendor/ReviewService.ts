import { Service } from 'typedi';
import Review from '../../model/review';

@Service()

class ReviewService {
   async index(shopId: string, skip: number, limit: number) {
      const reviewPromise = Review.find({
         shop: shopId
      }).populate({
         path: 'customer',
         select: 'name'
      }).skip(skip).limit(limit);

      const reviewCountPromise = Review.find({
         shop: shopId
      }).count()
      const [reviews, reviewCount] = await Promise.all([reviewPromise, reviewCountPromise])
      const formattedReviews = reviews.map((review:any) => {
         let obj = {
            _id: review._id,
            name: review.customer.name,
            comment: review.comment,
            rating: review.rating,
         }
         return Object.values(obj)
      });

      return {
         formattedReviews,
         reviewCount
      }
   }
}

export default ReviewService;
