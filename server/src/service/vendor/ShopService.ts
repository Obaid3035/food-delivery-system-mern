import { Service } from 'typedi';
import Shop from '../../model/shop';
import cloudinary from '../../lib/cloudinary';
import User from '../../model/user';
import { IShop } from '../../interface';
import slugify from "slugify";
import Stripe from "stripe";
// @ts-ignore
const stripe = Stripe(process.env.STRIPE_API_KEY)

@Service()
class ShopService {

   async update(shopId: string, userInput: IShop) {
      userInput.slug = slugify(userInput.shopName, {lower: true, strict: true});
      await Shop.findByIdAndUpdate(shopId, userInput);
      return {
         message: "Shop has been updated"
      }
   }

   async show(shopId: string) {
      const shop = await Shop.findById(shopId);
      if (shop.accountId) {
         const {charges_enabled, payouts_enabled} = await stripe.accounts.retrieve(
             shop.accountId
         );
         if (charges_enabled && payouts_enabled) {
            return {
               shop,
               accountSetup: true
            }
         } else {
            return {
               shop,
               accountSetup: false
            }
         }
      }
      return {
         shop,
         accountSetup: false
      }
   }

   async create(
      body: IShop,
      userId: string,
      shopImage: any,
      shopBannerImage: any,
      location: {
         coordinates: [number, number]
      }
   ) {

      await Shop.shopExists(body.shopName)
      const {uploadShopImage, uploadedShopBannerImage} = await Shop.uploadImages(shopImage[0].path, shopBannerImage[0].path);

      const shopInstance = {
         ...body,
         location,
         shopImage: {
            avatar: uploadShopImage.secure_url,
            cloudinary_id: uploadShopImage.public_id,
         },
         shopBannerImage: {
            avatar: uploadedShopBannerImage.secure_url,
            cloudinary_id: uploadedShopBannerImage.public_id,
         },
      };

      const shop = await Shop.create(shopInstance);
      if (!shop) {
         await Shop.deleteImages(uploadShopImage.public_id, uploadedShopBannerImage.public_id)
      }

      const updatedUser = await User.findByIdAndUpdate(userId, {
         profileSetup: true,
         shop: shop._id,
      });
      if (!updatedUser) {
         const deleteShopImagePromise = cloudinary.v2.uploader.destroy(
            uploadShopImage.public_id
         );
         const deleteShopBannerPromise = cloudinary.v2.uploader.destroy(
            uploadedShopBannerImage.public_id
         );
         const deleteShopPromise = Shop.findByIdAndDelete(shop._id);
         await Promise.all([
            deleteShopImagePromise,
            deleteShopBannerPromise,
            deleteShopPromise,
         ]);
         throw new Error("Shop can't be created at this time");
      }

      const user = await User.findById(userId);
      const token = await user.generateToken();

      return {
         message: "Shop has been successfully created",
         token
      };
   }
}

export default ShopService;
