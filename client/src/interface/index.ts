import {USER_ROLE} from "../App";

export interface IAuthInput {
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    postalCode: string,
    address: string
    role: string
}

export enum SHOP_STATUS {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked',
    FEATURED = 'featured',
}

export interface IUser {
    _id?: string,
    name: string,
    email: string,
    password: string,
    shopStatus: SHOP_STATUS,
    phoneNumber: string,
    profileSetup: boolean,
    subscriptionSetup: boolean,
    role: USER_ROLE,
    shop: string,
    location: ICoordinates
    postalCode: string,
    address: string,
    accountProfile: boolean,
    paymentMethod: boolean,
    verificationDocument: string,
    isDocumentSent: boolean,
    accountId: string,
    personId: string,
    paymentId: string
}

export interface ICoordinates {
    lat: number,
    lng: number
}

export interface IError {
    response: {
        data: {
            status: string,
            message: string
        }
    }
}

interface IShop {
    _id?: string,
    shopName: string,
    description: string,
    address: string,
    postalCode: string,
    deliveryType: {
        value: string,
        label: string
    },
    location: {
        coordinates: [number, number]
    }
}
export interface IShopClient extends IShop{
    shopImage: {
        avatar: string
    },
    shopBannerImage: {
        avatar: string
    },
    avgRating: number,
    slug: string
}

export interface IShopInput extends IShop {
    shopVisibility: boolean,
    shopImage: [File],
    shopBannerImage: [File],
}
export interface ISelect {
    value: string,
    label: string
}


export interface IReview {
    _id?:string,
    customer: IUser
    rating: number,
    comment: string,
    shop: IShop
}
