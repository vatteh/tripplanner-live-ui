/*
model
- wire up event listeners
- on click, find the object cooresponding to the id selected
- find the id selected
- push that object into the current day

view
- look in currentday div for the correct category
- add a div (from a template) for the selected item
- wire up new event listerns for remove

possible complications
- hotel is singular, the others are plural
- new elements won't be functional by default
- model <-> view sync
*/

var getListByType = function(type) {
	return {
		"hotel": $('#itinerary .hotel-list'),
		"restaurants": $('#itinerary .restaurant-list'),
		"thingsToDo": $("#itinerary .thingsToDo-list")
	}[type]
}

var addItemToList = function(type, activity) {
	if(!activity) return;
	var list = getListByType(type)

	var template = templates.get('itinerary-item')
	  .appendTo(list)


	template.find('.title')
	 .text(activity)

	// drawLocation(activity.place[0].location, iconTypeMap[type])
}

$('.add-activity').on('click', function() {

	//models
	//find the correct select
	var $select = $(this).siblings('select');
	var type = $(this).attr('data-type');
	var id = $select.val();
	var activity = $select.find('option:selected').text();
	$.post('/days/'+ currentDay._id + '/' + type, {value: id}, function() {
		//views
		addItemToList(type, activity);
	}, "json");

	// $.ajax({
	//   type: "POST",
	//   url: '/days/'+ currentDay._id + '/hotel',
	//   data: {value: id},
	//   success: function() {
	// 	var activity = getActivity(type, id);
	// 	//views
	// 	addItemToList('hotel', activity);
	// },
	//   dataType: 'json'
	// });

})

$('#itinerary').on('click', '.remove', function() {

})