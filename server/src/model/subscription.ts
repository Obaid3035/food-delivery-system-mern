import mongoose, {Schema} from "mongoose";
import {ISubscription} from "../interface";


const SubscriptionSchema: Schema<ISubscription> = new Schema({
        vendor: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        status: {
            type: String,
            required: true
        },
        subscriptionId: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    }
);

const Subscription = mongoose.model('subscription', SubscriptionSchema);

export default Subscription;

