if (typeof module !== 'undefined' && module.exports) {
} else {
  var exports = Coltan.UI;
}
exports.actIndInit = function() {
  var INDICATOR, actInd, closeIndicator, hideIndicator, indWin, showIndicator;
  INDICATOR = false;
  indWin = null;
  actInd = null;
  if (_.isIos()) {
    showIndicator = function() {
      var indView, message;
      indWin = Titanium.UI.createWindow({
        height: 150,
        width: 150
      });
      indView = Titanium.UI.createView({
        height: 150,
        width: 150,
        backgroundColor: '#000',
        borderRadius: 10,
        opacity: 0.8
      });
      indWin.add(indView);
      actInd = Titanium.UI.createActivityIndicator({
        style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
        height: 30,
        width: 30
      });
      indWin.add(actInd);
      message = Titanium.UI.createLabel({
        text: 'Loading',
        color: '#fff',
        width: 'auto',
        height: 'auto',
        font: {
          fontSize: 20,
          fontWeight: 'bold'
        },
        bottom: 20
      });
      indWin.add(message);
      indWin.open();
      actInd.show();
      INDICATOR = true;
    };
    closeIndicator = function() {
      actInd.hide();
      indWin.close({
        opacity: 0,
        duration: 500
      });
    };
  } else {
    showIndicator = function() {
      actInd = Ti.UI.createActivityIndicator({
        message: 'Loading',
        color: '#fff',
        font: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      });
      actInd.show();
      INDICATOR = true;
    };
    closeIndicator = function() {
       actInd.hide();
    };
  }
  hideIndicator = function() {
    if (INDICATOR) {
      closeIndicator();
      INDICATOR = false;
    }
  };
  Titanium.App.addEventListener('show_indicator', function(event) {
    Ti.API.debug("show_indicator");
    if (!INDICATOR) {
      showIndicator();
    } else {
      Ti.API.warn('tried to show the activity indicator window while it was already up');
    }
  });
  Titanium.App.addEventListener('hide_indicator', function(event) {
    Ti.API.debug("hide_indicator");
    hideIndicator();
  });
};