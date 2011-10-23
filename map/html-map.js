var mapDiv = document.getElementById("mapDiv");
mapDiv.style.width = '100%';
mapDiv.style.height = '100%';
  
var loaded = false;
google.maps.event.addListener(rideMap.rideMap,'tilesloaded',function(){
  if(loaded === false){
    document.location.hash = 'ready';
    loaded = true;
  }
});