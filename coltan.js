Ti.API.info('Loading `Coltan` shared resource folder');

var COLTANT_DEBUG = true;

var Coltan = {
  debug: function(msg){
    if(COLTANT_DEBUG) Ti.API.debug('[COLTAN] '+msg);
  },
  setDebug: function(toggle){
    COLTAN_DEBUG = !!toggle;
  }
};

Coltan.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

Coltan.eventProxy = function(event){
  Ti.API.info('[COLTAN PROXY] Got '+event.type+' event:');
  Ti.API.info(Coltan.Util.inspect(event));
  Ti.API.info('[COLTAN PROXY] Value of `this`:');
  Ti.API.info(Coltan.Util.inspect(event));
  Ti.App.fireEvent(event.type);
}

Ti.include('backbone/coltan-backbone.js');
Ti.include('http/coltan-http.js');
Ti.include('geo/coltan-geo.js');
Ti.include('map/coltan-map.js');
Ti.include('ui/coltan-ui.js');

Coltan.Util = {};
Ti.include('util/coltan-util.js')