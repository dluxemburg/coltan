Coltan.Geo = {};

Coltan.Geo.getCurrentLocation = function(fn){
  Coltan.debug('getting location');
  Coltan.debug('Ti.Platform.model = '+Ti.Platform.model);
  Coltan.debug('Ti.Platform.name = '+Ti.Platform.name);
  Coltan.debug('Ti.Geolocation.locationServicesEnabled = '+Ti.Geolocation.locationServicesEnabled);
  if(_.isIos()){
    Ti.Geolocation.purpose = Coltan.Geo.purpose;
  }

  Ti.Geolocation.getCurrentPosition(function(e) {
    var coords;
    if (!e.success || e.error) {
      if (Ti.Platform.model === 'google_sdk' || Ti.Geolocation.locationServicesEnabled === false) {
        Coltan.info('in android simulator, using hard-coded location fixture');
        coords = {
          latitude: 40.7298602,
          longitude: -73.9914152
        };
      } else {
        Coltan.error(e.error);
        fn(e.error);
      }
    } else {
      coords = e.coords;
    }
    coords.latitude = Number(coords.latitude).toFixed(6);
    coords.longitude = Number(coords.longitude).toFixed(6);
    Ti.App.Properties.setDouble('latitude', coords.latitude);
    Ti.App.Properties.setDouble('longitude', coords.longitude);
    // Ti.App.Properties.setInt('location_updated_at',(+ new Date()));
    Ti.App.fireEvent('location_updated', {
      coords: coords
    });
    fn(null, coords);
  });
};

Coltan.Geo.customReverseGeocode = function(coords,fn,context){
  Coltan.Geo.GoogleMapClient.executeRequest({
    uri:'/maps/api/geocode/json',  
    params:{
      sensor:true,
      latlng:coords.latitude+','+coords.longitude
    }
  },function(err,result){
    if(err){
      Coltan.error(err.message || err);
      fn(err);
      return;
    };
    if(result.status === 'OK'){
      fn(null,result.results);
    } else {
      Coltan.error('Google geocode error:');
      Coltan.error(JSON.stringify(result));
      fn({message:'Unknown error'});
    }
  });
};


Coltan.Geo.getLatestCoords = function(){
  return {
    latitude:Ti.App.Properties.getDouble('latitude',40.7298602),
    longitude:Ti.App.Properties.getDouble('longitude',-73.9914152),
    // updatedAt:Ti.App.Properties.getInt('location_updated_at')
  };
}

Coltan.Geo.makeGoogleBounds = function(coords){
  if(coords == null){
    coords = Coltan.Geo.getLatestCoords();
  }
  var lower = (coords.latitude - 0.1)+','+(coords.longitude - 0.1);
  var upper = (coords.latitude + 0.1)+','+(coords.longitude + 0.1);
  return lower+'|'+upper;
};

Coltan.Geo.customLocationSearch = function(str,fn){
  Coltan.Geo.GoogleMapClient.executeRequest({
    uri:'/maps/api/geocode/json',  
    params:{
      sensor:true,
      address:str,
      bounds:Coltan.Geo.makeGoogleBounds()
    }
  },function(err,result){
    if(err){
      Coltan.error(err.message || err);
      fn(err);
      return;
    };
    if(result.status === 'OK'){
      fn(null,result.results);
    } else {
      Coltan.error('Google geocode error:');
      Coltan.error(JSON.stringify(result));
      fn({message:'Unknown error'});
    }
  });
};

Coltan.Geo.createGoogleMapClient = function(){
  Coltan.Geo.GoogleMapClient = new Coltan.HTTP.APIClient({
    baseUrl:'http://maps.googleapis.com',
    logLevel:3
  });
};

Coltan.Geo.createGoogleMapClient();