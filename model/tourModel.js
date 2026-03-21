const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			maxLength: [
				40,
				'Tour name must be less than or equal to 40 characters',
			],
			minLength: [
				10,
				'Tour name must be more than or equal to 10 characters',
			],
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, 'A tour must have a duration'],
		},
		maxGroupSize: {
			type: Number,
			required: [true, 'A tour must have a group size'],
		},
		difficulty: {
			type: String,
			required: [true, 'A tour must have a difficulty'],
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: 'Difficulty: easy, medium, difficult',
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, 'Rating must be above 1.0'],
			max: [5, 'Rating must be below 5.0'],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, 'A tour must have a price'],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (val) {
					return val < this.price;
				},
				message:
					'Discount price {{VALUE}} should be below regular price',
			},
		},
		summary: {
			type: String,
			trim: true,
			required: [true, 'A tour must have a desctiption'],
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, 'A tour must have a cover image'],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
		},

		startDates: [Date],
		secretTour: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

tourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7;
});

tourSchema.pre('save', function () {
	this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre(/^find/, function () {
	this.find({ secretTour: { $ne: true } });
	this.start = Date.now();
});

tourSchema.post(/^find/, function (docs) {
	console.log(`Query took ${Date.now() - this.start} milliseconds!`);
	console.log(docs);
});

tourSchema.post('save', function (doc) {
	console.log(doc);
});

tourSchema.pre('aggregate', function () {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
