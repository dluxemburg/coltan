_.mixin({
  isIos:function(){
    return (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'); 
  },
  isAndroid:function(){
    return Ti.Platform.osname === 'android';
  },
  platform:function(options){
    var composite;
    ['defaults','ios','android','passed'].forEach(function(p){
      options[p] = options[p] || {};
    });
    if(_.isIos()) composite = _.extend(options.defaults,options.ios);
    if(_.isAndroid()) composite = _.extend(options.defaults,options.android);
    return _.extend(composite,options.passed);
  },
  capitalize:function(str){
    if(!str || _.isEmpty(str)) return '';
    return str[0].toUpperCase() + str.slice(1);
  }
})