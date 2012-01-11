/**
 * Coltan 0.1
 * (c) 2011 Daniel Luxemburg
 * MIT licensed
 */

Ti.API.info('Loading `Coltan` shared resource folder');

var Coltan = {};

Coltan.VERSION = '0.1';

/**
 * Use `Ti.include` instead of CommonJS `require` for now because
 * of memory issues resulting from creation of additional contexts
 * and questions around caching/optimization that would be relied on
 * as a result of internal dependencies
 * 
 * **TO DO:** Test different export strategies, consider `Ti.include`-ing
 * into a single module file to exports, consider build script
 */

Ti.include('support/underscore.js');
Ti.include('support/backbone.js');
Ti.include('underscore-mixins.js');
Ti.include('util.js');
Ti.include('debug.js');
Ti.include('http.js');
Ti.include('geo.js');
Ti.include('ui/ui.js');
Ti.include('map/map.js');
Ti.include('events.js');
Ti.include('apps.js');
Ti.include('coltan-backbone.js');
//Coltan.APN = require('coltan/apn');
if(_.isIos()) Ti.include('apn.js');

var mods = [];
for(m in Coltan){
  mods.push(m);
}

Ti.API.info('`Coltan` resources successfully loaded with the following modules: ')
Ti.API.info(mods.join(', '));

if (typeof module !== 'undefined' && module.exports) {
} else {
  var exports = Coltan;
}