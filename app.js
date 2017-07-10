var state = {
  map: null,
  offset: 0,
  searchTerm: null,
  borough: null,
  savedResults: []
}

var PUBLIC_RESTROOMS_ENDPOINT = 'https://data.cityofnewyork.us/resource/r27e-u3sy.json'

var RESULT_HTML_TEMPLATE = (
	'<div class="br-results"' +
	'<div><h3 class="js-br-title"></h3></div>' + 
	'<div><p class="js-br-comment></p><br>' + 
	'<p class="js-br-open"></p><br>' + 
	'<p class="js-br-borough"></p><br>' +
	'<p class="js-br-location"</p><br>' +
	'<img class="js-handicap hidden" src="handicap.jpg">' +
	'</div>'
);

function getDataFromApi(callback, state) {
  var settings = {
    url: PUBLIC_RESTROOMS_ENDPOINT,
    data: {
      '$$app_token': '4buJLe3e35CTn7IkRQcSZ8i3W',
      'borough': state.borough,
      '$limit': 20,
      '$q' : state.searchTerm,
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  }
    
  $.ajax(settings);
}

function setSavedResults(data, state) {
	state.savedResults = data;
	console.log(data);
	//displayBrData(state);
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-br-title").text(result.name);
  template.find(".js-br-comments").text(result.comments);
  template.find(".js-br-open").text(result.open_year_round);
  template.find(".js-br-borough").text(result.borough);
  template.find(".js-br-location").text(result.location);
  if (result.handicap_accessible == 'Yes') {
  	template.find(".js-handicap").removeClass("hidden");
  }
  else {
  	return;
  }
  return template;
}

function displayBrData(data) {
	var results = data.map(function(item, index) {
    	return renderResult(item);
  	});
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
})