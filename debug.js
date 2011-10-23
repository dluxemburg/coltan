_(['error','warn','info','debug']).each(function(level,index){
  Coltan[level] = function(msg){
    if(Coltan.loglevel >= index){
      Ti.API[level]('[COLTAN] '+typeof(msg) === 'string' ? msg : Coltan.util.inspect(msg));
    }
  }
});