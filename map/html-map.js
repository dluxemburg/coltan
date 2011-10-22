var mapDiv = document.getElementById("mapDiv");
mapDiv.style.width = '100%';
mapDiv.style.height = '100%';
  
var rideMap = new WEEELS.RideMap('mapDiv',WEEELS.getHereHash());

var loaded = false;
google.maps.event.addListener(rideMap.rideMap,'tilesloaded',function(){
  if(loaded === false){
    document.location.hash = 'ready';
    loaded = true;
  }
});

var setOrigin = function(latitude,longitude){
  rideMap.update({
    type:'origin',
    ll:new google.maps.LatLng(latitude,longitude)
  });
};

var setDestination = function(latitude,longitude){
  rideMap.update({
    type:'destination',
    ll:new google.maps.LatLng(latitude,longitude)
  });
};

var removeOrigin = function(){
  rideMap.removeMarker('origin');
};

var removeDestination = function(){
  rideMap.removeMarker('destination');
};