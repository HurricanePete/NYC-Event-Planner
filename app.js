var state = {
  map: null
}

var PERMITTED_EVENT_ENDPOINT = 'https://data.cityofnewyork.us/resource/8end-qv57.json'

var RESULT_HTML_TEMPLATE = (
  '<div class="result-panes">' +
    '<button class="results-button"><span class="js-event-name"></span><br><span class="js-start-date"></span></button>' +
    '<div class="results-collapse hidden" id="collapse"><ul><li class="js-end-time"></li><li class="js-event-loc"></li><li class="js-event-borough"></li><li class="js-event-type"></li><li class="js-event-agency"></li></ul></div>' +
  '</div>'
);

function initializeMap() {
  var latlng = new google.maps.LatLng(40.7288, -73.9579);
  var mapOptions = {
   zoom: 12,
   center: latlng
  }
  state.map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var marker = new google.maps.Marker({
    position: latlng,
    map: state.map,
    title: 'First Marker'
})
}

function getDataFromApi(callback) {
  var settings = {
    url: PERMITTED_EVENT_ENDPOINT,
    data: {
      //'start_date_time': getCurrentDate(),
      '$limit': 10,
      '$$app_token': '4buJLe3e35CTn7IkRQcSZ8i3W',
      //'$q': searchTerm,
      '$offset': 0,
      //'$order': "start_date_time"
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-event-name").text("Event Name: " + result.event_name);
  template.find(".js-start-date").text("Starts: " + moment(result.start_date_time, moment.ISO_8601));
  template.find(".js-end-time").text("Ends: " + result.end_date_time);
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
 var results = data.map(function(item, index) {
    return (item.event_location.substring(0,30) + ', ' + item.event_borough);
  });
 return results;
}

function codeAddress(data) {
  var geocoder = new google.maps.Geocoder();
  var address = createAddress(data);
  for (i=0; i<address.length; i++) {
    geocoder.geocode( { 'address': address[i]}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({
            map: state.map,
            position: results[0].geometry.location
        });
      } 
      else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}

function displayApiResults(target) {
  target.closest('body').find('div.map').removeClass('hidden');
  target.closest('body').find('div.result-display').removeClass('hidden');
  target.closest('body').find('div.results').removeClass('hidden');
}

function filterApiData(data) {
  codeAddress(data);
  displayEventData(data);
}

function initializeGoogle () {
  initializeMap();
  codeAddress();
}

$('div.button-nav').on('click', '#approved-events', function (event) {
    event.preventDefault();
    getDataFromApi(filterApiData);
    displayApiResults($(this));
    initializeMap();
    //marker.setMap(map);
    console.log('You did it');
})

$('div.js-result-display').on('click', '.results-button', function (event) {
  event.preventDefault();
  $(this).closest('div').find('.results-collapse').toggleClass('hidden');
})
