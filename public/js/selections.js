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

var addItemToList = function(type, activity, id, location) {

	if(!activity) return;
	var list = getListByType(type);

	var template = templates.get('itinerary-item')
	  .attr('data-value', id)
	  .attr('data-type', type)
	  .appendTo(list);

	template.find('.title')
	 .text(activity);

	drawLocation(location, iconTypeMap[type], id);
}

$('.add-activity').on('click', function() {

	//models
	//find the correct select
	var $select = $(this).siblings('select');
	var type = $(this).attr('data-type');
	var id = $select.val();
	var activity = $select.find('option:selected').text();
	$.post('/days/'+ currentDay._id + '/' + type, {value: id}, function(location) {
		if(type === "hotel") {
			var node = $("ul.hotel-list div");
			var nodeValue = node.attr("data-value");
			node.remove();
			clearLocation(nodeValue);
		}
		addItemToList(type, activity, id, location);
	});

})

$('#itinerary').on('click', '.remove button', function() {

	var id = $(this).parent().parent().attr('data-value');
	var type = $(this).parent().parent().attr('data-type');
	var nodeToRemove = $(this).parent().parent();
	
	var url;
	if (type === "hotel") {
		url = '/days/' + currentDay._id + "/hotel";
	} else if (type === "restaurants") {
		url = '/days/' + currentDay._id + "/restaurant/" + id;
	} else if (type === "thingsToDo") {
		url = '/days/' + currentDay._id + "/thingsToDo/" + id;
	}


	$.ajax({
	    url: url,
	    type: 'DELETE',
	    success: function() {
	    	nodeToRemove.remove();
			clearLocation(id);
		}
	});
})