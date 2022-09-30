import { Service } from 'typedi';
import cloudinary from '../../lib/cloudinary';
import { BadRequest } from '../../lib/errorCode';
import Product from '../../model/product';
import Category from "../../model/category";
import AddOn from "../../model/addOn";
import MenuType from "../../model/menuType";


const getSelectOptions = (resource: { _id: string, title: string}[]) => {
   return resource.map((item) => {
      return {
         label: item.title,
         value: item._id
      }

   })
}

@Service()
class ProductService {
   async index(shopId: string) {
      const productPromise = Product.find({
         shop: shopId
      }).select("productName productPicture cookingTime productPrice menuType").populate("menuType");
      const productCountPromise = Product.count()

      const [product, productCount] = await Promise.all([productPromise, productCountPromise]);
      return {
         product,
         productCount
      };
   }

   async create(userInput: any, shopId: string, productImagePath: string) {
      userInput.addOn = JSON.parse(userInput.addOn);
      userInput.shop = shopId;
      const productPicture = await cloudinary.v2.uploader.upload(productImagePath);
      userInput.productPicture = {
         avatar: productPicture.secure_url,
         cloudinary_id: productPicture.public_id
      }

      if (!productPicture) {
         throw new BadRequest("ProductSection cannot be created")
      }

      const product = await Product.create(userInput);
      if (!product) {
         await cloudinary.v2.uploader.destroy(
            userInput.cloudinary_id
         );
         throw new BadRequest("ProductSection cannot be created")
      }

      return {
         message: "ProductSection has been created successfully"
      }
   }

   async update(userInput: any, productId: string, productImagePath: { path: string}, shopId: string) {
      const prevProduct = await Product.findById(productId)
      if (!prevProduct) {
         throw new BadRequest("ProductSection cannot be updated")
      }
      userInput.addOn = JSON.parse(userInput.addOn);
      userInput.shop = shopId;

      if (productImagePath) {
         const deletedProductImage = await cloudinary.v2.uploader.destroy(
            prevProduct.productPicture.cloudinary_id
         );
         if(!deletedProductImage) {
            throw new BadRequest("ProductSection cannot be updated");
         }
         const productPicture = await cloudinary.v2.uploader.upload(productImagePath.path);
         if (!productPicture) {
            throw new BadRequest("ProductSection cannot be updated");
         }
         userInput.productPicture = {
            avatar: productPicture.secure_url,
            cloudinary_id: productPicture.public_id
         }
      }else {
         delete userInput.productPicture
      }

      const product = await Product.findByIdAndUpdate(productId, userInput);
      if (!product) {
         await cloudinary.v2.uploader.destroy(productImagePath.path);
         throw new BadRequest("ProductSection cannot be updated");
      }
      return {
         message: "ProductSection updated successfully"
      }
   }

   async show(productId: string) {
      const product = await Product.findById(productId).populate("menuType category addOn");
      if (!product) {
         throw new BadRequest("ProductSection not found");
      }
      return product;
   }

   async getMenuOptions(shopId: string) {
      const categoriesPromise = Category.find({
         shop: shopId
      }).select("title")
      const addOnsPromise = AddOn.find({
         shop: shopId
      }).select("title")

      const menuTypesPromise = MenuType.find({
         shop: shopId
      }).select("title")
      const [categories, addOns, menuTypes] = await Promise.all([categoriesPromise, addOnsPromise, menuTypesPromise])

      const categoryOption = getSelectOptions(categories);
      const addOnOption = getSelectOptions(addOns);
      const menuTypeOption = getSelectOptions(menuTypes)

      return {
         category: categoryOption,
         addOn: addOnOption,
         menuType: menuTypeOption
      }
   }

   async delete(productId: string) {
      const prevProduct = await Product.findById(productId)
      if (!prevProduct) {
         throw new BadRequest("ProductSection cannot be updated")
      }
      const deletedProductImage = await cloudinary.v2.uploader.destroy(
         prevProduct.productPicture.cloudinary_id
      );
      if(!deletedProductImage) {
         throw new BadRequest("ProductSection cannot be updated");
      }
      await Product.findByIdAndDelete(productId);
      return {
         message: "ProductSection deleted successfully"
      }
   }


}

export default ProductService;
