function initializeMap() {
  var latlng = new google.maps.LatLng(40.7288, -73.9579);
  var mapOptions = {
   zoom: 10,
   center: latlng
  }
  state.map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function createAddress(stateSavedResults) {
  try {
    var results = stateSavedResults.map(function(item, index) {
      return (item.location + ', ' + item.borough);
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

function displayPrev(state, target) {
  if (state.offset === 0) {
    target.closest('div').find(".js-nav-prev").addClass('hidden');
  }
  else {
    target.closest('div').find(".js-nav-prev").removeClass('hidden');
  }
}

function filterApiData(data) {
  codeAddress(data);
  displayBrData(data);
}

function initializeGoogle () {
  initializeMap();
  codeAddress();
}

$('button.next').mousedown(function(event){
  event.preventDefault();
  navNext(state);
  getDataFromApi(filterApiData, state);
  displayPrev(state, $(this));
})

$('button.js-nav-prev').mousedown(function(event){
  event.preventDefault();
  navPrev(state);
  getDataFromApi(filterApiData, state);
  displayPrev(state, $(this));
})



var results = [];
	for (i=0; i < state.savedResults.length; i++) {
  		state.savedResults[i] (function(item, index) {
    		result = renderResult(item);
    	})
    	results.push(result);