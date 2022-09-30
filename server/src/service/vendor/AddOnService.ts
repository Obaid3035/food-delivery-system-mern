import { Service } from 'typedi';
import { IAddOn, IProduct } from '../../interface';
import AddOn from '../../model/addOn';
import { BadRequest } from '../../lib/errorCode';
import Product from '../../model/product';

@Service()
class AddOnService {

   async index(shopId: string,  skip: number, limit: number) {
      const addOnsPromise = AddOn.find({
         shop: shopId
      }).select("title addOn").skip(skip).limit(limit);
      const addOnCountPromise = AddOn.find({
          shop: shopId
      }).count()

       const [addOns, addOnCount] = await Promise.all([addOnsPromise, addOnCountPromise])
       const formattedAddOns = addOns.map((addOnItem:any) => {
           const addOns = addOnItem.addOn.map((addOn: any) => {
               return [`${addOn.name} = `, `${addOn.price}, `]
           })
           const AddOnObject = {
               _id: addOnItem._id,
               title: addOnItem.title,
               addOn: addOns
           }
           return Object.values(AddOnObject)
       });
      return {
          formattedAddOns,
          addOnCount
      };
   }

   async show(addOnId: string) {
      const addOn = await AddOn.findById(addOnId).select("title addOn")
      if (!addOn) {
         throw new BadRequest("Add On does not exist")
      }
      return addOn
   }
   async create(userInput: IAddOn, shopId: string) {
      userInput.shop = shopId;
      const addOn = await AddOn.create(userInput)
      if (!addOn) {
         throw new Error("Something went wrong")
      }
      return {
         message: "AddOn has been created successfully"
      }
   }
   async update(userInput: IAddOn, addOnId: string) {
      const addOn = await AddOn.findByIdAndUpdate(addOnId, userInput)
      if (!addOn) {
         throw new BadRequest("Add On cannot be updated");
      }
      return {
         message: "Add On has been updated successfully"
      }
   }
   async delete(shopId: string, addOnId: string) {
     let found = false
      const products = await Product.find({
         shop: shopId
      })
      if (!products) {
         throw new BadRequest("ProductSection does not exist");
      }
      const addOn: IProduct = await AddOn.findById(addOnId);
      if (!addOn) {
         throw new BadRequest("Add On does not exist");
      }
      if (products.length > 0) {
         products.forEach((product) => {
            product.addOn.forEach((shopAddOnId) => {
               if (addOnId.toString() === shopAddOnId.toString()) {
                  found = true
               }
            })
         })
      }
      if (found) {
         throw new BadRequest("This addon is already in use by a product");
      }
      await AddOn.findByIdAndDelete(addOnId);
      return {
         message: "AddOn has been successfully deleted"
      }
   }
}

export default AddOnService;
