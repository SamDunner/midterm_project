(function() {
  var map;
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;
  var marker;
  var infowindow;
  var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
        '<div id="bodyContent">'+
        '<p>INFO BLA BLA BLA BLA</p>'+
        '<button class="edit_btn" type="button">Edit</button>'+
        '<button class="delete_btn" type="button">Delete</button>'+
        '</div>'+
        '</div>';

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

    infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);

       $.ajax({
          type: "GET",
          url: location.pathname + "data_points",
          data: {
            name: name.value,
            type: type.value,
            rating: rating.value,
            latitude: point.lat(),
            longitude: point.lng()
          },
          success: function (data) {
          console.log(data);
          },
          error: function (data) {
            console.log(data)
          }
      });
    });
  }
  //Fix promt buttons!!!!
  function confirmDelete() {
    var x;
    console.log("delete")
    if (confirm("Press a button!") == true) {
        x = "You pressed OK!";
    } else {
        x = "You pressed Cancel!";
    }
  }

  function savePosition() {
    console.log("save pos");

    var name = document.getElementById('name');
    var type = document.getElementById('type');
    var rating = document.getElementById('rating');
    var point = marker.getPosition();
    map.panTo(point);

    // POST data to external database
    // $.ajax({
    //   type: "POST",
    //   url: location.pathname + "data_points",
    //   data: {
    //     name: name.value,
    //     type: type.value,
    //     rating: rating.value,
    //     latitude: point.lat(),
    //     longitude: point.lng()
    //   },
    //   success: function (data) {
    //   console.log(data);
    //   }
    // });
    $('.locationInputs').toggle("fast");
  }

  $(() => {
    $("#toggle_list").click(function() {
      $('.locationInputs').toggle("slow");
    });

    $(".edit_btn").click(function() {
      console.log("edit")
    });

    $(".delete_btn").click(confirmDelete);

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