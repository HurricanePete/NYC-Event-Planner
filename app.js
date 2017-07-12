var state = {
  map: null,
  offset: 0,
  savedOffset: 0,
  searchTerm: null,
  borough: null,
  savedResults: null,
  geocodeResults: null
}

var PUBLIC_RESTROOMS_ENDPOINT = 'https://data.cityofnewyork.us/resource/r27e-u3sy.json'

var RESULT_HTML_TEMPLATE = (
  '<div class="col-4">'+
	'<div class="br-results">' +
	'<div><h3 class="js-br-title"></h3></div>' + 
	'<div><p class="js-br-comment hidden"></p><br>' + 
	'<p class="js-br-open"></p><br>' + 
	'<p class="js-br-borough"></p><br>' +
	'<p class="js-br-location"></p><br>' +
	'<img class="js-handicap hidden" src="handicap.jpg">' +
	'<img class="js-no-handicap hidden" src="nohandicap.jpg">' +
	'</div></div>'
);

var RESULT_FAILURE_TEMPLATE = (
	'<div class="br-results">' +
	'<h3>Oops, there\'s nothing here</h3>' +
	'<h4>Hold for a bit longer and try a different search or different borough</h4>' +
	'</div>'
	)

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
  target.closest('body').find('div.map').removeClass('hidden');
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