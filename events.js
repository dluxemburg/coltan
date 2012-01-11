Coltan.Events = {}

/**
 * Pass an existing `Backbone.Events`-based object or create a new one.
 * Assign it methods within the `createProxy` closure  so they retain access
 * to the proxy object even when bound to other objects as event handlers.
 * 
 * This is probably ridiculously inefficient - better to create the closure
 * only around the `handle` function and assign the remaining ones as methods
 * on the prototype.
 */

Coltan.Events.createProxy = function(proxy){
  if(!proxy){
    proxy = {};
    _.extend(proxy,Backbone.Events);
  };
  
  /**
   * Handle an event by proxying it to the `proxy`
   * object
   */

  proxy.handle = function(event){
    proxy.trigger(event.type,event);
  };
  
  /**
   * Bind the `proxy.handle` function to an elements for
   * a list of event names. If no list is supplied and
   * the `proxy` object has an `events` property (i.e., 
   * it's a `View` instance), use only the ones included there
   * (the first word of each key). If neither is available, use
   * all of them.
   * 
   * **TO DO:** *selectively* bind the handler to UI
   * elements matching selectors
   */
  
  
  proxy.handleElement = function(element,eventNames){
    if(!eventNames && proxy.events){
      eventNames = _(proxy.events).map(function(method,evName){
        return evName.split(' ')[0];
      });
    } else if(!eventNames){
      eventNames = ALL_EVENT_NAMES;
    } 
    _(eventNames).each(function(eventName){
      element.addEventListener(eventName,proxy.handle);
    });
    return element;
  };
  
  /**
   * Create a special handler for to bind in special situations:
   * 
   * ```
   * button.addEventListener('click',proxy.createSpecialHandler({type:'buttonClick'}));
   * ```
   * 
   * Will send a `buttonClick` event to the `proxy` object instead of a `click`.
   */
  
  
  proxy.createSpecialHandler = function(options){
    return function(event){
      event.handlerOptions = options;
      proxy.trigger(options.type || event.type,event);
    }
  };
  
  /**
   * Convinience method for creating a UI element and assigning it
   * to the event proxy
   */
  
  
  proxy.createHandledElement = function(tagName,attributes,eventNames){
    return handleElement(createByTagName(tagName,properties),eventNames);
  };
  
  /**
   * The central delegate method, binds hanlder methods
   * to proxied events
   * 
   * **TO DO:**
   * - Rename
   * - Smarter selectors (className);
   */
  
  proxy.handleDelegate = function(selector,eventName,method){
    proxy.bind(eventName,function(event){
      Ti.API.debug(event);
      if(event.source && event.source.name === selector) method(event);
    });
  };
  
  return proxy;
  
};

/**
 * All the event names, for when it's important to catch everything?
 */

var ALL_EVENT_NAMES = Coltan.Events._ALL_EVENT_NAMES = [
  'blur','change','click','close','complete',
  'dblclick','doubletap','focus',
  'open','regionChange','return','selected',
  'singletap','swipe','touchcancel','touchend',
  'touchmove','touchstart','twofingertap'
];