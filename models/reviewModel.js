const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // Set back to default if every review get deleted
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Post middleware doesn't have next
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// We need to recalculate the avg ratings and num ratings, whenever a review gets updated or deleted. It's harder then when a new one is created, bc. for this we use findByIdAndUpdate and findByIdAndDelete methods. In those cases, we don't have access to the document middleware, like before (when saving). Instead we can use the query middleware.
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this: the current query. We need to find the tour belongs to the review. For this we can use a trick: since we have access to the current query, we can just await it.
  // We cannot use post in the middleware, because on that case the query was already executed, and we wouldn't have access to the tour
  this.r = await this.findOne();
  console.log(this.r);
  next();
});

// Workaround: after the query was executed, we can run the post middleware. But where do we get the tour id from? We can pass data from the pre middleware to the post middleware --> save this.r into the object in pre middleware, and we can retrieve it from post.
reviewSchema.post(/^findOneAnd/, async function () {
  this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
