var state = {
  map: null,
  offset: 0,
<<<<<<< HEAD
  searchTerm: null
}

function endpointSwitcher (selection) {
  switch (selection) {
  case 1:
    var API_ENDPOINT = 'https://data.cityofnewyork.us/resource/8end-qv57.json'
    break;
  case 2:
    var API_ENDPOINT = 'https://www.nycgovparks.org/bigapps/DPR_Playgrounds_001.json'
    break;
  case 3: 
    var API_ENDPOINT = 'https://www.nycgovparks.org/bigapps/DPR_RunningTracks_001.json'
    break;
  case 4:
    var API_ENDPOINT = 'https://www.nycgovparks.org/bigapps/DPR_IceSkating_001.json'  
  }
  return API_ENDPOINT;
}

var PERMITTED_EVENT_ENDPOINT = 'https://data.cityofnewyork.us/resource/8end-qv57.json'
=======
  searchTerm: null,
  borough: null,
  savedResults: null,
}

var PUBLIC_RESTROOMS_ENDPOINT = 'https://data.cityofnewyork.us/resource/r27e-u3sy.json'
>>>>>>> test-branch

var RESULT_HTML_TEMPLATE = (
  '<div class="col-4">'+
	'<div class="br-results">' +
	'<div><h3 class="js-br-title"></h3></div>' + 
	'<div><p class="js-br-comment hidden"></p><br>' + 
	'<p class="js-br-open hidden"></p><br>' + 
	'<p class="js-br-borough"></p><br>' +
	'<p class="js-br-location"></p><br>' +
	'<img class="js-handicap hidden" src="handicap.jpg">' +
	'<img class="js-no-handicap hidden" src="nohandicap.jpg">' +
	'</div></div></div>'
);

<<<<<<< HEAD
function navNext(state) {
  state.offset += 6;
=======
var RESULT_FAILURE_TEMPLATE = (
	'<div class="br-results">' +
	'<h3>Oops, there\'s nothing here</h3>' +
	'<h4>Hold for a bit longer and try a different search or different borough</h4>' +
	'</div>'
	)

function offsetNavNext (state) {
  state.offset += 12;
>>>>>>> test-branch
}

function offsetNavPrev (state) {
  state.offset -= 12;
}

function displayPrev(state, target) {
  if (state.offset === 0) {
    target.closest('div').find(".js-prev").addClass('hidden');
  }
  else {
    target.closest('div').find(".js-prev").removeClass('hidden');
  }
}

function getDataFromApi(callback, state) {
  if (state.borough === "") {
  	var settings = {
    	url: PUBLIC_RESTROOMS_ENDPOINT,
    	data: {
      	'$$app_token': '4buJLe3e35CTn7IkRQcSZ8i3W',
      	'$limit': 12,
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
      	'$limit': 12,
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

<<<<<<< HEAD
function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-event-name").text("Event Name: " + result.event_name);
  template.find(".js-start-date").text("Starts: " + Date(result.start_date_time).substring(0,21));
  template.find(".js-end-time").text("Ends: " + Date(result.end_date_time).substring(0,21));
  template.find(".js-event-loc").text("Location: " + result.event_location);
  template.find(".js-event-borough").text("Borough: " + result.event_borough);
  template.find(".js-event-type").text("Type: " + result.event_type);
  template.find(".js-event-agency").text("Agency: " + result.event_agency);
  return template;
}

function displayEventData(data) {
  var results = data.map(function(item, index) {
    return renderResult(item);
  });
  $('.js-result-display').html(results);
}

function createAddress(data) {
  try {
    var results = data.map(function(item, index) {
      return (item.event_location.substring(0,40) + ', ' + item.event_borough);
    });
  return results;
  }
  catch (err) {
    return;
  }
}

function codeAddress(data) {
  var geocoder = new google.maps.Geocoder();
  var address = createAddress(data);
  try {
    address.forEach(function(item, index){geocoder.geocode( { 'address': item}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({
            map: state.map,
            position: results[0].geometry.location,
            title: data[index].event_name
        });
      } 
      else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        alert('Sorry, we could not find an address for ' + data[index].event_location + ' with Google maps and can\'t create a marker.');
      }
      else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    })
  })
}
  catch (err) {
    return;
  }
}

//convert this to add a link to google maps with the address of the bathroom
function createAddress(state) {
  var results = state[savedResults].map(function(item, index) {
    return (item.name + ', New York');
  });
  return results;
}

function hideBlanks (target, template, jsClass) {
  if (target !== undefined) {
    template.find(jsClass).removeClass("hidden");
  }
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-br-title").text(result.name);
  template.find(".js-br-comment").text(result.comments);
  hideBlanks(result.comments, template, ".js-br-comment");
  template.find(".js-br-open").text("Open Year Round: " + result.open_year_round);
  hideBlanks(result.open_year_round, template, ".js-br-open");
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
		var results = data.map(function(item, index) {
    		return renderResult(item);
    	})
    }
	else {
		var results = RESULT_FAILURE_TEMPLATE;
	}
	$('.js-result-display').html(results);
}


function displayApiResults(target) {
  target.closest('body').find('div.result-display').removeClass('hidden');
  target.closest('body').find('div.results').removeClass('hidden');
}

$('form').submit(function(event) {
  event.preventDefault();
  state.searchTerm = $('#search').val();
  state.borough = $('input[name="borough"]:checked').val();
  getDataFromApi(displayBrData, state);
  displayApiResults($(this));
});

$('button.next').mousedown(function(event){
  event.preventDefault();
  offsetNavNext(state);
  getDataFromApi(displayBrData, state);
  displayPrev(state, $(this));
})

$('button.js-prev').mousedown(function(event){
  event.preventDefault();
  offsetNavPrev(state);
  getDataFromApi(displayBrData, state);
  displayPrev(state, $(this));
})