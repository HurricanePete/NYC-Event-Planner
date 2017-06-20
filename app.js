var PERMITTED_EVENT_ENDPOINT = 'https://data.cityofnewyork.us/resource/8end-qv57.json'

var RESULT_HTML_TEMPLATE = (
  '<div class="result-panes">' +
    '<div><button data-toggle="collapse" data-parent="#accordion" href=""><span class="js-event-name"></span><span class="js-start-date"></span></button></div>' +
    '<div class="collapse" id="info"><ul><li class="js-end-time"></li><li class="js-event-loc"></li><li class="js-event-borough"></li><li class="js-event-type"></li><li class="js-event-agency"></li></ul></div>' +
  '</div>'
);


function getDataFromApi(callback) {
  var settings = {
    url: PERMITTED_EVENT_ENDPOINT,
    data: {
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
  template.find(".js-start-date").text("Starts: " + result.start_date_time);
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


$('div.button-nav').on('click', '#approved-events', function (event) {
    event.preventDefault();
    getDataFromApi(displayEventData);
    $(this).closest('body').find('div.map').removeClass('hidden');
    $(this).closest('body').find('div.result-display').removeClass('hidden');
    $(this).closest('body').find('div.results').removeClass('hidden');
    console.log('You did it');
})