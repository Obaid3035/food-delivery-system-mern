import {Service} from "typedi";
import Order, {ORDER_STATUS} from "../../model/order";
import Stripe from "stripe";
import {BadRequest} from "../../lib/errorCode";
// @ts-ignore
const stripe = Stripe(process.env.STRIPE_API_KEY)

@Service()
class OrderService {
    async rejectedOrders(skip: number, limit: number) {
        const ordersPromise = Order.find({
            orderStatus: ORDER_STATUS.REJECTED
        }).populate('customer').populate('shop').skip(skip).limit(limit);
        const ordersCountPromise  = Order.find({
            orderStatus: ORDER_STATUS.REJECTED
        }).count()

        const [orders, ordersCount] = await Promise.all([ordersPromise, ordersCountPromise])
        const formattedOrders = orders.map((order: any) => {
            let obj = {
                _id: order._id,
                name: order.customer.name,
                email: order.customer.email,
                phone: order.customer.phoneNumber,
                shopName: order.shop.shopName,
                totalPrice: order.totalPrice,
                isRefunded: order.isRefunded ? "YES" : "No"
            }
            return Object.values(obj)
        })

        return {
            formattedOrders,
            ordersCount
        }
    }

    async refundOrder(orderId: string) {
        const order = await Order.findById(orderId);
        if (order.isRefunded) {
            throw new BadRequest("Order is already refunded")
        }
        const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
        if (!paymentIntent) {
            throw new BadRequest("Cannot refund order");
        }
        const refund = await stripe.refunds.create({
            charge: paymentIntent.charges.data[0].id,
            reverse_transfer: true,
        });
        if (!refund) {
            throw new BadRequest("Cannot refund order");
        }

        await Order.findByIdAndUpdate(orderId, {
            isRefunded: true
        })

        return {
            message: "Order has been refunded successfully"
        }
    }
}

export default OrderService;
