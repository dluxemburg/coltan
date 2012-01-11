if (typeof module !== 'undefined' && module.exports) {
} else {
  var exports = Coltan.APN = {};
}
Coltan.APN.register = function(fn){
  Coltan.info('Attempting to register for push notifications');
  Titanium.Network.registerForPushNotifications({
  	types: [
  		Titanium.Network.NOTIFICATION_TYPE_BADGE,
  		Titanium.Network.NOTIFICATION_TYPE_ALERT,
  		Titanium.Network.NOTIFICATION_TYPE_SOUND
  	],
  	success:function(event) {
  		Coltan.info("Device registered for APN. Device token: \n\n"+event.deviceToken);
  		Ti.App.Properties.setString('pushToken',event.deviceToken);
  		if(fn) fn(null,event.deviceToken);
  	},
  	error:function(event) {
  		Coltan.warn("Error during APN registration: "+event.error);
  		if(fn) fn(event.error);
  	},
  	callback:function(event) {
  		Coltan.info("Received a push notification");
  		Coltan.info("event: "+JSON.stringify(event.data))
  		Ti.App.fireEvent('push_event',event.data);
  	}
  });
};

Coltan.APN.asyncEnsureSaved = function(fn){
  if(Coltan.APN.hasToken()){
    fn(null,Coltan.APN.getToken())
  } else {
    Coltan.APN.register(fn);
  }
}

Coltan.APN.registerIfNotSaved = function(){
  if(!Coltan.APN.hasToken()) Coltan.APN.register();
};

Coltan.APN.hasToken = function(){
  return Ti.App.Properties.hasProperty('pushToken') && !_.isEmpty(Ti.App.Properties.getString('pushToken'));
};

Coltan.APN.getToken = function(){
  return Ti.App.Properties.getString('pushToken');
};

Coltan.APN.clearToken = function(){
  Ti.App.Properties.removeProperty('pushToken');
};