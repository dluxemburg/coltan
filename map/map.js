if (typeof module !== 'undefined' && module.exports) {
} else {
  var exports = Coltan.Map = {};
}


Coltan.Map.createWebMapView = function(opts){
  opts = opts || {};
  var baseUrl = opts.baseUrl || '/coltan/map/map.html';
  if(_.isAndroid()){
    baseUrl += '#';
    baseUrl += opts.region.latitude;
    baseUrl += ',';
    baseUrl += opts.region.longitude;
  }

  var mapOpts = {
    url:baseUrl
  };
  
  ['top','botton','left','right','height','width'].forEach(function(d){
    if(opts[d]){
      mapOpts[d] = opts[d];
    }
  });
  
  var webMapView = Ti.UI.createWebView(mapOpts);
  
  webMapView.execFunction = function(name){
    var args = _(arguments)
      .chain()
      .toArray()
      .map(function(a){
        return JSON.stringify(a);
      }).
      value()
      .slice(1)
      .join(',');
    this.evalJS(name+"("+args+");");
  };

  _.bindAll(webMapView);

  webMapView.addEventListener('error', function(event) {
    Ti.API.error('webMap Error:');
    Ti.API.error(JSON.stringify(event));
    alert(JSON.stringify(event));
  });
  
  webMapView.addEventListener('load', function(event) {
    if (this.url.split('#')[1] === 'ready') {}
  });   
   
  return webMapView;
};