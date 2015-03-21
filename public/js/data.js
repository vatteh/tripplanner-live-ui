var data = {
	hotels: {},
	restaurants: {},
	thingsToDo: {}
}


all_hotels.forEach(function(hotel) {
	data.hotels[hotel._id] = hotel
})

all_restaurants.forEach(function(restaurant) {
	data.restaurants[restaurant._id] = restaurant
})

all_things_to_do.forEach(function(t) {
	data.thingsToDo[t._id] = t
})

var getActivity = function(type, id) {
	return data[type][id];
}