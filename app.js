var PERMITTED_EVENT_ENDPOINT = 'https://data.cityofnewyork.us/resource/8end-qv57.json'

var RESULT_HTML_TEMPLATE = (
  '<div class="result-panes">' +
    '<button data-toggle="collapse" data-target="#info"><span class="js-event-name"></span><span class="js-start-date"></span></button>' +
    '<ul id="info" class="colapse"><li class="js-end-time"></li><li class="js-event-loc"></li><li class="js-event-borough"></li><li class="js-event-type"></li><li class="js-event-agency"></li></ul>' +
  '</div>'
);


function getDataFromApi(searchTerm, callback) {
  var settings = {
    url: PERMITTED_EVENT_ENDPOINT,
    data: {
      '$limit': 15,
      '$$app_token': '4buJLe3e35CTn7IkRQcSZ8i3W',
      '$q': searchTerm,
      '$offset': 0,
      '$order': "start_date_time"
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-result-link").attr("href", youtubeWatch + result.id.videoId);
  template.find(".js-result-thumb").attr("src", result.snippet.thumbnails.default.url);
  template.find(".js-video-title").text(result.snippet.title);
  template.find(".js-channel-link").attr("href", channelLink + result.snippet.channelId);
  template.find(".js-channel-title").text(result.snippet.channelTitle);
  return template;
}


$('div.button-nav').on('click', '#playgrounds', function (event) {
    event.preventDefault();
    $(this).closest('body').find('div.map').removeClass('hidden');
    $(this).closest('body').find('div.result-display').removeClass('hidden');
    $(this).closest('body').find('div.results').removeClass('hidden');
    console.log('You did it');
})