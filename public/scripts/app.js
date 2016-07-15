var map;

$(() => {
  $("#toggle_list").click(function() {
    $('.locationInputs').toggle("fast");
  });

  $("#plus").click(function() {
    console.log("ASD")
    navigator.geolocation.getCurrentPosition(function(loc) {
      //change position to center of map insted of current location
      addMarker({lat: loc.coords.latitude, lng: loc.coords.longitude}, map);
    })
  });
});

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

var marker;

function getPosition() {
  navigator.geolocation.getCurrentPosition(setPosition);
}

function setPosition(loc) {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: loc.coords.latitude, lng: loc.coords.longitude}
  });
  addMarker({lat: loc.coords.latitude, lng: loc.coords.longitude}, map);

}

function initMap() {
  getPosition();
  var p = new Promise(getPosition);
  p.then(function(map) {
    google.maps.event.addListener('click', map, function(event) {
      addMarker(event.latLng, map);

    });
  }).catch(function(e) {
    console.log("Something went wrong", e);

  });
}

// Adds a marker to the map.
function addMarker(location, map) {

  marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map,
    draggable: true
  });
}

function savePosition() {
  var name = document.getElementById('name');
  var style = document.getElementById('style');
  var rating = document.getElementById('rating');

  var point = marker.getPosition();
  map.panTo(point);


// POST data to external database
  $.ajax({
    type: "POST",
    url: "/maps/:id",
    data: {
      name: name.value,
      style: style.value,
      rating: rating.value,
      latitude: point.lat(),
      longitude: point.lng()
    },
    success: function (data) {
    }
  });

  // save location to local storage
  localStorage.setItem('lastLat', point.lat());
  localStorage.setItem('lastLng', point.lng());

  localStorage.setItem('name', name.value);
  localStorage.setItem('style', style.value);
  localStorage.setItem('rating', rating.value);


  $('.locationInputs').toggle("fast");
};