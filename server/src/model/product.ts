import mongoose, { Schema } from "mongoose";
import { IProduct } from '../interface';



const ProductSchema: Schema<IProduct> = new Schema({
	productName: {
		type: String,
		required: true
	},
	productInfo: {
		type: String,
		required: true
	},
	productPicture: {
		avatar: {
			type: String,
			required: true
		},
		cloudinary_id: {
			type: String,
			required: true
		},
	},
	cookingTime: {
		type: Date,
		required: true
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "category"
	},

	addOn: [
		{
			type: Schema.Types.ObjectId,
			ref: "addOn"
		},
	],

	menuType: {
		type: Schema.Types.ObjectId,
		ref: "menuType"
	},

	allergyInfo: {
		type: String,
		required: true
	},
	productPrice: {
		type: Number,
		required: true
	},
	shop: {
		type: Schema.Types.ObjectId,
		ref: "shop",
		required: true
	},
});

const Product = mongoose.model<IProduct>('product', ProductSchema);


export default Product;
