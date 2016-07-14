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

});

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function initMap() {
  var vancouver = {lat: 49.2827 , lng: -123.1207};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: vancouver
  });

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, map);
  });
    addMarker(vancouver, map);
  // Add a marker at the center of the map.
}

// Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map,
    draggable: true
  });

  google.maps.event.addListener(marker, 'dragend', function (event)
{
    var point = marker.getPosition();
    map.panTo(point);

    // save location to local storage
    localStorage['lastLat'] = point.lat();
    localStorage['lastLng'] = point.lng();
});
}

function savePosition() {
  var name = document.getElementById('name');
  var style = document.getElementById('style');
  var rating = document.getElementById('rating');

  localStorage.setItem('name', name.value);
  localStorage.setItem('style', style.value);
  localStorage.setItem('rating', rating.value);

}








