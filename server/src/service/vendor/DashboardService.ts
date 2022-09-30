import {Service} from 'typedi';
import moment from 'moment';
import Order, {ORDER_STATUS} from '../../model/order';
import {checkIfNull} from '../../lib/helper';
import mongoose from "mongoose";

@Service()
class DashboardService {
    async Sales(shopId: string) {
        const dailySalesPromise = Order.aggregate([
            {
                $match: {
                    orderStatus: ORDER_STATUS.COMPLETED,
                    shop: new mongoose.Types.ObjectId(shopId),
                    createdAt: {
                        $gte: moment().utc(false).startOf('day').toDate(),
                        $lt: moment().utc(false).endOf('day').toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$totalPrice',
                    },
                },
            },
        ]);
        const weeklySalesPromise = Order.aggregate([
            {
                $match: {
                    orderStatus: ORDER_STATUS.COMPLETED,
                    shop: new mongoose.Types.ObjectId(shopId),
                    createdAt: {
                        $gte: moment().utc(false).startOf('week').toDate(),
                        $lt: moment().utc(false).endOf('week').toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$totalPrice',
                    },
                },
            },
        ]);
        const monthlySalesPromise = Order.aggregate([
            {
                $match: {
                    orderStatus: ORDER_STATUS.COMPLETED,
                    shop: new mongoose.Types.ObjectId(shopId),
                    createdAt: {
                        $gte: moment().utc(false).startOf('month').toDate(),
                        $lt: moment().utc(false).endOf('month').toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$totalPrice',
                    },
                },
            },
        ]);
        const dailyOrderCountPromise = Order.find({
            shop: new mongoose.Types.ObjectId(shopId),
            createdAt: {
                $gte: moment().utc(false).startOf('day').toDate(),
                $lt: moment().utc(false).endOf('day').toDate(),
            },
        }).count();
        const pendingOrdersCountPromise = Order.find({
            orderStatus: ORDER_STATUS.IN_PROGRESS,
            shop: new mongoose.Types.ObjectId(shopId),
        }).count();
        const completedOrdersCountPromise = Order.find({
            orderStatus: ORDER_STATUS.COMPLETED,
            shop: new mongoose.Types.ObjectId(shopId),
        }).count();
        const latestOrdersPromise = Order.find({
            shop: shopId
        })
            .select("orderStatus")
            .populate("customer", "name email phoneNumber")
            .sort({createdAt: -1}).limit(10)
        const latestOrdersCountPromise = Order.find({
            shop: shopId
        })
            .sort({createdAt: -1})
            .limit(10).count()

        const [
            dailySales,
            weeklySales,
            monthlySales,
            dailyOrderCount,
            pendingOrdersCount,
            completedOrdersCount,
            latestOrders,
            latestOrdersCount
        ] = await Promise.all([
            dailySalesPromise,
            weeklySalesPromise,
            monthlySalesPromise,
            dailyOrderCountPromise,
            pendingOrdersCountPromise,
            completedOrdersCountPromise,
            latestOrdersPromise,
            latestOrdersCountPromise
        ]);


        const formattedLatestOrder = latestOrders.map((order: any) => {
            let obj = {
                name: order.customer.name,
                email: order.customer.email,
                phoneNumber: order.customer.phoneNumber,
                status: order.orderStatus
            }
            return Object.values(obj)
        })

        let notNilledDailySales = checkIfNull(dailySales, 'sum');
        let notNilledWeeklySales = checkIfNull(weeklySales, 'sum');
        let notNilledMonthlySales = checkIfNull(monthlySales, 'sum');

        return {
            dailySales: notNilledDailySales,
            weeklySales: notNilledWeeklySales,
            monthlySales: notNilledMonthlySales,
            dailyOrderCount,
            pendingOrdersCount,
            completedOrdersCount,
            formattedLatestOrder,
            latestOrdersCount
        };
    }
}

export default DashboardService;
