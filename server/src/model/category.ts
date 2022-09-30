import mongoose, { Schema } from "mongoose";
import {ICategory} from "../interface";


const CategorySchema: Schema<ICategory> = new Schema({
		title: {
			type: String,
			required: true
		},
		shop: {
			type: Schema.Types.ObjectId,
			ref: "shop"
		},
	}, {
		timestamps: true
	}
);

const Category = mongoose.model('category', CategorySchema);

export default Category;

