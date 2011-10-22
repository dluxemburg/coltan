var WEEELS = {};

WEEELS.RideMap = function(divId,center){
  var mapOpts = {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl:false,
    streetViewControl:false,
    zoomControlOptions:{
      position:google.maps.ControlPosition.TOP_LEFT
    }
  };  
  if(center){
    mapOpts.center = center;
    this.centered = true;
  } else {
    this.centered = false;
  }
  this.rideMap = new google.maps.Map(document.getElementById(divId),mapOpts);
  this.directionsService = new google.maps.DirectionsService();
  this.directionsRenderer = new google.maps.DirectionsRenderer({
    map:this.rideMap
  });
  this.destination = new google.maps.Marker({
    visible:false,
    map:this.rideMap
  });
  this.origin = new google.maps.Marker({
    visible:false,
    map:this.rideMap
  });
  this.user = new google.maps.Marker({
    visible:false,
    map:this.rideMap,
    flat:true,
    icon:'self-marker.png'
  });
  if(center){
    this.setUser(center);
  }
};

WEEELS.RideMap.prototype.update = function(obj){
  var marker = this[obj.type];
  var name = {
    destination:'Destination',
    origin:'Origin'
  }
  marker.setPosition(obj.ll);
  marker.setVisible(true);
  /*this.rideMap.setCenter(obj.ll);
  if(this.origin.getPosition() != null && this.destination.getPosition() != null){
    this.origin.setVisible(false);
    this.destination.setVisible(false);
    this.doRoute();
    $(window).trigger('WEEELS:has_route');
  } else {
    marker.setVisible(true);
    $(window).trigger('WEEELS:has_no_route');
  }*/
};

WEEELS.RideMap.prototype.removeMarker = function(type){
  var marker = this[type];
  marker.setVisible(false);
  this.directionsRenderer.setDirections({routes:[]});
};

WEEELS.RideMap.prototype.removeRoute = function(type){
  this.origin.setVisible(true);
  this.destination.setVisible(true);
  this.directionsRenderer.setDirections({routes:[]});
};

WEEELS.RideMap.prototype.doRoute = function(){
  var self = this;
  var o = this.origin.getPosition();
  var d = this.destination.getPosition();
  this.origin.setVisible(false);
  this.destination.setVisible(false);
  this.directionsService.route({
    origin:o,
    destination:d,
    travelMode:google.maps.TravelMode.DRIVING
  },function(result,status){
    console.log('result: '+result);
    self.directionsRenderer.setDirections(result);
  })
};

WEEELS.RideMap.prototype.setUser = function(latitude,longitude){
  var position;
  if(arguments.length === 1){
    position = arguments[0];
  } else {
    position = new google.maps.LatLng(latitude,longitude);
  }
  this.user.setPosition(position);
  this.user.setVisible(true);
  if(!this.centered){
    this.rideMap.setCenter(position);
    this.centered = true;
  }
};

WEEELS.getHereHash = function(){
  var here = null;
  var ll = document.location.hash.substring(1).split(',');  
  if(ll.length === 2){
     here = new google.maps.LatLng(Number(ll[0]), Number(ll[1]));
  };
  return here;
};