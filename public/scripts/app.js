(function() {
  var map;
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
    $.getJSON(location.pathname + "data_points", function(points){
      points.forEach(function(point){
        addMarker({lat: point.latitude, lng: point.longitude}, map);
      });
    });
    addMarker({lat: loc.coords.latitude, lng: loc.coords.longitude}, map);

  }

  function initMap() {
    getPosition();
  }

  // Adds a marker to the map.

  function getPoints() {
    $.ajax({
      type: "json",
      url: location.pathname + "data_points",
      data: {
        name: name.value,
        type: type.value,
        rating: rating.value,
        latitude: point.lat(),
        longitude: point.lng()
      },
      success: function (data) {
      console.log("data");
      }
    });
  }



  function addMarker(location, map) {
    marker = new google.maps.Marker({
      position: location,
      label: labels[labelIndex++ % labels.length],
      map: map,
      draggable: true
    });
  }

  function savePosition() {

    console.log("save pos");

    var name = document.getElementById('name');
    var type = document.getElementById('type');
    var rating = document.getElementById('rating');

    var point = marker.getPosition();
    map.panTo(point);


  // POST data to external database
    $.ajax({
      type: "POST",
      url: location.pathname + "data_points",
      data: {
        name: name.value,
        type: type.value,
        rating: rating.value,
        latitude: point.lat(),
        longitude: point.lng()
      },
      success: function (data) {
      console.log(data.body);
      }
    });

    $('.locationInputs').toggle("fast");
  }

  $(() => {

    $("#toggle_list").click(function() {
      $('.locationInputs').toggle("slow");
    });

    $("#plus").click(function() {
      navigator.geolocation.getCurrentPosition(function(loc) {
        //change position to center of map insted of current location
        addMarker({lat: loc.coords.latitude, lng: loc.coords.longitude}, map);
      })
    });

    $(".btn_submit").click(savePosition);

    $('#name_form').submit(function(event) {
      event.preventDefault();
      $.ajax({
          url: $(this).attr('action'),
          type: $(this).attr('method'),
          data: $(this).serialize(),
          success: function(html) {
          }
      });
    });
  });
  window.initMap = initMap;
})();

// var contentString = data

// var infowindow = new google.maps.InfoWindow({
//   content: contentString
// });

// marker.addListener('click', function() {
//   infowindow.open(map, marker);
// });









