/**
 * Coltan 0.1
 * (c) 2011 Daniel Luxemburg
 * MIT licensed
 */

var Coltan = {};

Coltan.VERSION = '0.1';

Ti.include('support/underscore.js');
Ti.include('support/backbone.js');
Ti.include('underscore-mixins.js');
Ti.include('debug.js');
Ti.include('util.js');
Ti.include('http.js');
Ti.include('geo.js');
Ti.include('ui/ui.js');
Ti.include('events.js');
Ti.include('coltan-backbone.js');

Coltan.apps = {};

Coltan.appNames = function(){
  return _.keys(Coltan.apps);
}

Coltan.createApp = function(name,app){
  Coltan.apps[name] = app;
}