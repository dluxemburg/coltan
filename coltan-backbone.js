_.extend(Backbone.View.prototype,{
  
  tagName:'View',
  
  delegate:function(element,name){
  },
  
  delegateEvents : function(events) {
    if (!(events || (events = this.events))) return;
    if (_.isFunction(events)) events = events.call(this);
    for (var key in events) {
      var method = this[events[key]];
      if (!method) throw new Error('Event "' + events[key] + '" does not exist');
      var eventName = key;
      method = _.bind(method, this);
      this.el.addEventListener(eventName,method);
    }
  },
  
  _ensureElement:function(){
    if (!this.el) {
      var attrs = this.attributes || {};
      this.el = this.make(this.tagName,attrs);
    } 
    var self = this;
    
  },
  
  make:createByTagName,
  
  remove:function(){
    if(this._parent){
      try{
        this._parent.remove(this.el)
      }catch(e){
        Ti.API.warn('Error trying to remove a Backbone view');
        Ti.API.warn(e.message || e);
      }
    }
  }
});


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
  
  return Backbone.APIClient.executeRequest(obj,callback);
};
