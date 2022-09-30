import {Service} from "typedi";
import Stripe from "stripe";
import User from "../../model/user";
import {IShop, IUser} from "../../interface";
import Shop from "../../model/shop";
// @ts-ignore
const stripe = Stripe(process.env.STRIPE_API_KEY)

@Service()
class StripeService {
    async createConnectAccount(user: IUser) {
        const shop: IShop = await Shop.findById(user.shop);
        if (!shop.accountId) {
            const account = await stripe.accounts.create({
                country: 'GB',
                type: 'express',
                capabilities: {
                    card_payments: {requested: true},
                    transfers: {requested: true},
                },
                business_type: 'individual',
                email: user.email,
                business_profile: {url: `https://www.snakrs.com/${shop.slug}`}
            });

            if (!account) {
                throw new Error("Account cannot be created!")
            }

            await Shop.updateOne({
                _id: shop._id
            }, {
                accountId: account.id
            })
            return await User.setUpConnectAccountLink(account.id)
        }
        const account = await stripe.accounts.retrieve(
            shop.accountId
        );
        if (!account) {
            throw new Error("Account cannot be created!")
        }
        return await User.setUpConnectAccountLink(shop.accountId)
    }
}

export default StripeService
