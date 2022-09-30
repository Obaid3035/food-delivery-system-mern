import mongoose, {Schema} from "mongoose";
import {IItem, IOrder} from "../interface";
import {DELIVERY_TYPE} from "./shop";


export enum ORDER_STATUS {
    UNDER_APPROVAL = "under-approval",
    IN_PROGRESS = "in-progress",
    REJECTED = "rejected",
    COMPLETED = "completed"
}

const ItemSchema: Schema<IItem> = new Schema({
    itemName: {
        type: Schema.Types.String,
    },
    itemPrice: {
        type: Schema.Types.Number
    },
    itemTime: {
        type: Schema.Types.String,
    },
    quantity: {
        type: Schema.Types.Number
    },
    addOn: [{
        name: Schema.Types.String,
        price: Schema.Types.Number
    }]
})

const OrderSchema: Schema<IOrder> = new Schema({
        customer: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        shop: {
            type: Schema.Types.ObjectId,
            ref: "shop"
        },
        deliveryType: {
            type: String,
            enum: DELIVERY_TYPE,
            required: true,
        },
        items: [ItemSchema],

        totalPrice: {
            required: true,
            type: Schema.Types.Number
        },
        orderBill: {
            required: true,
            type: Schema.Types.Number
        },
        serviceCharge: {
            required: true,
            type: Schema.Types.Number
        },
        notes: {
            type: Schema.Types.String
        },

        isReviewed: {
            type: Boolean,
            required: true,
            default: false,
        },

        orderStatus: {
            type: String,
            enum: ORDER_STATUS,
            required: true,
            default: ORDER_STATUS.UNDER_APPROVAL
        },
        paymentIntentId: {
            required: true,
            type: String,
        },
        isRefunded: {
            type: Boolean,
            required: true,
            default: false
        },
        deliveryAddress: {
            required: true,
            type: String,
        },
        createdAt: {type: Date, default: Date.now}
    }
);

const Order = mongoose.model('order', OrderSchema);

export default Order;
