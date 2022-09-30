import moment from "moment";
import {ICoordinates, IUser} from "../interface";
import jwt from "jwt-decode"
import CryptoJS from "crypto-js";

export const quilModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean'],
        [{ 'align': [] }],
        ['code-block']
    ],
};

export const quilFormats = [
    'header',
    'font',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'align',
    'code-block'
];
export const autocompletionRequest: any = {
    bounds: [
        {lat: 50, lng: 50},
        {lat: 100, lng: 100}
    ],
    componentRestrictions: {
        country: ['uk'],
    }
}

export const TOKEN = "token";

export const PAGINATION_LIMIT = 6;

export function getTokenFormat () {
    const token = localStorage.getItem(TOKEN);
    if (token) {
        return  { headers: { "Authorization": `Bearer ${token}` } }
    }
}



export function timeFormat(time: string): string {
    let hours, minutes;
    if (moment(time).get("hours").toString().length === 1) {
        hours = `0${moment(time).get("hours").toString()}`
    } else {
        hours = `${moment(time).get("hours").toString()}`
    }
    if (moment(time).get("minutes").toString().length === 1) {
        minutes = `0${moment(time).get("minutes").toString()}`
    } else {
        minutes = `${moment(time).get("minutes").toString()}`
    }
    return `${hours}:${minutes}`
}

export function role_symbol(role: string) {
    const token = localStorage.getItem(TOKEN);
    if (!token) return false;
    const decode: { user: IUser } = jwt(token);
    return decode.user.role === role;
}


export function storeEncryptedCartItems(cart: any) {
    const cipherCart = CryptoJS.AES.encrypt(JSON.stringify(cart), 'my-secret-key@123').toString();
    localStorage.setItem("cart", cipherCart)
}

export function getDecryptedCartItems() {
    const cart = localStorage.getItem("cart")
    if (!cart) {
        return {
            deliveryType: "",
            cart: []
        }
    }
    const bytes = CryptoJS.AES.decrypt(cart, 'my-secret-key@123');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}


export function arePointsNear(checkPoint: ICoordinates, centerPoint: ICoordinates, km: number) {
    const ky = 40000 / 360;
    const kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    const dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    const dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}
