import mongoose, { Schema } from "mongoose";
import {IMenuType} from "../interface";


const MenuTypeSchema: Schema<IMenuType> = new Schema({
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

const MenuType = mongoose.model('menuType', MenuTypeSchema);

export default MenuType;

