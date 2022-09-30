import {Service} from "typedi";
import Shop from "../../model/shop";
import cloudinary from "../../lib/cloudinary";
import {BadRequest} from "../../lib/errorCode";


@Service()
class GalleryService {
    async index(shopId: string) {
        const shopImage = await Shop.findById(shopId).select("shopImage shopBannerImage")
        return shopImage;
    }

    async updateMainImage(shopId: string, mainImagePath: string) {
        const shopImage = await Shop.findById(shopId).select('shopImage');
        const deletedMainImage = await cloudinary.v2.uploader.destroy(
            shopImage.shopImage.cloudinary_id
        );
        if(!deletedMainImage) {
            throw new BadRequest("Gallery cannot be updated");
        }

        const uploadedShopImage = await cloudinary.v2.uploader.upload(mainImagePath);
        if (!uploadedShopImage) {
            throw new BadRequest("Gallery cannot be updated");
        }
        await Shop.findByIdAndUpdate(shopId, {
            shopImage: {
                avatar: uploadedShopImage.secure_url,
                cloudinary_id: uploadedShopImage.public_id
            },
        })

        return {
            message: "Main Image updated successfully"
        }
    }

    async uploadBannerImage (shopId: string, bannerImagePath: string) {
        const shopImage = await Shop.findById(shopId).select('shopBannerImage');
        const deletedMainImage = await cloudinary.v2.uploader.destroy(
            shopImage.shopBannerImage.cloudinary_id
        );
        if(!deletedMainImage) {
            throw new BadRequest("Gallery cannot be updated");
        }

        const uploadedShopImage = await cloudinary.v2.uploader.upload(bannerImagePath);
        if (!uploadedShopImage) {
            throw new BadRequest("Gallery cannot be updated");
        }
        await Shop.findByIdAndUpdate(shopId, {
            shopBannerImage: {
                avatar: uploadedShopImage.secure_url,
                cloudinary_id: uploadedShopImage.public_id
            },
        })
        return {
            message: "Banner Image updated successfully"
        }
    }
}

export default GalleryService
