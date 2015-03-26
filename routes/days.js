var dayRouter = require('express').Router();
var attractionRouter = require('express').Router({mergeParams:true});
var models = require('../models');

// GET /days
dayRouter.get('/', function (req, res, next) {
    // serves up all days as json
    models.Day.find({}, null, {sort: {'number': 1}} ,function (err, days) {
        res.send(days);
    });    
});
// POST /days
dayRouter.post('/', function (req, res, next) {
    // creates a new day and serves it as json
    models.Day.find({}, function (err, allDays) {
        nextNumber = allDays.length + 1;

        var newDay = new models.Day({
          number: nextNumber,
          hotel: null,
          restaurants: [],
          thingsToDo: [],
        });

        newDay.save( function(err, data) {
          res.send(newDay);
        }); 
    });
        
});
// GET /days/:id
dayRouter.get('/:id', function (req, res, next) {
    // serves a particular day as json
    models.Day
        .findOne({_id: req.params.id})
        .populate('hotel restaurants thingsToDo')
        .exec(function(err, popDay) {
             res.send(popDay);
        });
});

// DELETE /days/:id
dayRouter.delete('/:id', function (req, res, next) {
    // deletes a particular day
    models.Day.findOneAndRemove({ _id: req.params.id }, function(err, removedDay) {
        models.Day.find({}, null, {sort: {'number': 1}}, function (err, allDays) {
            var newCurrentDay;
            allDays.forEach(function(day) {
                if (parseInt(day.number) > parseInt(removedDay.number)) {
                    day.number = (day.number) - 1;
                    // console.log("Model: " + day.number);
                } if (day.number == removedDay.number) {
                    newCurrentDay = day;
                }

                day.save();
            });

            // allDays.save( function(err, data) {
              if (newCurrentDay !== undefined)
                  res.send({"allDays": allDays, "removedDay": removedDay, "newCurrentDay": newCurrentDay});
              else if (allDays.length > 0)
                  res.send({"allDays": allDays, "removedDay": removedDay, "newCurrentDay": allDays[allDays.length-1]});
              else
                  res.status(500).send({ error: 'No Days was Deleted!' });
            // }); 
        });
    });
});

dayRouter.use('/:id', 
//     function(req,res,next) {
//     console.log(req.params, 'params')
//     next()
// },
attractionRouter);

// POST /days/:id/hotel
attractionRouter.post('/hotel', function (req, res, next) {
    // creates a reference to the hotel

    models.Day.findOne({_id: req.params.id}, function (err, day) {
        day.hotel = req.body.value;

        models.Hotel.findOne({_id: day.hotel}, function (err, hotel) {
            day.save( function(err, day) {
                res.send(hotel.place[0].location);
            }); 
        });
    });
});
// DELETE /days/:id/hotel
attractionRouter.delete('/hotel', function (req, res, next) {
    // deletes the reference of the hotel

    models.Day.findOne({_id: req.params.id}, function (err, day) {

        day.hotel = null;
        day.save( function(err, day) {
          res.send(day);
        }); 

    });

});
// POST /days/:id/restaurants
attractionRouter.post('/restaurants', function (req, res, next) {
    // creates a reference to a restaurant

    models.Day.findOne({_id: req.params.id}, function (err, day) {

        day.restaurants.push( req.body.value );
        models.Restaurant.findOne({_id: day.restaurants[day.restaurants.length-1]}, function (err, restaurant) {
            day.save( function(err, day) {
                res.send(restaurant.place[0].location);
            }); 
        });
    });
});
// DELETE /days/:dayId/restaurants/:restId
attractionRouter.delete('/restaurant/:activityId', function (req, res, next) {
    // deletes a reference to a restaurant

    models.Day.findOne({_id: req.params.id}, function (err, day) {

        var index = day.restaurants.indexOf( req.params.activityId );
        day.restaurants.splice(index, 1);

        day.save( function(err, day) {
          res.send(day);
        }); 
    });
});
// POST /days/:id/thingsToDo
attractionRouter.post('/thingsToDo', function (req, res, next) {
    // creates a reference to a thing to do

    models.Day.findOne({_id: req.params.id}, function (err, day) {

        day.thingsToDo.push( req.body.value );
        models.ThingToDo.findOne({_id: day.thingsToDo[day.thingsToDo.length-1]}, function (err, thingToDo) {
            day.save( function(err, day) {
                res.send(thingToDo.place[0].location);
            }); 
        });
    });
});
// DELETE /days/:dayId/thingsToDo/:thingId
attractionRouter.delete('/thingsToDo/:activityId', function (req, res, next) {
    // deletes a reference to a thing to do

    models.Day.findOne({_id: req.params.id}, function (err, day) {

        var index = day.thingsToDo.indexOf( req.params.activityId );
        day.thingsToDo.splice(index, 1);

        day.save( function(err, day) {
          res.send(day);
        }); 
    });
});

module.exports = dayRouter;
