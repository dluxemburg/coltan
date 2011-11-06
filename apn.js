if (typeof module !== 'undefined' && module.exports) {
} else {
  var exports = Coltan.APN = {};
}
exports.register = function(){
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
  	},
  	error:function(event) {
  		Coltan.warn("Error during APN registration: "+event.error);
  	},
  	callback:function(event) {
  		Coltan.info("Received a push notification\n\nEvent:\n\n"+Coltan.util.inspect(event));
  		Ti.App.fireEvent('push_event',event.data);
  	}
  });
};

exports.registerIfNotSaved = function(){
  if(!Coltan.APN.hasToken()) Coltan.APN.register();
};

exports.hasToken = function(){
  return Ti.App.Properties.hasProperty('pushToken');
};

exports.getToken = function(){
  return Ti.App.Properties.getString('pushToken');
};

exports.clearToken = function(){
  Ti.App.Properties.removeProperty('pushToken');
};