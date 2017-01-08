angular
  .module('mba')
  .controller('AdminController', ['$scope', '$rootScope', '$state', 'GenreStore', 'CelebrityStore', 'CategoryStore', 'BookStore',
  function($scope, $rootScope, $state, GenreStore, CelebrityStore, CategoryStore, BookStore){
    $rootScope._page = 'admin';

    var vm = this;

    vm.startLoading = function(){
      $rootScope._loading = true;
    }
    vm.finishLoading = function(){
      $rootScope._loading = false;
    }

    GenreStore.registerLoadingCallbacks(vm.startLoading, vm.finishLoading);
    CelebrityStore.registerLoadingCallbacks(vm.startLoading, vm.finishLoading);
    CategoryStore.registerLoadingCallbacks(vm.startLoading, vm.finishLoading);
    BookStore.registerLoadingCallbacks(vm.startLoading, vm.finishLoading);
    
  }]);