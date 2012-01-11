/**
 * #Server Client
 */
 
/** 
 * Object initializer for HTTP API server client.
 * 
 * @param {Object} **`opts`**: Options hash---
 * @opt {String} **`baseUrl`**: Base URL for the API server; required
 * @opt {Number} **`logLevel`**: Logging detail; 0 = none (default), 1 = warn, 2 = info, 3 = debug 
 * @api public
 */
 
Coltan.HTTP = {};

Coltan.HTTP.APIClient = function(opts){
  if(!opts.baseUrl){ 
    throw new Error('APIClient: Must specify base URL. Evals to: '+opts.baseUrl);
  }
  this.baseUrl = opts.baseUrl;
  this.methodOverride = opts.methodOverride || false;
  
  
  /**
   * This is insane but android doesn't like it otherwise
   */
  
  
  opts.logLevel = opts.logLevel || Coltan.loglevel;
  if(opts.logLevel >= 3){
    this._debug = function(msg){Ti.API.debug(msg);}
  } else {
    this._debug = function(msg){return;}
  }
  
  if(opts.logLevel >= 2){
    this._info = function(msg){Ti.API.info(msg);}
  } else {
    this._info = function(msg){return;}
  }
  
  if(opts.logLevel >= 1){
    this._warn = function(msg){Ti.API.warn(msg);}
  } else {
    this._warn = function(msg){return;}
  }
  
  
  this.noConnectionMessage = opts.noConnectionMessage || 'Your device must be connected to the internet in order to communicate with the application server. Please try again later.';
};

/**
 * Alternative handler for
 * disabled logging calls.
 */

Coltan.HTTP.APIClient.prototype._noop = function(msg){
  return;
};

Coltan.HTTP.APIClient.prototype._parseQueryString = function(str) {
  var item, pair;
  var data = {};
  var arr = str.split('&');
  for (var i = 0, len = arr.length; i < len; i++) {
    item = arr[i];
    pair = item.split('=');
    if (pair[1] === 'true') {pair[1] = true;}
    if (pair[1] === 'false') {pair[1] = false;}
    data[pair[0]] = pair[1];
  }
  this._debug('`_parseQueryString`: '+JSON.stringify(data));
  return data;
};

Coltan.HTTP.APIClient.prototype._fullPercentEncode = function(s) {
  if (s === null) {
    return "";
  } else {
    return encodeURIComponent(String(s))
          .replace(/\!/g, "%21")
          .replace(/\*/g, "%2A")
          .replace(/\'/g, "%27")
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29");
  }
};

Coltan.HTTP.APIClient.prototype._makeEncodedPair = function(k, v) {
  var str = this._fullPercentEncode(k)+'='+this._fullPercentEncode(v);
  this._debug('`_makeEncodedPair`: '+str);
  return str;
};

Coltan.HTTP.APIClient.prototype._querystringify = function(obj) {
  var arr = [];
  for (var k in obj) {
    arr.push(this._makeEncodedPair(k, obj[k]));
  }
  var str = arr.join('&');
  this._debug('`_queryStringify`: '+str);
  return str;
};

Coltan.HTTP.APIClient.prototype._checkConnection = function() {
  var self = this;
  if (!Titanium.Network.online) {
    Titanium.UI.createAlertDialog({
      title: 'No Network Connection',
      message: self.noConncectionMessage,
      buttonNames: ['OK']
    }).show();
    return false;
  } else {
    return true;
  }
};

Coltan.HTTP.APIClient.prototype.executeRequest = function(obj,fn) {
  if(!this._checkConnection()){
    return fn({message:this.noConnectionMessage});
  }
  
  var self = this; var fullUrl;
  
  obj.method = obj.method || 'GET';
  obj.method = obj.method.toUpperCase();
  
  var xhr = Ti.Network.createHTTPClient({
    onload: function() {
      var result;
      self._info('got server request response');
      self._debug(this.responseText);
      try {      
        result = JSON.parse(this.responseText);
        fn(null,result);
      } catch (parseError) {
        Ti.API.error('Parse Error: '+JSON.stringify(parseError));
        fn(parseError);
      }
    },
    onerror: function(xhrError) {
      Ti.API.error('XHR Error: ' + JSON.stringify(xhrError));
      fn(xhrError);
    }
  });
  xhr.setTimeout(20000);
  if(this.methodOverride){
    if (obj.method !== 'GET') {
      obj.params._method = obj.method;
    }
    self._info('making api request to ' + obj.uri + ' endpoint with method override');
    fullUrl = this.baseUrl + obj.uri;
    fullUrl += (obj.params != null ? '?' + this._querystringify(obj.params) : '');
    self._debug('full url: ' + obj.method + ' ' + fullUrl);
    xhr.open('GET', fullUrl);
    xhr.setTimeout(20000);
    xhr.send();
  } else {
    self._info('making api request to ' + obj.uri + ' endpoint with method override');
    if(obj.method === 'GET' || obj.method === 'DELETE') {
      fullUrl = this.baseUrl + obj.uri;
      fullUrl += (obj.params != null ? '?' + this._querystringify(obj.params) : '');
      self._debug('full url: ' + obj.method + ' ' + fullUrl);
      xhr.open(obj.method, fullUrl);
      xhr.send();
    } else {
      fullUrl = this.baseUrl + obj.uri;
      var body = obj.params != null ? this._querystringify(obj.params) : null;
      self._debug('full url: ' + obj.method + ' ' + fullUrl);
      self._debug('body: ' + body);
      xhr.open(obj.method, fullUrl);
      xhr.send(body);
    }
  }
};