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
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
//function codeAddress(state) {
//  var address = document.getElementById('address').value;
//  state.geocoder.geocode( { 'address': address}, function(results, status) {
//    if (status == google.maps.GeocoderStatus.OK) {
//      state.map.setCenter(results[0].geometry.location);
//      var marker = new google.maps.Marker({
//          map: state.map,
//          position: results[0].geometry.location
//      });
//    } else {
//      alert('Geocode was not successful for the following reason: ' + status);
//    }
//  });
//}

function getCurrentDate () {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd = '0'+dd
  } 
  if(mm<10) {
      mm = '0'+mm
  } 
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

function getDataFromApi(callback) {
  var settings = {
    url: PERMITTED_EVENT_ENDPOINT,
    data: {
      //'start_date_time': getCurrentDate(),
      '$limit': 15,
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
  template.find(".js-start-date").text("Starts: " + (result.start_date_time).substring(0,16));
  template.find(".js-end-time").text("Ends: " + (result.end_date_time).substring(0,16));
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

$('div.button-nav').on('click', '#approved-events', function (event) {
    event.preventDefault();
    getDataFromApi(displayEventData);
    $(this).closest('body').find('div.map').removeClass('hidden');
    $(this).closest('body').find('div.result-display').removeClass('hidden');
    $(this).closest('body').find('div.results').removeClass('hidden');
    initializeMap();
    console.log('You did it');
})

$('div.js-result-display').on('click', '.results-button', function (event) {
  event.preventDefault();
  $(this).closest('div').find('.results-collapse').toggleClass('hidden');
})

$(document).ready(function() {
    $(window).resize(function() {
        google.maps.event.trigger(map, 'resize');
    });
});