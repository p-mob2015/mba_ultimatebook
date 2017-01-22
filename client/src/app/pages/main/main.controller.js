angular
  .module('mba')
  .controller('MainController', ['$scope', '$rootScope', '$state', '$timeout',
  function($scope, $rootScope, $state, $timeout){
    // $rootScope._page = 'admin';

    var vm = this;

    vm.showSearchBar = false;
    vm.search = {
      keyword: '',
      submit: function() {
        if (vm.search.keyword != ''){
          $state.go('main.search', {keyword: vm.search.keyword}, {reload: true});
        }
      }
    }
    
    vm.initStickMenu = function(){
      $timeout(function(){
        if (!$('html').hasClass('no_stuck_menu')) {
          $('#stuck_container').TMStickUp({
          })
        }
      });      
    }

    vm.toggleSearch = function(){
      vm.showSearchBar = !vm.showSearchBar;
    }

    vm.onEnterPress = function(){
      if (vm.search.keyword != ''){
          $state.go('main.search', {keyword: vm.search.keyword}, {reload: true});
        }
    }

  }]);