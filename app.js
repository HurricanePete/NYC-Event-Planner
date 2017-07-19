var state = {
  offset: 0,
  searchTerm: null,
  borough: null,
  savedResults: 0
}

var PUBLIC_RESTROOMS_ENDPOINT = 'https://data.cityofnewyork.us/resource/r27e-u3sy.json'

var RESULT_HTML_TEMPLATE = (
  '<div class="col-4">'+
	'<div class="br-results">' +
	'<div class="result-title"><h3 class="js-br-title"></h3><img class="js-handicap hidden" src="images/handicap.jpg"><img class="js-no-handicap hidden" src="images/nohandicap.jpg"></div>' + 
	'<p><span class="js-br-comment hidden"></span><br>' + 
	'<span class="js-br-open hidden"></span><br>' + 
	'<span class="js-br-borough"></span><br>' +
	'<span class="js-br-location"></span><br></p><br>' +
	'<a target="_blank" class="js-link" href="">Show Me</a>' +
	'</div></div>'
);

var RESULT_FAILURE_TEMPLATE = (
	'<div class="br-fail-results">' +
	'<h3>Oops, there\'s nothing here</h3>' +
	'<h4>Hold for a bit longer and try a different search or different borough</h4>' +
	'</div>'
	)

function offsetNavNext(state) {
  state.offset += 12;
}

function offsetNavPrev(state) {
  state.offset -= 12;
}

function resetOffset(state) {
  state.offset = 0;
}

function setResultsLength(data, state) {
  state.savedResults = Object.keys(data).length;
}

function resetResultsLength(state) {
  state.savedResults = 12;
}

async function getDataFromApi(callback, state) {
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

function displayEventData(data) {
  var results = data.map(function(item, index) {
    return renderResult(item);
  });
  $('.js-result-display').html(results);
}

//convert this to add a link to google maps with the address of the bathroom
function createAddress(state) {
  var results = state[savedResults].map(function(item, index) {
    return (item.name + ', New York');
  });
  return results;
}

function hideBlanks(target, template, jsClass) {
  if (target !== undefined) {
    template.find(jsClass).removeClass("hidden");
  }
}

function renderLink(result) {
	if (result.location === undefined) {
		return "https://www.google.com/maps?q=" + result.name.replace(/[,)(%]/g,"") + ", New York, NY";
	}
	else {
		return "https://www.google.com/maps?q=" + result.location.replace("&", "and") + ", New York, NY";
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
  template.find(".js-link").attr("href", renderLink(result));
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

function displayNext(state, target) {
  if (state.savedResults !== 12) {
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
  resetOffset(state);
  state.searchTerm = $('#search').val();
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
  //resetResultsLength(state);
});

$('button.js-prev').mousedown(function(event){
  event.preventDefault();
  offsetNavPrev(state);
  getDataFromApi(setDisplayResults, state);
  displayPrev(state, $(this))
  //resetResultsLength(state);
});