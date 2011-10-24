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
 
 /**
  * Colors
  */
 
 
 Coltan.colors = {
   navRed:'#BD1421',
   navBlue:'#5656FF'
 }
 
 /**
  * Tables
  */
  
  Coltan.UI.tableViewConfirmDelete = function(opts,table,callback){
    opts = opts || {};
    var fn = function(deletion){
      // var self = this;
      var dialog = Titanium.UI.createAlertDialog(_.extend({
        title: 'Are You Sure?',
        message: 'This item will be deleted.',
        buttonNames: ["Yes, remove", "No, don't"],
        cancel: 1
      },opts));
      dialog.addEventListener('click', function(event) {
        if(event.index === 1){
          table.appendRow(deletion.row);
        }else if(typeof(callback) === 'function'){
          callback(function(){
            table.appendRow(deletion.row);
          });
        };
      });
      dialog.show();
    }
    return fn;
  };
 
  /**
   * Misc
   */
  
   Coltan.UI.createOverlayArea = function(opts){
     opts.height = opts.height || 'auto';
     opts.width = opts.width || 'auto';
     var overlayArea = Ti.UI.createView(opts);
     overlayArea.overlay = Ti.UI.createView({
       height:opts.height,
       width:opts.width,
       backgroundColor:'#000',
       opacity:0.75
     });
     overlayArea.add(overlayArea.overlay);
     return overlayArea;
   };
  