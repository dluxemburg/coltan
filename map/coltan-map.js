if (typeof module !== 'undefined' && module.exports) {
} else {
  var exports = Coltan.Map = {};
}

Coltan.Map.createNativeMapView = function(opts){
    opts.region.longitudeDelta = 0.015;
    opts.region.latitudeDelta = 0.015;
    var mapView = Ti.Map.createView(_.platform({
      defaults:{
        mapType: Titanium.Map.STANDARD_TYPE,
        regionFit:true,
        animate: true
      },
      ios:{
        userLocation: true
      },
      passed:opts
    })); 
    
    mapView._titles = {
      origin:'Pick-up',
      destination:'Drop-off'
    };
    
    
    mapView.ssetEndpoint = function(type,location){
      this.removeEndpoint(type);
      this[type] = Ti.Map.createAnnotation({
        title:this._titles[type],
        subtitle:location.address,
        latitude:location.coords.latitude,
        longitude:location.coords.longitude,
        animate:true
      });
      this.addAnnotation(this[type]);
    }
    
    mapView.removeEndpoint = function(type){
      if(this[type]){
        this.removeAnnotation(this[type]);
      }
      this[type] = null;
    };
    
    mapView.doRoute = function(data){
      this.ssetOrigin(data.origin);
      this.ssetDestination(data.destination);
      var route = this._route = {
      	name:"Itinerary",
      	points:[
      	  data.origin.coords,
      	  data.destination.coords
      	],
      	color:"#5656FF",
      	width:5
      };
      
      var mapLocation = {
        latitude:((Number(data.origin.coords.latitude)+Number(data.destination.coords.latitude))/2).toFixed(6),
        longitude:((Number(data.origin.coords.longitude)+Number(data.destination.coords.longitude))/2).toFixed(6),
        latitudeDelta:Math.abs(data.origin.coords.latitude-data.destination.coords.latitude)*2,
        longitudeDelta:Math.abs(data.origin.coords.longitude-data.destination.coords.longitude)*2
      };
      Ti.API.debug('route data: '+JSON.stringify(route));
      Ti.API.debug('mapLocation data: '+JSON.stringify(mapLocation));
      this.addRoute(route);
      this.setLocation(mapLocation);
      Ti.API.info('done doing route');
    };

    mapView.clearRoute = function(){
      if(this._route){
        this.removeRoute(this._route);
        this.route = null;
      }
    };

    mapView.removeOrigin = mapView.removeorigin = function(){
      this.removeEndpoint('origin');
    };

    mapView.removeDestination = mapView.removedestination = function(){
      this.removeEndpoint('destination');
    };
    
    mapView.ssetOrigin = mapView.ssetorigin = function(location){
      this.ssetEndpoint('origin',location);
    };

    mapView.ssetDestination = mapView.ssetdestination = function(location){
      this.ssetEndpoint('destination',location);
    };
    
    _.bindAll(mapView);
    
    return mapView;

}

Coltan.Map.createWebMapView = function(opts){
  opts = opts || {};
  var baseUrl = opts.baseUrl || '/Coltan/map/map.html';
  if(_.isAndroid()){
    baseUrl += '#';
    baseUrl += opts.region.latitude;
    baseUrl += ',';
    baseUrl += opts.region.longitude;
  }

  var mapOpts = {
    url:baseUrl
  };
  

  
  ['top','botton','left','right'].forEach(function(d){
    if(opts[d]){
      mapOpts[d] = opts[d];
    }
  });
  
  var webMapView = Ti.UI.createWebView(mapOpts);
  
  webMapView.execFunction = function(name,location){
    var evalString = name+"(";
    if(location){
      evalString += location.latitude;
      evalString += ",";
      evalString += location.longitude; 
    }
    evalString += ");";
    this.evalJS(evalString);
  };
  
  webMapView.ssetUserLocation = function(location){
    this.execFunction('rideMap.setUser',location);
  };
  
  webMapView.ssetorigin = webMapView.ssetOrigin = function(location){
    this.execFunction('setOrigin',location.coords);
  };
  
  webMapView.ssetdestination = webMapView.ssetDestination = function(location){
    this.execFunction('setDestination',location.coords);
  };
  
  webMapView.doRoute = function(location){
    this.execFunction('rideMap.doRoute');
  };
  
  webMapView.removeRoute = function(location){
    this.execFunction('rideMap.removeRoute');
  };
  
  webMapView.removeOrigin = function(location){
    this.execFunction('rideMap.removeOrigin');
  };
  
  webMapView.removeDestination = function(location){
    this.execFunction('rideMap.removeDestinaion');
  };
  
  
  _.bindAll(webMapView);

  webMapView.addEventListener('error', function(event) {
    Ti.API.error('webMap Error:');
    Ti.API.error(JSON.stringify(event));
    alert(JSON.stringify(event));
  });
  
  webMapView.addEventListener('load', function(event) {
    var self = this;
    if (this.url.split('#')[1] === 'ready') {
    }
    if(_.isIos()){
      setTimeout(function(){
        self.ssetUserLocation(opts.region);
      },1000);
    }
  });    
  return webMapView;
};