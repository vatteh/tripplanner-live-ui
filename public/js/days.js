var days = [];
var currentDay;

var $addDay = $('#add-day')
var $dayTitle = $('#day-title span:first')
var $removeDay = $('#day-title button:first')

$.get('/days', function (data) {
  var firstDayBtn;
  //for all days in data
  data.forEach( function( day ) {
    if (!firstDayBtn) {
      firstDayBtn = makeDayButton(day);
    } else {
      makeDayButton(day); 
    }
  });

  if (data.length > 0)
    switchCurrentDay(data[0], firstDayBtn);
})


var switchCurrentDay = function(day, $dayBtn) {
  clearMap()
  currentDay = day
  $dayTitle.text('Day ' + day.number)
  $('.day-btn').removeClass('current-day')
  $dayBtn.addClass('current-day')

  // wipe current itenerary and replace with a clone of a new template
  $("#itinerary").html(templates.get('itinerary'))

  // loop through the model, and call `addItemToList` once for each activity
  $.get('/days/' + currentDay._id, function (day) {

    if(day.hotel)
      addItemToList('hotel', day.hotel.name, day.hotel._id, day.hotel.place[0].location);

    day.restaurants.forEach(function(item) {
      addItemToList('restaurants', item.name, item._id, item.place[0].location);
    });

    day.thingsToDo.forEach(function(item) {
      addItemToList('thingsToDo', item.name, item._id, item.place[0].location);
    });
  });
}

$addDay.on('click', function() {

  $.post('/days', function (day) {
    var newDayBtn = makeDayButton(day);

    switchCurrentDay(day, newDayBtn);
  })

})

$removeDay.on('click', function() {

  $.ajax({
      url: '/days/' + currentDay._id,
      type: 'DELETE',
      success: function(dayObj) {
        // Do something with the result
        currentDay = dayObj.newCurrentDay;
        $("div.day-buttons #" + dayObj.removedDay._id).remove();

        dayObj.allDays.forEach( function (day) {
          $("div.day-buttons .a-day#" + day._id).text(day.number);
        });
        
        switchCurrentDay(currentDay, $( "button:contains(" + currentDay.number + ")" ));          
      }
  });

});

function makeDayButton(day) {
  return templates.get('day-btn')
        .attr('id', day._id)
        .text(day.number)
        .insertBefore($addDay)
        .on('click', function() {
          switchCurrentDay(day, $(this))
        });
}



