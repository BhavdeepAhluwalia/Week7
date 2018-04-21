var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authJwtController = require('./auth_jwt');
var User = require('./Users');
var jwt = require('jsonwebtoken');
var Movie = require('./movies');
var Review = require('./reviews');
var mongoose = require('mongoose');
var cors = require('cors');
//var port = process.env.PORT || 8080; // set the port for our app
//make secret key and add to .env

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(passport.initialize());
app.use(cors());

var router = express.Router();

router.route('/postjwt')
    .post(authJwtController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            res.send(req.body);
        }
    );

router.route('/users/:userId')
    .get(authJwtController.isAuthenticated, function (req, res) {
        var id = req.params.userId;
        User.findById(id, function(err, user) {
            if (err) res.send(err);

            var userJson = JSON.stringify(user);
            // return that user
            res.json(user);
        });
    });
/*________________________________________________________________________________________________________________________

.get(authJwtController.isAuthenticated, function (req, res)
{
    var id = req.params.moviesID;
    Movie.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "reviews",
                localField: title,
                foreignField: movieTitle,
                as: "reviews"
            }
        }
    ]).exec(function(err,movies){
        if (err) res.status(500).send(err);

        else
            res.send(movies);
    });
*/
router.route('/movies/:moviesId')
    .get(authJwtController.isAuthenticated, function (req, res) {
        var id = req.params.moviesId;

                if (req.query.review === "true") {

                    Movie.aggregate([
                        {
                            $match: {
                                _id: mongoose.Types.ObjectId(id)
                            }
                        },
                        {
                            $lookup: {
                                from: "reviews",
                                localField: "title",
                                foreignField: "movieTitle",
                                as: "reviews"
                            }
                        }
                    ]).exec(function (err, movies) {
                        if (err) res.status(500).send(err);

                        else
                            res.send(movies);
                    });
                }
                else
                {
                    Movie.findById(id, function(err, movie) {
                        if(err)
                            res.send(err);
                        else
                            res.json(movie);
                    });
                }
                    });


router.route('/reviews/:reviewId')
    .get(authJwtController.isAuthenticated, function (req, res) {
        var id = req.params.reviewId;
        Review.findbyId(id, function (err, user) {
            if (err) res.send(err);

            var reviewsJson = JSON.stringify(movies);
            //return that review
            res.json(review);
        });
        });

router.route('/users')
    .get(authJwtController.isAuthenticated, function (req, res) {
        User.find(function (err, users) {
            if (err) res.send(err);
            // return the users
            res.json(users);
            });
        });

router.route('/movies')
    .get(authJwtController.isAuthenticated, function (req, res) {

        if (req.query.review === "true") {

            Movie.find(function (err, movies) {
                if (err) res.send(err);
                //return the movies
                else {

                    movies.sort((a,b) => parseFloat(b.averageRating) - parseFloat(a.averageRating)); //sorts in desending order for average rating

                    res.json(movies);
                }
            });

        }


        });

                    router.route('/reviews')
                        .get(authJwtController.isAuthenticated, function (req, res) {
                            Review.find(function (err, movies) {
                                if (err) res.send(err);
                                //return the reviews
                                res.json(reviews);
                            });
                        });

                    router.route('/reviewAdder/:movieId')
                        .post(authJwtController.isAuthenticated, function (req, res) {

                            Movie.findById(id, function (err, movie) {
                                if (err){
                                    res.send(err);
                                }
                                else
                                {
                                    var review = new Review();
                                    review.ReviewerName = req.body.ReviewerName;
                                    review.MovieReview = req.body.MovieReview;
                                    review.MovieRating = req.body.MovieRating;
                                    review.movieTitle = req.body.movieTitle;
                                    movie.reviewCount =+ 1;
                                    movie.averageRating = ((movie.averageRating * (movie.reviewCount-1)+ movie.MovieRating)) / movie.reviewCount;


                                    review.save(function (err) {
                                            if (err.code == 11000)
                                                return res.json({success: false, message: 'That review was already posted.'});
                                            else{

                                                movie.save(function (err) {
                                                    if (err) {
                                                        res.send(err);
                                                    }
                                                    else
                                                        res.json({message: 'Review Created!'});
                                                });
                                            }

                                    });
                                }
                            });

                        });

                    router.route('/movieAdder')
                        .post(authJwtController.isAuthenticated, function (req, res) {

                            var movie = new Movie();
                            movie.title = req.body.title;
                            movie.year_released = req.body.year_released;
                            movie.genre = req.body.genre;
                            movie.Actors = req.body.Actors; //inserts whole array from movies.js schemas
                            movie.averageRating = 0;
                            movie.reviewCount = 0;

                            movie.save(function (err) {
                                if (err) {
                                    //duplicate entry
                                    if (err.code == 11000)
                                        return res.json({success: false, message: 'That movie already exists.'});
                                    else
                                        return res.send(err);
                                }
                                res.json({message: 'Movie Created!'});

                            });

                        });


                    router.delete('/movieDeleter', function (req, res) {
                        var movie = new Movie();
                        movie.title = req.body.title;
                        movie.year_released = req.body.year_released;
                        movie.genre = req.body.genre;

                    });
/*
                    router.route('/findReview/:ID')
                        .get(authJwtController.isAuthenticated, function (req, res) {
                            var id = req.params.ID;
                            Movie.aggregate([
                                {
                                    $match: {
                                        _id: mongoose.Types.ObjectId(id)
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "reviews",
                                        localField: movieTitle,
                                        foreignField: title,
                                        as: "reviews"
                                    }
                                }
                            ]).exec(function (err, movies) {
                                if (err) res.status(500).send(err);

                                else
                                    res.send(movies);
                            });
                            /* Movie.findById(id, function (err, movie)
                             {
                                 if (err)
                                     res.json({success: false, message: 'Movie not in database. '});
                                 else {
                                     if (req.query.review === true)
                                     {
                                         var locate = {movieTitle: movie.title};
                                         Review.find(locate, function(err, aReview) {
                                             if (err)
                                                 res.send(err);

                                             else {

                                                 var hold = new Object();
                                                 hold.movie = movie;
                                                 hold.Review = aReview;

                                                return res.send(hold);
                                             }
                                         });
                                     }
                                     else

                                         res.send(movie);
                                 }
                             }); */

                      //  });


router.route('/findByIdUpdate/:ID')
    .put(authJwtController.isAuthenticated, function (req, res) {
        var id = req.params.ID;
        Movie.findById(id, function (err, movie) {
            if (err)
                res.send(err);

            movie.title = req.body.title;
            movie.year_released = req.body.year_released;
            movie.genre = req.body.genre;
            movie.Actors = req.body.Actors;

            movie.save(function (err) {
                if (err)
                    res.send(err);
                else
                    res.json({success: true});
                });

            });
                            // return that user
                            //res.json(movie);


    });


router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
        }
        else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        // save the user
        user.save(function (err) {
            if (err) {
                // duplicate entry
                if (err.code == 11000)
                    return res.json({
                        success: false,
                        message: 'A user with that username already exists. '
                    });
                else
                    return res.send(err);
                                }
                                res.json({message: 'User created!'});
                            });
                        }
                    });



router.post('/signin', function(req, res) {
    var userNew = new User();
    userNew.name = req.body.name;
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) res.send(err);

        user.comparePassword(userNew.password, function(isMatch){
            if (isMatch) {
                var userToken = {id: user._id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
            }
        });


    });
});

app.use('/', router);
app.listen(process.env.PORT || 8080);
