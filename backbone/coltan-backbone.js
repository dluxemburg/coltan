Coltan.Backbone = {};

var eventSplitter = /^(\S+)\s*(.*)$/;

_.extend(Backbone.View.prototype,{
  
  tagName:Ti.UI.createView,
  
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
      this.el = this.tagName(attrs);
    } 
  },
  
  make:function(){
    if (!this.el) {
      var attrs = this.attributes || {};
      this.el = this.tagName(attrs);
    };
    return this;
  },
  
  make:function(){
    if (!this.el) {
      var attrs = this.attributes || {};
      this.el = this.tagName(attrs);
    } 
  },
  
  remove:function(){
    this.el.remove();
    return this;
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