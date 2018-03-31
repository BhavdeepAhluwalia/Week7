var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
mongoose.connect(process.env.DB);

var ReviewSchema = new Schema
(
    {
        ReviewerName: {type: String, required: true},
        MovieReview: {type: String, required: true},
        MovieRating: {type: Number, required: true},
        movieId: {type: String}

    }
);

module.exports = mongoose.model('Reviews', ReviewSchema);