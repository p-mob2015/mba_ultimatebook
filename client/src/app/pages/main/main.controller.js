angular
  .module('mba')
  .controller('MainController', ['$scope', '$rootScope', '$state', '$timeout',
  function($scope, $rootScope, $state, $timeout){
    // $rootScope._page = 'admin';

    var vm = this;
    
    vm.initStickMenu = function(){
      $timeout(function(){
        if (!$('html').hasClass('no_stuck_menu')) {
          $('#stuck_container').TMStickUp({
          })
        }
      });
      
    }
  }]);