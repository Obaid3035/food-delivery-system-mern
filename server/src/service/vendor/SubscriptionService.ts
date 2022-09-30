import {Service} from "typedi";
import Stripe from "stripe";
import User from "../../model/user";
import Subscription from "../../model/subscription";
// @ts-ignore
const stripe = Stripe(process.env.STRIPE_API_KEY)

@Service()
class SubscriberService {
    async subscribe(userId: string, stripeToken: string, priceId: string) {
        const vendor = await User.findById(userId);

        if (!vendor.stripeCustomerId) {
            const stripeCustomer = await stripe.customers.create({
                email: vendor.email,
                source: stripeToken
            });
            const subscribePromise = stripe.subscriptions.create({
                customer: stripeCustomer.id,
                items: [
                    {
                        price: priceId
                    }
                ]
            })
            const userUpdatePromise = User.findByIdAndUpdate(userId, {
                subscriptionSetup: true
            });

            const [subscribe] = await Promise.all([subscribePromise, userUpdatePromise])
            const subscription = await Subscription.findOneAndUpdate({
                vendor: vendor.id,
            }, {
                status: "ACTIVE",
                subscriptionId: subscribe.id
            })

            if (!subscription) {
                await Subscription.create({
                    vendor: vendor.id,
                    status: "ACTIVE",
                    subscriptionId: subscribe.id
                })
            }


            const user = await User.findById(userId);
            const token = await user.generateToken();

            return {
                message: "Standard package successfully created!",
                token
            }

        }

        const subscribePromise = stripe.subscriptions.create({
            customer: vendor.stripeCustomerId,
            items: [
                {
                    price: priceId
                }
            ]
        })

        const userUpdatePromise = User.findByIdAndUpdate(userId, {
            subscriptionSetup: true
        });

        const [subscribe] = await Promise.all([subscribePromise, userUpdatePromise])

        await Subscription.create({
            vendor: vendor.id,
            status: "ACTIVE",
            subscriptionId: subscribe.id
        })
        const user = await User.findById(userId);
        const token = await user.generateToken();
        return {
            message: "Standard package successfully created!",
            token
        }
    }

    async show(userId: string, email: string) {
        const userSubscription = await Subscription.findOne({
            vendor: userId,
            status: "ACTIVE"
        })

        if (!userSubscription) {
            throw new Error("Subscription not found")
        }
        const subscription = await stripe.subscriptions.retrieve(
            userSubscription.subscriptionId
        );

        const invoice = await stripe.invoices.retrieve(
            subscription.latest_invoice
        );

        return {
            package: subscription.plan.interval,
            amount: subscription.plan.amount / 100,
            status: subscription.status,
            email,
            amount_paid: invoice.amount_paid / 100,
            period_start: invoice.period_start,
            total: invoice.total / 100
        }
    }

    async cancelSubscription(userId: string) {
        const userSubscription = await Subscription.findOne({
            vendor: userId
        })

        if (!userSubscription) {
            throw new Error("Subscription not found")
        }
        const subscription = await stripe.subscriptions.retrieve(
            userSubscription.subscriptionId
        );

        if (!subscription) {
            throw new Error("Subscription not found")
        }
        const deleted = await stripe.subscriptions.del(
            subscription.id
        );

        if (!deleted) {
            throw new Error("Subscription cannot be cancelled")
        }

        const subscriptionUpdatePromise = Subscription.findByIdAndUpdate(userSubscription, {
            status: "CANCELLED",
        })

        const userUpdatePromise = User.findByIdAndUpdate(userId, {
            subscriptionSetup: false
        });
        await Promise.all([subscriptionUpdatePromise, userUpdatePromise])
        const user = await User.findById(userId);
        const token = await user.generateToken();
        return {
            message: "Subscription cancelled successfully!",
            token
        }
    }
}

export default SubscriberService;
