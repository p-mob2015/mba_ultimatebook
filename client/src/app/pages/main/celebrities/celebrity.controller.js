angular
  .module('mba')
  .controller('MainCelebrityController', ['$scope', '$rootScope', '$state', '$stateParams', 'Loader', 'BookStore', 'CategoryStore', 'CelebrityStore',
  function($scope, $rootScope, $state, $stateParams, Loader, BookStore, CategoryStore, CelebrityStore){
    // $rootScope._page = 'admin';

    var vm = this;

    vm.person = {};

    new Loader(3, function(success){
      if (success){
        $rootScope._loading = false;

        vm.person = CelebrityStore.getCelebrityById($stateParams['celebrity_id'], true);
        vm.person.bio = vm.person.bio.replace(/(\n)+/g, '<br/><br/>');
      }
    }, function(remaining, loader){
      if (remaining == 1){
        CelebrityStore._loadCelebrities(loader);
      }
    }).startLoading(function(loader){
      $rootScope._loading = true;
      CategoryStore._loadCategories(loader);
      BookStore._loadBooks(loader);
    });
  }]);