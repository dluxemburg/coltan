/**
 * Extend/modify `Backbone.View` to work in Titanium
 * environment.
 */
 
/**
 * Need access to `viewOptions` for changes to `_configure`.
 */

var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

_.extend(Backbone.View.prototype,{
  
  /**
   * Tag names are passed to `Coltan.UI.createByTagName`,
   * so the default action to create `View.el` is 
   * Ti.UI.createView([attributes]).
   */
  
  tagName:'View',
  
  /**
   * Existing `remove` method is DOM-specific. In Titanium
   * we *should* be able to set the reference equal to `null`.
   * Explicitly removing the element from the UI requires access
   * to its parent. If that information has been saved to the view
   * instance as `_parent`, try to do that too/first.
   */
   
   remove:function(){
     if(this._parent && _.isFunction(this._parent.remove)){
       this._parent.remove(this.el);
     }
     this.el = null;
   },
   
  
  /**
   * Existing `make` method is DOM-specific. Use
   * `Coltan.UI.createByTagName instead.
   */
  
  make:Coltan.UI.createByTagName,

  /**
   * Existing `delegateEvents` method is DOM-specific. Use
   * the `addEventListener` listener method shared by Titanium
   * UI elements instead.
   * 
   * **TO DO:** Support for sub-elements/"selectors"
   */
    
  
  delegateEvents : function(events) {
    if (!(events || (events = this.events))) return;
    if (_.isFunction(events)) events = events.call(this);
    for (var key in events) {
      var method = this[events[key]];
      if (!method) throw new Error('Event "' + events[key] + '" does not exist');
      method = _.bind(method, this);
      var eventName = key.split(' ');
      if(eventName.length === 1){
        this.el.addEventListener(eventName[0],method);
      } else {
        if(_.isFunction(this.handleDelegate)) {
          this.handleDelegate(eventName[1],eventName[0],method);
        } else {
          Coltan.warn("View instance tried to delegate events but it's not a Coltan.Events.Proxy");
        }
      }
    }
  },
  
  /**
   * Hijacking `_configure` for the opportunity to **conditionally** (based
   * on options) assign a `Coltan.Events.Proxy` methods to the view instance.
   * (Need to include `viewOptions` for local access as well.)
   */
  
   _configure : function(options) {
     if (this.options) options = _.extend({}, this.options, options);
     for (var i = 0, l = viewOptions.length; i < l; i++) {
       var attr = viewOptions[i];
       if (options[attr]) this[attr] = options[attr];
     }
     this.options = options;
     if(this.options.coltanProxy === true) Coltan.Events.createProxy(this);
   },
    
  /**
   * Existing `_ensureElement` method includes DOM-specific conditional
   * case (when it's passed a string it looks for it with `$`). Exclude
   * that just in case and hold off on assigning `id` and `class`/`className`
   * for now (pending work on event delegation that may depend on this)
   * the `addEventListener` listener method shared by Titanium
   * UI elements instead.
   * 
   * **TO DO:** Support for sub-elements/"selectors"
   */
  
  _ensureElement : function() {
    if (!this.el) {
      var attrs = this.attributes || {};
      //if (this.id) attrs.id = this.id;
      //if (this.className) attrs.className = this.id;
      this.el = this.make(this.tagName, attrs);     
    } 
  }
});

/**
 * **DO TO**: Rework `Coltan.HTTP` to expose a simple
 * request builder compatible with `Backbone.sync` (in
 * addition to the programmatic APIClient prototype).
 */

Backbone.sync = function(method, model, options) {
  var callback = options.success;
  var type = methodMap[method];
  var url = options.url || getUrl(model);
  if(!url) {
    urlError();
  }
  
  var obj = {
    method:type,
    params:model.toJSON(),
    uri:url
  };
  
  return model._APIClient.executeRequest(obj,callback);
};
