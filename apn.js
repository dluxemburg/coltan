Coltan.APN = {};

Coltan.APN.register = function(){
  Coltan.info('Attempting to register for push notifications');
  Titanium.Network.registerForPushNotifications({
  	types: [
  		Titanium.Network.NOTIFICATION_TYPE_BADGE,
  		Titanium.Network.NOTIFICATION_TYPE_ALERT,
  		Titanium.Network.NOTIFICATION_TYPE_SOUND
  	],
  	success:function(event) {
  		var deviceToken = event.deviceToken;
  		alert(event);
  		Coltan.info("Device registered for APN. Device token: \n\n"+deviceToken);
  		Ti.App.Properties.setString('pushToken',deviceToken);
  	},
  	error:function(event) {
  		alert(event);
  		Coltan.warn("Error during APN registration: "+event.error);
  	},
  	callback:function(event) {
  		alert(event);
  		Coltan.info("Received a push notification\n\nEvent:\n\n"+Coltan.util.inspect(event));
  		Ti.App.fireEvent('push_event',event.data);
  	}
  });
};

Coltan.APN.registerIfNotSaved = function(){
  
  if(!Coltan.APN.hasToken()) Coltan.APN.register();
};

Coltan.APN.hasToken = function(){
  return Ti.App.Properties.hasProperty('pushToken');
};

Coltan.APN.getToken = function(){
  return Ti.App.Properties.getString('pushToken');
};

Coltan.APN.clearToken = function(){
  Ti.App.Properties.removeProperty('pushToken');
};