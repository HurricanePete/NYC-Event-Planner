result.location.replace("&", "and").replace(/[,)(%]/g,"").replace(/[-/]/g, " ")

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

      function setSavedResults (data) {
  state.savedResults = data;
}

function pickMapCenter (state) {
  var mapOptions = null;
  try {
    switch (state.borough) {
      case "Staten Island":
        mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(40.580725, -74.152862)
        }
        break;
      case "Brooklyn":
        mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(40.654559, -73.930133)
        }
        break;
      case "Manhattan":
        mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(40.779812, -73.966761)
        }
        break;
      case "Bronx":
        mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(40.853882, -73.877219)
        }
        break;
      case "Queens":
        mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(40.746069, -73.846646)
        }
        break;
      default:
        mapOptions = {
          zoom: 12,
          center: new google.maps.LatLng(40.707149, -74.012314)
        }     
    }
    return mapOptions;
  }
  catch (err) {
    console.log("switch failure");
    return;
  }
}

function codeAddress(state) {
  var geocoder = new google.maps.Geocoder();
  var address = createAddress(state);
  for (i=0; i < address.length; i++) {
    state[geocodeResults].push(geocoder.geocode(address[i]));
    if (status == google.maps.GeocoderStatus.OK) {
      console.log("success")
    }
    else {
      console.log("fail " + item)
    }
  }
}

function createMapMarkers(state) {
  for (i=0; i<10; i++) {
    var marker = new google.maps.Marker({
      position: state.geocodeResults[i],
    });
    marker.setMap(state.map);
  }
}

$(document).ready(function(){
  initializeMap(state);
});

function initializeGoogle () {
  initializeMap(state);
  //codeAddress(state);
}

function initializeMap(state) {
  var mapOptions = pickMapCenter(state);
  state.map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
