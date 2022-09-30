import {Service} from "typedi";
import Shop from "../../model/shop";
import {IOrder, IUser} from "../../interface";
import Order, {ORDER_STATUS} from "../../model/order";
import moment from "moment";
import BadRequest from "../../lib/errorCode";
import Stripe from "stripe";
import {sendOrderCreatedMail, vendorOrderConfirmation} from "../../lib/emailService/email";
import User from "../../model/user";
// @ts-ignore
const stripe = Stripe(process.env.STRIPE_API_KEY)

@Service()
class OrderService {

    async index(userId: string) {
        const pendingOrdersPromise = Order.find({
            customer: userId,
            $or: [
                {
                    orderStatus: ORDER_STATUS.UNDER_APPROVAL
                },
                {
                    orderStatus: ORDER_STATUS.IN_PROGRESS
                }
            ]

        }).select("items isReviewed createdAt deliveryType totalPrice orderStatus").populate({
            path: 'shop',
            select: 'shopName address postalCode',
        })

        const pastOrdersPromise = Order.find({
            customer: userId,
            $or: [
                {
                    orderStatus: ORDER_STATUS.COMPLETED
                }
            ]
        }).select("items totalPrice deliveryType isReviewed orderStatus").populate({
            path: 'shop',
            select: 'shopName address postalCode',
        })

        const rejectedOrdersPromise = Order.find({
            customer: userId,
            $or: [
                {
                    orderStatus: ORDER_STATUS.REJECTED
                }
            ]
        }).select("items isReviewed deliveryType totalPrice orderStatus").populate({
            path: 'shop',
            select: 'shopName address postalCode',
        })

        let [pendingOrders, pastOrders, rejectedOrders] =
            await Promise.all([pendingOrdersPromise, pastOrdersPromise, rejectedOrdersPromise]);

        let pending: any = pendingOrders;

        if (pending.length > 0) {
            pending = pendingOrders.map((order: any) => {
                let largestTime = 0;
                let totalTime = 0;
                order._doc.items.forEach((item: any) => {
                    let millisecondsHours = new Date(item.itemTime).getHours() * (1000 * 60 * 60)
                    let millisecondsMinutes =  new Date(item.itemTime).getMinutes() * (1000 * 60)
                    totalTime = millisecondsMinutes + millisecondsHours
                    if (totalTime > largestTime) {
                        largestTime = totalTime
                    }
                })
                let createdAt = moment.utc(order.createdAt).valueOf()
                let currentTime = moment.utc().valueOf()
                let timeDifference = currentTime - createdAt
                const timer = totalTime - timeDifference

                return {
                    ...order._doc,
                    timer
                }
            })
        }

        return {
            pendingOrders: pending,
            pastOrders,
            rejectedOrders
        }
    }

    async createPaymentIntent(userInput: any, slug: string) {
        const shop = await Shop.findOne({
            slug
        })
        if (!shop) {
            throw new BadRequest("Shop does not exist");
        }

        const {client_secret, id} = await stripe.paymentIntents.create({
            amount: parseFloat(userInput.totalPrice) * 100,
            currency: 'gbp',
            payment_method_types: ['card'],
            transfer_data: {
                amount: parseFloat(userInput.orderBill) * 100,
                destination: shop.accountId,
            },
        })

        return {
            secret: client_secret,
            paymentIntentId: id
        }
    }

    async create(userInput: IOrder, user: IUser, slug: string) {
        const shop = await Shop.findOne({
            slug
        })
        if (!shop) {
            return {
                message: "Orders cannot be created!"
            }
        }
        userInput.shop = shop._id;
        userInput.customer = user._id;
        await Order.create(userInput);
        const vendor = await User.findOne({
            shop: shop._id,
        })
        await vendorOrderConfirmation(vendor.email, user.email)
        await sendOrderCreatedMail(user)
        return {
            message: "Orders created successfully!"
        }
    }
}

export default OrderService;
