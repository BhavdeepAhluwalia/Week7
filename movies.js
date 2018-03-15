var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
mongoose.connect(process.env.DB);

var ActorSchema = new Schema
(
    {
        ActorName: {type: String, required: true},
        CharacterName: {type: String, required: true}
    }
);

var MoviesSchema = new Schema(
    {
        title: {type: String, required: true},
        year_released: {type: String, required: true},
        genre:
            {
                type: String,
                required: true,
                enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western']
            },
            Actors: [ActorSchema] //array for actors from schema
    });




// return the model
module.exports = mongoose.model('Movie', MoviesSchema);
