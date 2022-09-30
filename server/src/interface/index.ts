import {Router, Request} from "express";
import {DELIVERY_TYPE, SHOP_STATUS} from "../model/shop";
import {SchemaDefinitionProperty} from "mongoose";
import {ORDER_STATUS} from "../model/order";
import { USER_ROLE } from '../model/user';

export interface IController {
    path: string,
    router: Router
}

export interface IUser {
    _id?: string,
    damn: string,
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    shop: SchemaDefinitionProperty<string>,
    profileSetup: boolean,
    subscriptionSetup: boolean,
    role: USER_ROLE,
    location: ICoordinates
    postalCode: string,
    address: string,
    accountProfile: boolean,
    paymentMethod: boolean,
    verificationDocument: ICloudinary,
    isDocumentSent: boolean,
    stripeCustomerId: string,
    paymentId: string
    generateToken(): string
}

export interface ICloudinary {
    avatar: string,
    cloudinary_id: string
}

export interface IShop {
    _id?: string,
    shopName: string,
    shopStatus: SHOP_STATUS,
    shopVisibility: boolean,
    deliveryType: DELIVERY_TYPE,
    slug: string,
    avgRating: number,
    noOfReviews: number,
    reviews?: SchemaDefinitionProperty<string>[],
    shopImage: ICloudinary
    shopBannerImage: ICloudinary
    description: string,
    location: {
        type?: string,
        coordinates: number[]
    },
    address: string,
    postalCode: string,
    accountId: string,
}

export interface IProduct {
    productName: string,
    productInfo: string
    productPicture: ICloudinary
    cookingTime: Date,
    category: SchemaDefinitionProperty<string>,
    addOn: SchemaDefinitionProperty<string>[]
    menuType: SchemaDefinitionProperty<string>,
    shop: SchemaDefinitionProperty<string>,
    allergyInfo: string,
    productPrice: number
}

export interface IReview {
    _id?:string,
    customer: SchemaDefinitionProperty<string>,
    rating: number,
    comment: string,
    shop: SchemaDefinitionProperty<string>,
}

export interface IOrder {
    _id?:string,
    customer: SchemaDefinitionProperty<string>,
    shop: SchemaDefinitionProperty<string>,
    deliveryType: DELIVERY_TYPE,
    totalPrice: number,
    orderBill: number,
    serviceCharge: number,
    notes: string,
    isReviewed: boolean,
    orderStatus: ORDER_STATUS,
    paymentIntentId: string,
    isRefunded: boolean,
    deliveryAddress: string,
    createdAt: Date

    items: [IItem]
}

export interface IItem {
    _id ?: string,
    itemName: string,
    itemPrice: number,
    itemTime: string,
    quantity: number,
    addOn: [IItemAddOn],

}

export interface IItemAddOn {
    name: string,
    price: number
}

export interface IMenuType {
    _id ?: string,
    title: string,
    shop: SchemaDefinitionProperty<string>,
}

export interface ISubscription {
    _id ?: string,
    vendor: SchemaDefinitionProperty<string>,
    status: string,
    subscriptionId: string
}

export interface ICategory {
    _id ?: string,
    title: string,
    shop: SchemaDefinitionProperty<string>,
}

export interface IAddOn {
    _id ?: string,
    title: string,
    shop: SchemaDefinitionProperty<string>,
    addOn: IItemAddOn[]
}

export interface IUserResponse {
    token: string
}

export interface IResponseMessage {
    message: string
}

export interface IRequest extends Request{
    user: IUser
}

export interface ICoordinates {
    lat: string,
    lng: string
}

export interface IUploadMultiple {
    shopImage: [{
        path: string
    }],
    shopBannerImage: [{
        path: string
    }],
}
