import mongoose, { Schema } from "mongoose";
import Shop from "./shop";
import {IReview} from "../interface";



const ReviewSchema: Schema<IReview> = new Schema({
	customer: {
		type: Schema.Types.ObjectId,
		ref: "user"
	},
	rating: {
		type: Number,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	shop: {
		type: Schema.Types.ObjectId,
		ref: "shop"
	},

});

ReviewSchema.pre("save", async function ( next ){
	const review = this;
	const reviews = await Review.find({ shop: review.shop});
	const rating = [];
	reviews.forEach(( review ) => {
		rating.push(review.rating);
	})
	rating.push(review.rating);
	const ratingSum = rating.reduce((acc, cur) => {
		return acc + cur
	}, 0)
	const avgRating = ratingSum / rating.length;
	await Shop.findByIdAndUpdate(review.shop, {
		avgRating: Math.round(avgRating),
		noOfReviews: rating.length
	})
	next();
})

const Review = mongoose.model<IReview>('review', ReviewSchema);

export default Review;
