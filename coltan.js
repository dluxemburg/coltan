/**
 * Coltan 0.1
 * (c) 2011 Daniel Luxemburg
 * MIT licensed
 */

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
Ti.include('debug.js');
Ti.include('util.js');
Ti.include('http.js');
Ti.include('geo.js');
Ti.include('ui/ui.js');
Ti.include('map/map.js');
Ti.include('events.js');
Ti.include('apps.js');
Ti.include('coltan-backbone.js');