import mongoose, {Model, Schema} from 'mongoose';
import slugify from 'slugify';
import {IShop} from '../interface';
import cloudinary from '../lib/cloudinary';
import {BadRequest} from '../lib/errorCode';

export enum SHOP_STATUS {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked',
    FEATURED = 'featured',
}

export enum DELIVERY_TYPE {
    LOCAL_DELIVERY = "local-delivery",
    POSTAL_DELIVERY = "postal-delivery",
    PICKUP = "pickUp",
    BOTH = "both"
}

interface ShopModel extends Model<IShop> {
    uploadImages(shopImagePath: string, shopBannerImagePath: string): Promise<{
        uploadShopImage: any
        uploadedShopBannerImage: any
    }>;

    deleteImages(shopImagePath: string, shopBannerImagePath: string): Promise<void>

    shopExists(shopName: string): Promise<void>;
}

const geoSchema = new Schema({
    type: {
        type: String,
        default: 'Point',
    },
    coordinates: {
        type: [Number],
    },
});

const ShopSchema: Schema<IShop> = new Schema(
    {
        shopName: {
            type: String,
            required: true,
        },
        shopStatus: {
            type: String,
            enum: SHOP_STATUS,
            required: true,
            default: SHOP_STATUS.INACTIVE,
        },
        shopVisibility: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveryType: {
            type: String,
            enum: DELIVERY_TYPE,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        avgRating: {
            type: Number,
            required: true,
            default: 0,
        },
        noOfReviews: {
            type: Number,
            required: true,
            default: 0,
        },

        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'review',
            },
        ],

        shopImage: {
            avatar: String,
            cloudinary_id: String
        },

        shopBannerImage: {
            avatar: String,
            cloudinary_id: String
        },

        description: {
            type: String,
            required: true,
        },

        location: {
            type: geoSchema,
            index: '2dsphere',
        },

        address: {
            type: String,
            required: true,
        },

        postalCode: {
            type: String,
            required: true,
        },
        accountId: {
            type: String
        },
    },
    {
        timestamps: true,
    }
);

ShopSchema.index({location: '2dsphere'});

ShopSchema.pre('validate', function (next) {
    const shop = this;

    if (shop.shopName) {
        shop.slug = slugify(shop.shopName, {lower: true, strict: true});
    }

    next();
});

ShopSchema.statics.uploadImages = async function (shopImagePath, shopBannerImagePath) {
    const uploadShopImagePromise = cloudinary.v2.uploader.upload(
        shopImagePath
    );
    const uploadedShopBannerImagePromise = cloudinary.v2.uploader.upload(
        shopBannerImagePath
    );
    const [uploadShopImage, uploadedShopBannerImage] = await Promise.all([
        uploadShopImagePromise,
        uploadedShopBannerImagePromise,
    ]);

    return {
        uploadShopImage,
        uploadedShopBannerImage
    }
}

ShopSchema.statics.deleteImages = async function (shopImagePath, shopBannerImagePath) {
    const deleteShopImagePromise = cloudinary.v2.uploader.destroy(
        shopImagePath
    );
    const deleteShopBannerPromise = cloudinary.v2.uploader.destroy(
        shopBannerImagePath
    );
    await Promise.all([deleteShopImagePromise, deleteShopBannerPromise]);
    throw new Error('Something went wrong');
}

ShopSchema.statics.shopExists = async function (shopName: string) {
    const slug = slugify(shopName, {lower: true, strict: true});
    const isShopExists = await Shop.findOne({
        slug
    })
    if (isShopExists) {
        throw new BadRequest("Sorry this shop name already exists")
    }
}

const Shop = mongoose.model<IShop, ShopModel>('shop', ShopSchema);

export default Shop;
