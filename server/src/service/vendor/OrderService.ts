import {Service} from 'typedi';
import Order, {ORDER_STATUS} from '../../model/order';
import {BadRequest} from "../../lib/errorCode";
import User from "../../model/user";
import {sendOrderApprovedMail, sendOrderReadyMail, sendOrderRejectedMail} from "../../lib/emailService/email";


function returnInstance(order: any) {
    return {
        _id: order._id,
        name: order.customer.name,
        deliveryType: order.deliveryType,
        phoneNumber: order.customer.phoneNumber,
        notes: order.notes,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
    }
}


@Service()
class OrderService {

    async toCompletedOrder(orderId: string) {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            orderStatus: ORDER_STATUS.COMPLETED,
        });
        const customer = await User.findById(updatedOrder.customer)
        await sendOrderReadyMail(customer.email);
        return {
            message: "Order is now completed"
        }
    }

    async toRejectedOrder(orderId: string) {
        const updatedOrder =  await Order.findByIdAndUpdate(orderId, {
            orderStatus: ORDER_STATUS.REJECTED,
        });
        const customer = await User.findById(updatedOrder.customer)
        await sendOrderRejectedMail(customer.email);
        return {
            message: "Order is now rejected"
        }
    }

    async toAcceptedOrder(orderId: string) {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            orderStatus: ORDER_STATUS.IN_PROGRESS,
            createdAt: Date.now()
        });
        const customer = await User.findById(updatedOrder.customer)
        await sendOrderApprovedMail(customer.email)
        return {
            message: "Order is now in progress"
        }
    }

    async show(orderId: string) {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new BadRequest("Order not found")
        }
        return order

    }

    async allOrders(
        shopId: string,
        skip: number,
        limit: number
    ){

        const allOrdersPromise = Order.find({
            shop: shopId,
        }).populate("customer", "name phoneNumber").skip(skip).limit(limit);

        const allOrdersCountPromise = Order.find({
            shop: shopId,
        }).count();

        const [allOrders, allOrdersCount] = await Promise.all([allOrdersPromise, allOrdersCountPromise])

        const formattedAllOrders = allOrders.map((order: any) => {
            return Object.values(returnInstance(order))
        })

        return {
            formattedAllOrders,
            allOrdersCount
        }

    }

    async underApprovalOrders(
        shopId: string,
        skip: number,
        limit: number
    ) {
        const underApprovalOrdersPromise = Order.find({
            shop: shopId,
            orderStatus: ORDER_STATUS.UNDER_APPROVAL,
        }).populate("customer", "name phoneNumber").skip(skip).limit(limit);

        const underApprovalOrdersCountPromise = Order.find({
            shop: shopId,
            orderStatus: ORDER_STATUS.UNDER_APPROVAL,
        }).count();



        const [underApprovalOrders, underApprovalOrdersCount] = await Promise.all([underApprovalOrdersPromise, underApprovalOrdersCountPromise])

        const formattedUnderApprovalOrders = underApprovalOrders.map((order: any) => {
            return Object.values(returnInstance(order))
        })

        return {
            formattedUnderApprovalOrders,
            underApprovalOrdersCount
        }
    }

    async inProgressOrders(
        shopId: string,
        skip: number,
        limit: number
    ) {
        const inProgressOrdersPromise = Order.find({
            shop: shopId,
            orderStatus: ORDER_STATUS.IN_PROGRESS,
        }).populate("customer", "name phoneNumber").skip(skip).limit(limit);

        const inProgressOrdersCountPromise = Order.find({
            shop: shopId,
            orderStatus: ORDER_STATUS.IN_PROGRESS,
        }).count();

        const [inProgressOrders, inProgressOrdersCount] = await Promise.all([inProgressOrdersPromise, inProgressOrdersCountPromise])

        const formattedInProgressOrders = inProgressOrders.map((order: any) => {
            return Object.values(returnInstance(order))
        })

        return {
            formattedInProgressOrders,
            inProgressOrdersCount
        }
    }

    async completedOrders(
        shopId: string,
        skip: number,
        limit: number
    ) {
        const completedOrdersPromise = Order.find({
            shop: shopId,
            orderStatus: ORDER_STATUS.COMPLETED,
        }).populate("customer", "name phoneNumber").skip(skip).limit(limit);

        const completedOrdersCountPromise = Order.find({
            shop: shopId,
            orderStatus: ORDER_STATUS.COMPLETED,
        }).count();

        const [completedOrders, completedOrdersCount] = await Promise.all([completedOrdersPromise, completedOrdersCountPromise])

        const formattedCompletedOrders = completedOrders.map((order: any) => {
            return Object.values(returnInstance(order))
        })

        return {
            formattedCompletedOrders,
            completedOrdersCount
        }
    }

    async rejectedOrders(
        shopId: string,
        skip: number,
        limit: number
    ) {
        const rejectedOrdersPromise = Order.find({
            shop: shopId,
            orderStatus: ORDER_STATUS.REJECTED,
        }).populate("customer", "name phoneNumber").skip(skip).limit(limit);

        const rejectedOrdersCountPromise = Order.find({
            shop: shopId,
            orderStatus: ORDER_STATUS.REJECTED,
        }).count();

        const [rejectedOrders, rejectedOrdersCount] = await Promise.all([rejectedOrdersPromise, rejectedOrdersCountPromise])

        const formattedRejectedOrders = rejectedOrders.map((order: any) => {
            return Object.values(returnInstance(order))
        })

        return {
            formattedRejectedOrders,
            rejectedOrdersCount
        }
    }
}

export default OrderService;
