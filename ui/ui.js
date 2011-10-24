Coltan.UI = {};
Ti.include('activity-indicator.js');
Ti.include('buttons.js');
Ti.include('messages.js');

var createByTagName = Coltan.UI.createByTagName = function(tagName,attributes){
  attributes || (attributes = {});
  var el;
  if(tagName.indexOf('Coltan') > -1){
    return Coltan.UI['create'+tagName.replace('Coltan','')](attributes);
  } 
  _(Coltan.apps).chain().keys().each(function(name){
    if(tagName.indexOf(name) > -1){
      el = Coltan.apps[name].UI['create'+tagName.replace(name,'')](attributes);
    }
  });
  if(el) return el;
  return Ti.UI['create'+tagName](attributes);
};

/**
 * iOS
 */
 
 Coltan.UI.createRedNavButton = function(opts){
   opts = opts || {};
   opts.title = opts.title || 'Cancel';
   return Titanium.UI.createButtonBar({
   	labels:[opts.title],
   	style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
   	backgroundColor:Coltan.colors.navRed
   });
 };

 Coltan.UI.createBlueNavButton = function(opts){
   opts = opts || {};
   opts.title = opts.title || 'Done';
   return Titanium.UI.createButtonBar({
   	labels:[opts.title],
   	style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
   	backgroundColor:Coltan.colors.navBlue
   });
 };
 
 Coltan.colors = {
   navRed:'#EE0000',
   navBlue:'#5656FF'
 }
