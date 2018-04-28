var state = {
  offset: 0,
  searchTerm: null,
  borough: null,
  savedResults: 0
}

var PUBLIC_RESTROOMS_ENDPOINT = 'https://data.cityofnewyork.us/resource/r27e-u3sy.json'

var RESULT_HTML_TEMPLATE = (
  '<div class="col-4">'+
	'<a target="_blank" class="js-link" href=""><div class="br-results">' +
	'<div class="result-title"><h3 class="js-br-title" title=""></h3><img class="js-handicap hidden" src="images/handicap.jpg"><img class="js-no-handicap hidden" src="images/nohandicap.jpg"></div><br>' + 
	'<p class="js-comment-container"><span class="js-br-comment important"></span><br><hr>' + 
	'<p class="location-container"><span title="" class="js-br-location"></span></p><br><hr>' + 
	'<span class="js-br-borough"></span><br>' +
	'<span class="js-br-open hidden"></span><br></p><br>' +
	'<button class="link-button">Show Me</button>' +
	'</div></a></div>'
);

var RESULT_FAILURE_TEMPLATE = (
	'<div class="br-fail-results">' +
	'<h3>Oops, there\'s nothing here</h3>' +
	'<h4>Hold for a bit longer and try a different search or different borough</h4>' +
	'</div>'
	)

//button behavior on nav press to set offsets on the api calls
function offsetNavNext(state) {
  state.offset += 9;
}

function offsetNavPrev(state) {
  state.offset -= 9;
}

function resetOffset(state) {
  state.offset = 0;
}

function setResultsLength(data, state) {
  state.savedResults = Object.keys(data).length;
}
//tests to see if input starts with a number and removes any text if true
//API searches originally would not return results for 14th street
function cleanInput(input) {
	if (/^\d/g.test(input)) {
		return input.replace(/\D/g, "");
	}
	else {
		return input;
	}
}

//handles api calls differently if a borough has been selected
//searching with the borough parameter empty returns no results
async function getDataFromApi(callback, state) {
  if (state.borough === "") {
  	var settings = {
    	url: PUBLIC_RESTROOMS_ENDPOINT,
    	data: {
      	'$$app_token': '4buJLe3e35CTn7IkRQcSZ8i3W',
      	'$limit': 9,
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
      	'$limit': 9,
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

function displayEventData(data) {
  var results = data.map(function(item, index) {
    return renderResult(item);
  });
  $('.js-result-display').html(results);
}

function locationAlert(target, template, jsClass, item) {
  if (target === undefined || target === "") {
    template.find(jsClass).text(item + ' information unavailable').addClass('important');
  }
} 

function renderLink(result) {
	if (result.location === undefined) {
		return "https://www.google.com/maps?q=" + result.name.replace(/[,)/(%]/g,"") + " park, " +  result.borough + ", NY";
	}
  //strips letters from the result location
  //using numbers from the address returned more stable results for this map function
	else {
		return "https://www.google.com/maps?q=" + result.name.replace(/[,)/(%]/g,"") + " park, " + result.location.toLowerCase().replace(/[abcdefghijklmnopqrstuvwxyz.-/&]/g, "") + result.borough + ", NY";
	}
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  //shows full location and title on mouse-over in case the location text overflows and is clipped
  template.find(".js-br-title").text(result.name).attr("title", result.name);
  template.find(".js-br-comment").text(result.comments);
  template.find(".js-br-open").text("Open Year Round: " + result.open_year_round);
  template.find(".js-br-borough").text(result.borough);
  template.find(".js-br-location").text(result.location).attr("title", result.location);
  locationAlert(result.location, template, ".js-br-location", 'Location');
  if (result.handicap_accessible === 'Yes') {
  	template.find(".js-handicap").removeClass("hidden");
  }
  else if (result.handicap_accessible === undefined) {
    template.find(".js-no-handicap").removeClass("hidden");
  }
  template.find(".js-link").attr("href", renderLink(result));
  return template;
}
//if the api call returns no results this displays an error message
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

//lines 146-162 create responsive nav buttons that appear and disappear based on
//how many results are returned by the api call
function displayNext(state, target) {
  if (state.savedResults !== 9) {
    target.closest('div').find(".js-next").addClass("hidden");
  }
  else {
    target.closest('div').find(".js-next").removeClass("hidden");
  }
}

function displayPrev(state, target) {
  if (state.offset <= 0) {
    target.closest('div').find(".js-prev").addClass("hidden");
  }
  else {
    target.closest('div').find(".js-prev").removeClass("hidden");
  }
}

function setDisplayResults(data) {
	setResultsLength(data, state);
	displayBrData(data, state);
	displayNext(state, $(".js-next"));
}

function handleNavDisplay(state, targetNext, targetPrev) {
  displayNext(state, targetNext);
  displayPrev(state, targetPrev);
}

function displayApiResults(target) {
  target.closest('body').find('div.result-display').removeClass('hidden');
  target.closest('body').find('div.results').removeClass('hidden');

}

$('form').submit(function(event) {
  event.preventDefault();
  fbq('track', 'Search');
  resetOffset(state);
  state.searchTerm = cleanInput($('#search').val());
  state.borough = $('input[name="borough"]:checked').val();
  getDataFromApi(setDisplayResults, state);
  displayApiResults($(this));
  handleNavDisplay(state, $(".js-next"), $(".js-prev"));
});

$('button.js-next').mousedown(function(event){
  event.preventDefault();
  offsetNavNext(state);
  getDataFromApi(setDisplayResults, state);
  displayPrev(state, $(this));
});

$('button.js-prev').mousedown(function(event){
  event.preventDefault();
  offsetNavPrev(state);
  getDataFromApi(setDisplayResults, state);
  displayPrev(state, $(this))
});