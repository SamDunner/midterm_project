$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });
  $("#toggle_list").click(function() {
    $('.lists').toggle("slow");
  });
     $("#savePosition").click(function() {
    $('.locationInputs').toggle("fast");

});
});

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;


var map;
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
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map,
    draggable: true
  });

//   google.maps.event.addListener(marker, 'dragend', function (event){
//     var point = marker.getPosition();
//     map.panTo(point);

//     // save location to local storage
//     localStorage['lastLat'] = point.lat();
//     localStorage['lastLng'] = point.lng();
//   });
// }

}

function savePosition() {
  var name = document.getElementById('name');
  var style = document.getElementById('style');
  var rating = document.getElementById('rating');

  var point = marker.getPosition();
  map.panTo(point);

  // save location to local storage
  localStorage.setItem('lastLat', point.lat());
  localStorage.setItem('lastLng', point.lng());

  localStorage.setItem('name', name.value);
  localStorage.setItem('style', style.value);
  localStorage.setItem('rating', rating.value);

  console.log(marker.getPosition().lat());

    $('.locationInputs').toggle("fast");
};








