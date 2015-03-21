var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tripplanner');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

var placeSchema = new mongoose.Schema({
	address: String,
	city: String,
	state: String,
	phone: String,
	location: [Number]
});

var hotelSchema = new mongoose.Schema({
	name: String,
	place: [placeSchema],
	num_stars: {type: Number, min: 1, max: 5},
	amenities: String
});

var thingToDoSchema = new mongoose.Schema({
	name: String,
	place: [placeSchema],
	age_range: String
});

var restaurantSchema = new mongoose.Schema({
	name: String,
	place: [placeSchema],
	cuisine: String,
	price: {type: Number, min: 1, max: 5}
});

module.exports = {
	Place: mongoose.model('Place', placeSchema),
	Hotel: mongoose.model('Hotel', hotelSchema),
	ThingToDo: mongoose.model('ThingToDo', thingToDoSchema),
	Restaurant: mongoose.model('Restaurant', restaurantSchema),
};