var router = require('express').Router();

var models = require('../models');

router.get('/', function (req, res, next) {
	models.Hotel.find({}).exec(function (err, hotels) {
		models.Restaurant.find({}).exec(function (err, restaurants) {
			models.ThingToDo.find({}).exec(function (err, thingsToDo) {
				res.render('index', {
					all_hotels: hotels,
					all_restaurants: restaurants,
					all_things_to_do: thingsToDo
				});
			});
		});
	});
});

module.exports = router;