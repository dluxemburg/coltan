if (typeof module !== 'undefined' && module.exports) {
} else {
  var exports = Coltan.UI;
}

exports.createStandardButton = function(opts){
  var button;
  if(_.isIos()){
    opts.labels = [''+opts.title];
    delete(opts.title);
    button = Ti.UI.createButtonBar(opts);
  } else {
    button = Ti.UI.createButton(opts);
  }
  return button;
}

exports.createCustomButton = function(opts){
  opts.fontSize = opts.fontSize || Math.ceil(opts.height*(0.5));
  opts.borderRadius = opts.borderRadius || (_.isIos() ? 10 : 5);
  opts.borderWidth = opts.borderWidth || 1;
  var button
  if(_.isIos()){
    button = Ti.UI.createButton({
      title:'',
      height:opts.height,
    	width:opts.width,
      backgroundImage:'/coltan/ui/images/gradient-button-back.png',
      backgroundSelectedImage:'/coltan/ui/images/gradient-button-back-down.png',
      borderColor:'#666',
      borderWidth:opts.borderWidth,
      borderRadius:opts.borderRadius,
      backgroundColor:'#ddd',
      style:1
    });
    button.disableButton = function(){
      this.disabled = true;
      this.touchEnabled = false;
      this.opacity = 0.8;
    };
    button.enabledButton = function(){
      this.disabled = false;
      this.touchEnabled = true;
      this.opacity = 1;
    };
  } else {
    button = Ti.UI.createView({
      title:'',
      height:opts.height,
    	width:opts.width,
      backgroundImage:'/coltan/ui/images/gradient-button-back.png',
      borderColor:'#666',
      borderWidth:opts.borderWidth,
      borderRadius:opts.borderRadius,
      backgroundColor:'#ddd'
    });
  }
  ['top','bottom','left','right'].forEach(function(p){
    if(opts[p]){
      button[p] = opts[p];
    }
  });
  if(opts.title){
      button.label = Ti.UI.createLabel({
        text:opts.title,
        touchEnabled:false,
        height:opts.height,
        width:opts.width,
        top:0,
        left:0,
        color:'#333',
        shadowColor:'#fff',
        font:{
          fontWeight:'bold',
          fontSize:opts.fontSize
        },
        textAlign:'center',
        shadowOffset:{
          x:1,
          y:1
        }
    });
  }else if(opts.image){
    button.label = Ti.UI.createImageView({
      touchEnabled:false,
      image:opts.image,
      height:opts.height,
      width:opts.width,
      top:0,
      left:0
    });
  }
  if(opts.imageDown){
    button._imageDown = opts.imageDown;
    button._imageUp = opts.image;
  }
  if(_.isAndroid()){
    button.turnOn = function(){
      this.backgroundImage = '/coltan/ui/images/gradient-button-back-down.png';
      this.color = '#000';
      if(this._imageDown){
        this.label.image = this._imageDown;
      }
    };
    button.turnOff = function(){
      this.backgroundImage = '/coltan/ui/images/gradient-button-back.png';
      this.color = '#333';
      if(this._imageUp){
        this.label.image = this._imageUp;
      }
    };
    _.bindAll(button);
    button.addEventListener('touchstart',button.turnOn);
    button.addEventListener('touchend',function(event){
      if(opts.type !== 'tabBar'){
        this.turnOff();
      }
      this.fireEvent('click');
    });
    
  }

  button.add(button.label);
  return button;
}


exports.createTabBar = function(opts){
  opts.borderRadius = opts.borderRadius || 5;
  opts.borderWidth = opts.borderWidth || 1;
  opts.borderColor = opts.borderColor || '#666';
  opts.height = opts.height || 32;
  opts.fontSize = opts.fontSize || 13;
  var tabBar = Ti.UI.createView({
    borderRadius:opts.borderRadius,
    borderWidth:opts.borderWidth,
    borderColor:opts.borderColor,
    hieght:opts.height,
    width:opts.width
  });
  tabBar.addEventListener('select',function(event){
    _(this.buttons).each(function(l){
      if(l.index === event.index){
        l.turnOn();
      } else {
        l.turnOff();
      }
    });
  });
  _.bindAll(tabBar);
  var width = Math.round(opts.width/opts.labels.length);
  tabBar.buttons = [];
  _(opts.labels).each(function(label,i){
    var button = coltan.UI.createCustomButton({
      type:'tabBar',
      borderWidth:0,
      borderRadius:opts.borderRadius,
      fontSize:opts.fontSize,
      height:opts.height,
      width:width,
      bottom:0,
      title:label.title ? label.title : null,
      image:label.image ? label.image : null,
      imageDown:label.imageDown ? label.imageDown : null
    });
    if(i === 0){
      button.left = 0;
    } else {
      button.right = 0;
    }
    button.index = i;
    button.borderRadius = 0;
    button.addEventListener('click',function(){
      tabBar.fireEvent('select',{index:this.index});
    });
    tabBar.add(button);
    tabBar.buttons.push(button);
    if(i > 0){
      var line = Ti.UI.createView({
        height:opts.height,
        width:1,
        backgroundColor:opts.borderColor,
        bottom:0,
        left:i*width
      });
      tabBar.add(line);
    }
  });
  return tabBar;
}

exports.createDisplayButton = function(opts){
  opts.fontSize = opts.fontSize || 13;
  opts.height = opts.height || 32;
  var value = Ti.UI.createLabel({
    text:opts.value,
    touchEnabled:false,
    height:opts.height,
    width:opts.width-35,
    top:0,
    left:10,
    color:'#000',
    shadowColor:'#fff',
    font:{
      fontWeight:'bold',
      fontSize:opts.fontSize+1
    },
    textAlign:'left',
    shadowOffset:{
      x:0.75,
      y:0.75
    }
  });
  var arrow = Ti.UI.createImageView({
    image:'/coltan/ui/images/button-arrow.png',
    width:8,
    height:13,
    right:10,
    top:(opts.height-13)/2,
    touchEnabled:false
  })
  var button;
  if(_.isIos()){
    button = Ti.UI.createButton({
      height:opts.height,
      backgroundImage:'/coltan/ui/images/gradient-button-back-down.png',
      backgroundSelectedImage:'/coltan/ui/images/ios-button-select.png',
    	width:opts.width,
      borderRadius:5,
    });
  } else {
    button = Ti.UI.createView({
      height:opts.height,
      backgroundImage:'/coltan/ui/images/gradient-button-back-down.png',
    	width:opts.width,
      borderRadius:5
    });
  }
  button.add(value);
  button.add(arrow);
  button.ssetValue = function(text){
    value.text = text;
  }
  button.addEventListener('touchstart',function(){
    if(_.isAndroid()){
      button.backgroundImage = '/coltan/ui/images/android-button-select.png';
    } else {
      value.color = '#fff';
      value.shadowColor = '#333';
      arrow.image = '/coltan/ui/images/button-arrow-white.png';
    }
  });
  button.addEventListener('touchend',function(){
    if(_.isAndroid()){
      button.backgroundImage = '/coltan/ui/images/gradient-button-back-down.png';
      button.fireEvent('click');
    } else {
      value.color = '#000';
      value.shadowColor = '#fff';
      arrow.image = '/coltan/ui/images/button-arrow.png';
    }
  });
  return button;
}  