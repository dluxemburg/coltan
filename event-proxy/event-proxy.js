/**
 * `Coltan.EventProxy`
 */

Coltan.EventProxy = function(){
  this._addHanlder();
};

/**
 * Inherit from `Backbone.Events`
 */

Coltan.inherits(Coltan.EventProxy,Backbone.Events);

/**
 * `_addHandler` creates private hanlder (`_handle`) method within 
 * a closure to maintain access to the EventProxy instance when
 * binding to an element
 */

Coltan.EventProxy.prototype._addHandler = function(event){
  var self = this;
  this._handle = function(event){
    self.trigger(event.type,event);
  }
};

Coltan.EventProxy.prototype.handleElement = function(element,eventNames){
  _(eventNames).each(function(eventName){
    elelment.addEventListener(eventName,this._handle);
  },this);
  return element;
};

Coltan.EventProxy.prototype.specialHandler = function(options){
  var self = this;
  return function(event){
    this.trigger(options.type || event.type,_.extend(event,options));
  }
};

Coltan.EventProxy.prototype.createTiElement = function(name,properties){
  return this.handleElements(Ti.UI['create'+name](properties),this.ALL_EVENT_NAMES);
};

Coltan.EventProxy.prototype.ALL_EVENT_NAMES = [
  'blur','change','click','close','complete'
  'dblclick','doubletap','focus',
  'open','regionChange','return','selected',
  'singletap','swipe','touchcancel','touchend',
  'touchmove','touchstart','twofingertap'
]