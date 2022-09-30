import mongoose, {Model, Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {IUser} from "../interface";
import {UnAuthorized} from '../lib/errorCode';
import Stripe from "stripe";
// @ts-ignore
const stripe = Stripe(process.env.STRIPE_API_KEY)


interface UserModel extends Model<IUser> {
    userExist(email: string): Promise<boolean>,
    verify(token: string): Promise<{ _id: string }>
    authenticate(credentials: object): Promise<IUser>,
    setUpConnectAccountLink(accountId: string): Promise<any>
}

export enum USER_ROLE {
    CUSTOMER = "customer",
    VENDOR = "vendor",
    ADMIN = "admin"
}


const UserSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true
    },

    shop: {
        type: Schema.Types.ObjectId,
        ref: "shop"
    },
    profileSetup: {
        type: Boolean,
        required: true,
        default: false
    },
    subscriptionSetup: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        enum: USER_ROLE,
        required: true
    },
    location: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    },
    postalCode: {
        type: String
    },
    address: {
        type: String
    },
    accountProfile: {
        type: Boolean,
    },
    paymentMethod: {
        type: Boolean,
        required: true,
        default: false
    },

    verificationDocument: {
        avatar: String,
        cloudinary_id: String
    },
    isDocumentSent: {
        type: Boolean,
        default: false
    },
    stripeCustomerId: {
        type: String
    },
    paymentId: {
        type: String
    },
});

UserSchema.pre("save", async function (next) {
    const user = this;
    if (user.password && user.isNew) {
        this.password = await bcrypt.hash(user.password, 10)
        next()
    }
})

UserSchema.statics.userExist = async function (email) {
    const user = await User.findOne({email: email.toLowerCase()});
    if (user) {
        throw new UnAuthorized('User already exist');
    }
    return true;
}

UserSchema.statics.verify = async function (token) {
    const decode = <any> jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
        _id: decode.user._id,
    })
    if (!user) {
        throw new UnAuthorized("Session expired")
    }
}


UserSchema.statics.authenticate = async function (credentials) {
    const user = await User.findOne({
        email: credentials.email.toLowerCase(),
        role: credentials.role
    });

    if (!user) {
        throw new UnAuthorized('Unable to login. Please registered yourself');
    }
    const isMatch = await bcrypt.compare(credentials.password, user.password);

    if (!isMatch) {
        throw new UnAuthorized('Email or Password is incorrect');
    }
    return user;
}

UserSchema.statics.setUpConnectAccountLink = async function (accountId: string) {
    return await stripe.accountLinks.create({
        account: accountId,
        refresh_url: 'https://snakrs-client.herokuapp.com/vendor/dashboard/',
        return_url: 'https://snakrs-client.herokuapp.com/vendor/dashboard/',
        type: 'account_onboarding',
    })
}

UserSchema.methods.generateToken = async function () {
    const user = this;
    delete user.password
    return jwt.sign({user}, process.env.JWT_SECRET);
}

const User = mongoose.model<IUser, UserModel>('user', UserSchema);

export default User;
