import {Service} from 'typedi';
import Shop, {DELIVERY_TYPE, SHOP_STATUS} from '../../model/shop';
import {ICoordinates, IUser} from '../../interface';
import {BadRequest} from '../../lib/errorCode';
import Order, {ORDER_STATUS} from '../../model/order';
import Product from "../../model/product";
import Category from "../../model/category";
import Review from "../../model/review";

@Service()
class ShopService {

   async getPostalShops(skip: number, limit: number) {
      const postalDeliveryShopPromise = Shop.find({
         shopStatus: SHOP_STATUS.ACTIVE,
         shopVisibility: true,
         deliveryType: DELIVERY_TYPE.POSTAL_DELIVERY
      }).skip(skip).limit(limit)

      const postalDeliveryShopCountPromise = Shop.find({
         shopStatus: SHOP_STATUS.ACTIVE,
         shopVisibility: true,
         deliveryType: DELIVERY_TYPE.POSTAL_DELIVERY
      })

      const [postalDeliveryShop, postalDeliveryShopCount] = await Promise.all([postalDeliveryShopPromise, postalDeliveryShopCountPromise])
      return {
         postalDeliveryShop,
         postalDeliveryShopCount: postalDeliveryShopCount.length
      }
   }

   async index(coordinates: ICoordinates, skip: number, limit: number) {
      if (coordinates.lat && coordinates.lng) {
         const shopsPromise = Shop.find({
            shopStatus: SHOP_STATUS.ACTIVE,
            shopVisibility: true,
            $or: [
               {
                  deliveryType: DELIVERY_TYPE.LOCAL_DELIVERY,
               },
               {
                  deliveryType: DELIVERY_TYPE.PICKUP
               },
               {
                  deliveryType: DELIVERY_TYPE.BOTH
               }
            ],
            location: {
               $near: {
                  $maxDistance: 1000000000,
                  $geometry: {
                     type: 'Point',
                     coordinates: [coordinates.lat, coordinates.lng],
                  },
               },
            },
         }).select(
            'shopName shopImage slug address location avgRating noOfReviews'
         ).skip(skip).limit(limit);

         const shopsCountPromise = Shop.find({
            $or: [
               {
                  deliveryType: DELIVERY_TYPE.LOCAL_DELIVERY,
               },
               {
                  deliveryType: DELIVERY_TYPE.PICKUP
               },
               {
                  deliveryType: DELIVERY_TYPE.BOTH
               }
            ],
            location: {
               $near: {
                  $maxDistance: 100000000000000,
                  $geometry: {
                     type: 'Point',
                     coordinates: [coordinates.lat, coordinates.lng],
                  },
               },
            },
         })



         const [shops, shopsCount] = await Promise.all([shopsPromise, shopsCountPromise])

         return {
            shops,
            shopsCount: shopsCount.length,
         }
      }
      throw new BadRequest('Coordinates are incorrect');
   }

   async show(shopSlug: string){
      const shop = await Shop.findOne({ slug: shopSlug })
      if (!shop) {
         throw new BadRequest("Sorry this shop does not exist");
      }
      const categoryPromise = Category.find({
         shop: shop._id
      })
      const productsPromise = Product.find({
         shop: shop._id
      }).populate("category menuType addOn")

      const reviewCountPromise = Review.find({
         shop: shop._id
      }).count()
      const [products, category, reviewCount] = await Promise.all([productsPromise, categoryPromise, reviewCountPromise])

      return {
         shop,
         products,
         category,
         reviewCount
      }
   }

   async alreadyOrdered(shopSlug: string, user: IUser): Promise<boolean> {
      const shop = await Shop.findOne({
         slug: shopSlug
      }).select('_id');
      if (!shop) {
         throw new BadRequest("Sorry this shop does not exist");
      }
      const orders = await Order.find({
         customer: user._id,
         shop: shop._id,
         $and: [
            {
               orderStatus: {
                  $ne: ORDER_STATUS.REJECTED
               }
            },
            {
               orderStatus: {
                  $ne: ORDER_STATUS.COMPLETED
               }
            }
         ]
      }).count()

      return orders > 0;
   }
}

export default ShopService;
