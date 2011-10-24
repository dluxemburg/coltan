/**
 * `Coltan.apps` stores additional "applications" for reference by others
 * features. For example, `Coltan.UI.createByTagName('MyAppViewType',attributes)`
 * will try `Coltan.MyApp.UI.createViewType(attributes)` if an application has
 * been added with the name (key in `Coltan.apps` object) "`MyApp`".
 * 
 * (Maybe the specific application should inherit from Coltan?)
 */

Coltan.apps = {};

Coltan.appNames = function(){
  return _.keys(Coltan.apps);
};

Coltan.createApp = function(name,app){
  Coltan.apps[name] = app;
  
  /**
   * Also, add the debugger
   */
  
  Coltan.util.addDebugger(app,name);
  
};