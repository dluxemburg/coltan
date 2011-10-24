Coltan.util.addDebugger = function(root,name){
  _(['error','warn','info','debug']).each(function(level,index){
    root[level] = function(msg){
      if(root.loglevel >= index){
        Ti.API[level]('['+name.toUpperCase()+'] '+(typeof(msg) === 'string' ? msg : Coltan.util.inspect(msg)));
      }
    }
  });
};

Coltan.util.addDebugger(Coltan,'COLTAN');