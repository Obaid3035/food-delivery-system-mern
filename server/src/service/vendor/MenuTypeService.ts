import { Service } from 'typedi';
import MenuType from '../../model/menuType';
import { IMenuType, IProduct } from '../../interface';
import { BadRequest } from '../../lib/errorCode';
import Product from '../../model/product';

@Service()
class MenuTypeService {
   async index(shopId: string, skip: number, limit: number) {
      const menuTypePromise = MenuType.find({
         shop: shopId
      }).select("_id title ").skip(skip).limit(limit)

      const menuTypeCountPromise = MenuType.count()
      const [menuType, menuTypeCount] = await Promise.all([menuTypePromise, menuTypeCountPromise])
      const formattedMenuTypes = menuType.map((menuType:any) => {
         return Object.values(menuType._doc)
      });

      return {
         formattedMenuTypes,
         menuTypeCount
      }
   }

   async show(menuTypeId: string) {
      const menuType = await MenuType.findOne({
         _id: menuTypeId
      })
      return menuType;
   }
   async create(userInput: IMenuType, shopId: string) {
      userInput.shop = shopId
      await MenuType.create(userInput)
      return {
         message: "MenuType has been created successfully"
      }
   }

   async update(userInput: IMenuType, menuTypeId: string) {
      const menuType = await MenuType.findByIdAndUpdate(menuTypeId, userInput)
      if (!menuType) {
         throw new BadRequest("MenuType cannot be updated")
      }
      return {
         message: "MenuType has been updated successfully"
      }
   }

   async delete(shopId: string, menuTypeId: string) {
      const products = await Product.find({
         shop: shopId
      })
      let found = false
      const menuType : IProduct = await MenuType.findById(menuTypeId);
      if (!menuType) {
         throw new BadRequest("MenuType does not exist");
      }
      if (products.length > 0) {
         products.forEach((product) => {
            if (product.menuType) {
               if (product.menuType.toString() === menuTypeId.toString()) {
                  found = true
               }
            }
         })
      }
      if (found) {
         throw new BadRequest("This menu type is already in use by a product")
      }
      await MenuType.findByIdAndDelete(menuTypeId);
      return {
         message: "MenuType has been successfully deleted"
      }
   }
}

export default MenuTypeService;
