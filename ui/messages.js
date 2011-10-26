if (typeof module !== 'undefined' && module.exports) {
  Ti.API.debug('[COLTAN] Exporting `Coltan.UI.addWindowMessages` as CommonJS module');
} else {
  Ti.API.debug('[COLTAN] Exporting `Coltan.UI.addWindowMessages` with `Ti.include`');
  var exports = Coltan.UI
}

exports.addWindowMessages = function(window,options){
  options = options || {};
  window.messageWin = Titanium.UI.createWindow({
  	height:60,
  	width:270,
  	bottom:70,
  	borderRadius:10,
  	touchEnabled:false,
  	orientationModes : [
  	Titanium.UI.PORTRAIT,
  	Titanium.UI.UPSIDE_PORTRAIT,
  	Titanium.UI.LANDSCAPE_LEFT,
  	Titanium.UI.LANDSCAPE_RIGHT
  	]
  });
  window.messageWin.durationShow = options.durationShow || 3000;
  window.messageWin.durationFade = options.durationFade || 1000;
  window.messageView = Titanium.UI.createView({
  	height:60,
  	width:270,
  	borderRadius:10,
  	backgroundColor:'#000',
  	opacity:0.7,
  	touchEnabled:false
  });
  window.messageLabel = Titanium.UI.createLabel({
  	text:'',
  	color:'#fff',
  	width:250,
  	height:'auto',
  	font:{
  		fontFamily:'Helvetica Neue',
  		fontSize:14
  	},
  	left:10,
  	right:10,
  	textAlign:'center'
  }); 
  window.messageWin.add(window.messageView);
  window.messageWin.add(window.messageLabel);
  window.addEventListener('pop_message',popMessageHandler);
  
}

var popMessageHandler = function(event){
  var self = this;
  var durationShow = event.durationShow || self.messageWin.durationShow;
  var durationFade = event.durationFade || self.messageWin.durationFade;
  var anim = Ti.UI.createAnimation({
    duration:durationFade,
    opacity:0
  })
  self.messageLabel.text = event.message;   
  self.opacity = 1;
  self.messageWin.open();
  setTimeout(function(){
    self.messageWin.animate(anim);
    setTimeout(function(){
      self.messageWin.close();
    },durationFade);
  },durationShow);
};