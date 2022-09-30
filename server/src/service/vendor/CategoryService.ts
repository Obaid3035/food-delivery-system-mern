import { Service } from 'typedi';
import Category from '../../model/category';
import { ICategory, IProduct, IResponseMessage } from '../../interface';
import { BadRequest } from '../../lib/errorCode';
import Product from '../../model/product';

@Service()
class CategoryService {
   async index(shopId: string, skip: number, limit: number) {
      const categoryPromise = Category.find({
         shop: shopId
      }).select("_id title ").skip(skip).limit(limit)
      const categoryCountPromise = Category.count()
      const [category, categoryCount] = await Promise.all([categoryPromise, categoryCountPromise])
      const formattedCategory = category.map((category:any) => {
         return Object.values(category._doc)
      });

      return {
         formattedCategory,
         categoryCount
      };
   }

   async create(userInput: ICategory, shopId: string) {
      userInput.shop = shopId;
      const category = await Category.create(userInput)
      if (!category) {
         throw new BadRequest("Category cannot be created")
      }
      return {
         message: "Category has been created successfully"
      }
   }

   async show(categoryId: string) {
      const category = await Category.findOne({
         _id: categoryId
      }).select("title")
      if (!category) {
         throw new Error("Category not found")
      }
      return category;
   }

   async update(userInput: ICategory, categoryId: string) {
      await Category.findByIdAndUpdate(categoryId,userInput)
      return {
         message: "Category has been updated successfully"
      }
   }

   async delete(categoryId: string, shopId: string): Promise<IResponseMessage> {
      const products = await Product.find({
         shop: shopId
      })
      if (!products) {
         throw new BadRequest("Shop does not exist");
      }
      const menuType: IProduct = await Category.findById(categoryId);
      if (!menuType) {
         throw new BadRequest("Category On does not exist");
      }
      let found = false
      if (products.length > 0) {
         products.forEach((product) => {
            if (product.category) {
               if (product.category.toString() === categoryId.toString()) {
                  found = true
               }
            }
         })
      }

      if (found) {
         throw new BadRequest("This category is already in use by a product");
      }
      await Category.findByIdAndDelete(categoryId);
      return {
         message: "Category has been deleted successfully"
      }
   }
}
export default CategoryService;
