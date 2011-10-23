Coltan.Events = {}

/**
 * Pass an existing `Backbone.Events`-based object or create a new one.
 * Assign it methods within the `createProxy` closure  so they retain access
 * to the proxy object even when bound to other objects as event handlers.
 * 
 * This is probably *ridiculously* inefficient - better to create the closure
 * only around the `handle` function and assign the remaining ones as methods
 * on the prototype.
 */

Coltan.Events.createProxy = function(proxy){
  if(!proxy){
    proxy = {};
    _.extend(proxy,Backbone.Events);
  };

  proxy.handle = function(event){
    proxy.trigger(event.type,event);
  };
  
  proxy.handleElement = function(element,eventNames){
    _(eventNames).each(function(eventName){
      elelment.addEventListener(eventName,proxy.handle);
    });
    return element;
  };
  
  proxy.createSpecialHandler = function(options){
    return function(event){
      event.handlerOptions = options;
      proxy.trigger(options.type || event.type,event);
    }
  };
  
  proxy.createElement = function(tagName,attributes,eventNames){
    return handleElement(createByTagName(tagName,properties),eventNames || ALL_EVENT_NAMES);
  };
  
  proxy.delegate = function(selector,eventName,method){
    proxy.bind('eventName',function(event){
      if(event.source.name === selector) method(event);
    });
  };
  
  return proxy;
  
};

var ALL_EVENT_NAMES = Coltan.Events.ALL_EVENT_NAMES = [
  'blur','change','click','close','complete',
  'dblclick','doubletap','focus',
  'open','regionChange','return','selected',
  'singletap','swipe','touchcancel','touchend',
  'touchmove','touchstart','twofingertap'
];