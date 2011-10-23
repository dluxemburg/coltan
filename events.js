Coltan.Events = {}

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
  
  return proxy;
  
};


var ALL_EVENT_NAMES = Coltan.Events.ALL_EVENT_NAMES = [
  'blur','change','click','close','complete',
  'dblclick','doubletap','focus',
  'open','regionChange','return','selected',
  'singletap','swipe','touchcancel','touchend',
  'touchmove','touchstart','twofingertap'
];