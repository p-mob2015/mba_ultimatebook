angular
  .module('mba')
  .filter('preText', function(){
    return function(str){
      return str.replace(/(\n)+/g, '<br/><br/>');
    }
  });