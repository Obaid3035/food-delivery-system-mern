import {Service} from "typedi";
import Shop, {SHOP_STATUS} from "../../model/shop";
import {IShop} from "../../interface";
import Subscription from "../../model/subscription";
import Stripe from "stripe";
import User from "../../model/user";
import {shopActiveConfirmation} from "../../lib/emailService/email";
// @ts-ignore
const stripe = Stripe(process.env.STRIPE_API_KEY)

@Service()
class VendorService {

    async allVendors(skip: number, limit: number) {
        const vendorPromise = Shop.find().select('shopName address shopStatus').skip(skip).limit(limit);

        const vendorCountPromise  = Shop.find().count()

        const [vendor, vendorCount] = await Promise.all([vendorPromise, vendorCountPromise])
        const formattedVendor = vendor.map((shop: IShop) => {
            let obj = {
                _id: shop._id,
                name: shop.shopName,
                address: shop.address,
                shopStatus: shop.shopStatus
            }
            return Object.values(obj)
        })
        return {
            formattedVendor,
            vendorCount
        }
    }

    async activeVendor(skip: number, limit: number) {
        const activeVendorPromise = Shop.find({
            shopStatus: SHOP_STATUS.ACTIVE,
        }).select('shopName address shopStatus').skip(skip).limit(limit);

        const activeVendorCountPromise  = Shop.find({
            shopStatus: SHOP_STATUS.ACTIVE,
        }).count()

        const [activeVendor, activeVendorCount] = await Promise.all([activeVendorPromise, activeVendorCountPromise])

        const formattedActiveVendor = activeVendor.map((shop: IShop) => {
            let obj = {
                _id: shop._id,
                name: shop.shopName,
                address: shop.address,
                shopStatus: shop.shopStatus
            }
            return Object.values(obj)
        })

        return {
            formattedActiveVendor,
            activeVendorCount
        }

    }

    async inActiveVendor(skip: number, limit: number) {
        const inActiveVendorPromise = Shop.find({
            shopStatus: SHOP_STATUS.INACTIVE,
        }).select('shopName address shopStatus').skip(skip).limit(limit);

        const inActiveVendorCountPromise  = Shop.find({
            shopStatus: SHOP_STATUS.INACTIVE,
        }).count()

        const [inActiveVendor, inActiveVendorCount] = await Promise.all([inActiveVendorPromise, inActiveVendorCountPromise])

        const formattedInActiveVendor = inActiveVendor.map((shop: IShop) => {
            let obj = {
                _id: shop._id,
                name: shop.shopName,
                address: shop.address,
                shopStatus: shop.shopStatus
            }
            return Object.values(obj)
        })

        return {
            formattedInActiveVendor,
            inActiveVendorCount
        }
    }

    async toActiveVendor(shopId: string) {
        await Shop.findByIdAndUpdate(shopId, {
            shopStatus: SHOP_STATUS.ACTIVE,
            shopVisibility: false
        })
        const user = await User.findOne({
            shop: shopId
        })
        await shopActiveConfirmation(user.email);
        return {
            message: "Vendor status changed to active"
        }
    }

    async toInActiveVendor(shopId: string) {
        await Shop.findByIdAndUpdate(shopId, {
            shopStatus: SHOP_STATUS.INACTIVE,
            shopVisibility: false
        })
        return {
            message: "Vendor status changed to inactive"
        }
    }

    async subscription(skip: number, limit: number) {
        const subscriptionPromise = Subscription.find().populate("vendor").skip(skip).limit(limit);
        const subscriptionCountPromise = Subscription.find().count()
        const [subscription, subscriptionCount] = await Promise.all([subscriptionPromise, subscriptionCountPromise])
        const formattedSubscription = subscription.map((subscription: any) => {
            let obj = {
                _id: subscription._id,
                email: subscription.vendor.email,
                phoneNumber: subscription.vendor.phoneNumber,
                status: subscription.status
            }
            return Object.values(obj)
        })
        return {
            formattedSubscription,
            subscriptionCount
        }
    }
}

export default VendorService;
