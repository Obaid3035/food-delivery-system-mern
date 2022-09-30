import mongoose, { Schema } from "mongoose";
import {IAddOn} from "../interface";


const addOnSchema: Schema<IAddOn> = new Schema({
	title: {
		type: String,
		required: true
	},
	addOn: [
		{
			name: {
				type: String,
				required: true
			},
			price: {
				type: Number,
				required: true
			},
		}
	],
	shop: {
		type: Schema.Types.ObjectId,
		ref: "shop"
	},
	}, {
		timestamps: true
	}
);

const AddOn = mongoose.model('addOn', addOnSchema);

export default AddOn;

