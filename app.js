var state = {
  map: null,
  offset: 0,
  savedOffset: 0,
  searchTerm: null,
  borough: null,
  savedResults: [],
  geocodeResults: []
}

var PUBLIC_RESTROOMS_ENDPOINT = 'https://data.cityofnewyork.us/resource/r27e-u3sy.json'

var RESULT_HTML_TEMPLATE = (
	'<div class="br-results">' +
	'<div><h3 class="js-br-title"></h3></div>' + 
	'<div><p class="js-br-comment"></p><br>' + 
	'<p class="js-br-open"></p><br>' + 
	'<p class="js-br-borough"></p><br>' +
	'<p class="js-br-location"></p><br>' +
	'<img class="js-handicap hidden" src="handicap.jpg">' +
	'<img class="js-no-handicap hidden" src="nohandicap.jpg">' +
	'</div>'
);

var RESULT_FAILURE_TEMPLATE = (
	'<div class="br-results">' +
	'<h3>Oops, there\'s nothing here</h3>' +
	'<h4>Hold for a bit longer and try a different search or different borough</h4>' +
	'</div>'
	)

function setSavedResults (data) {
	state.savedResults = data;
}

function pickMapCenter (state) {
	var mapOptions = null;
	try {
		switch (state.borough) {
			case "Staten Island":
				mapOptions = {
					zoom: 13,
					center: new google.maps.LatLng(40.580725, -74.152862)
				}
				break;
			case "Brooklyn":
				mapOptions = {
					zoom: 13,
					center: new google.maps.LatLng(40.654559, -73.930133)
				}
				break;
			case "Manhattan":
				mapOptions = {
					zoom: 13,
					center: new google.maps.LatLng(40.779812, -73.966761)
				}
				break;
			case "Bronx":
				mapOptions = {
					zoom: 13,
					center: new google.maps.LatLng(40.853882, -73.877219)
				}
				break;
			case "Queens":
				mapOptions = {
					zoom: 13,
					center: new google.maps.LatLng(40.746069, -73.846646)
				}
				break;
			default:
				mapOptions = {
					zoom: 12,
					center: new google.maps.LatLng(40.707149, -74.012314)
				} 		
		}
		return mapOptions;
	}
	catch (err) {
		console.log("switch failure");
		return;
	}
}

function initializeMap(state) {
	var mapOptions = pickMapCenter(state);
	state.map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function getDataFromApi(callback, state) {
  if (state.borough === "") {
  	var settings = {
    	url: PUBLIC_RESTROOMS_ENDPOINT,
    	data: {
      	'$$app_token': '4buJLe3e35CTn7IkRQcSZ8i3W',
      	'$limit': 20,
      	'$offset': state.offset,
      	'$q' : state.searchTerm,
    	},
    	dataType: 'json',
    	type: 'GET',
    	success: callback
  	}
  }
  else {
  	var settings = {
    	url: PUBLIC_RESTROOMS_ENDPOINT,
    	data: {
      	'$$app_token': '4buJLe3e35CTn7IkRQcSZ8i3W',
      	'$limit': 20,
      	'$offset': state.offset,
      	'borough': state.borough,
      	'$q' : state.searchTerm,
    	},
    	dataType: 'json',
    	type: 'GET',
    	success: callback
  	}
  }
  $.ajax(settings);
}

function createAddress(state) {
  try {
    var results = state.savedResults.map(function(item, index) {
      return (item.name + ', New York');
    });
    return results;
  }
  catch (err) {
    return;
  }
}

function codeAddress(state) {
	var geocoder = new google.maps.Geocoder();
	var address = createAddress(state);
	state.geocodeResults = address.map(function(item, index){geocoder.geocode( { 'address': item}, function(results, status) {
   		if (status == google.maps.GeocoderStatus.OK) {
   			console.log("success")
   		}
   		else {
   			console.log("fail" + item)
      		}
		})
	})
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-br-title").text(result.name);
  template.find(".js-br-comment").text(result.comments);
  template.find(".js-br-open").text("Open Year Round: " + result.open_year_round);
  template.find(".js-br-borough").text(result.borough);
  template.find(".js-br-location").text(result.location);
  if (result.handicap_accessible === 'Yes') {
  	template.find(".js-handicap").removeClass("hidden");
  }
  if (result.handicap_accessible === undefined) {
  	template.find(".js-no-handicap").removeClass("hidden");
  }
  return template;
}

function displayBrData(data) {
	if (data[0] != null) {
		setSavedResults(data);
		var results = data.map(function(item, index) {
    		return renderResult(item);
    	})
    }
	else {
		var results = RESULT_FAILURE_TEMPLATE;
	}
	$('.js-result-display').html(results);
}

function createMapMarkers(state) {
	for (i=0; i<10; i++) {
		var marker = new google.maps.Marker({
			position: state.geocodeResults[i],
		});
		marker.setMap(state.map);
	}
}

function initializeGoogle () {
  initializeMap(state);
  codeAddress(state);
}

function displayApiResults(target) {
  target.closest('body').find('div.map').removeClass('hidden');
  target.closest('body').find('div.result-display').removeClass('hidden');
  target.closest('body').find('div.results').removeClass('hidden');
}

$(document).ready(function(){
	initializeMap(state);
})

$('form').submit(function(event) {
  event.preventDefault();
  state.searchTerm = $('#search').val();
  state.borough = $('input[name="borough"]:checked').val();
  getDataFromApi(displayBrData, state);
  displayApiResults($(this));
  codeAddress(state);
  createMapMarkers(state);
  initializeMap(state);
  google.maps.event.trigger(map, "resize");
})