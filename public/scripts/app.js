(function() {
  var map;
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;
  var marker;
  var infowindow;
  var result = {};
  var contentString = JSON.stringify(result);
        // '<div id="content">'+
        // '<div id="siteNotice">'+
        // '</div>'+
        // '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
        // '<div id="windowContentContent">'+
        // //Fix widow content!!!!!!!!!
        // '<% include ./maps/:map_id/data_points %>'+
        // '<button class="edit_btn" type="button">Edit</button>'+
        // '<button class="delete_btn" type="button">Delete</button>'+
        // '</div>'+
        // '</div>';


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
  function addMarker(location, map) {
    marker = new google.maps.Marker({
      position: location,
      label: labels[labelIndex++ % labels.length],
      animation: google.maps.Animation.DROP,
      map: map,
      draggable: true
    });


    //fix window info to dispaly actual data from points
    infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function() {
    infowindow.open(map, marker);

     //Working edit/delete buttons needs rendering new content
     $("button.edit_btn").click(function() {
      console.log("edit render");
    });

     $(".delete_btn").click(function() {
      var r = confirm("Are you sure?");
      if (r == true) {
        console.log("Point deleted")
      } else {
        console.log("Canceled");
      }
    });
    //////////////////////////////////////////////////////////////

      //working Ajax request needs to fix incoming data
      $.ajax({
        type: "GET",
        url:  "data_points",
        data: JSON,
        success: function (data, textStatus) {
          console.log(data);
          console.log("hey");
          data = result;
          for (var i = 0; i < data.length; i++) {
          }
          // console.log(array);
          $('#windowContentContent').append(result);
          return result;
        },
        error: function() {
          console.log("error getting data");
        }
      })
    });
    ///////////////////////////////////////////////////////

  }

  function savePosition() {
    var name = document.getElementById('name');
    var type = document.getElementById('type');
    var rating = document.getElementById('rating');
    var point = marker.getPosition();
    map.panTo(point);


    //POST data to external database
    //Working ajax req to post
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
      console.log("Successful data post")
      console.log(data);
      }
    });
  }

  $(() => {
    $("#toggle_list").click(function() {
      $('.locationInputs').toggle("fast");
    });

    $("#plus").click(function() {
      navigator.geolocation.getCurrentPosition(function(loc) {
        //change position to center of map insted of current location!!!
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
