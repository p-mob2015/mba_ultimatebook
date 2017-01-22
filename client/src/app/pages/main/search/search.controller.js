angular
  .module('mba')
  .controller('MainSearchController', ['$scope', '$rootScope', '$state', '$stateParams', 'Loader', 'CelebrityStore', 'CategoryStore', 'BookStore', 'GenreStore',
  function($scope, $rootScope, $state, $stateParams, Loader, CelebrityStore, CategoryStore, BookStore, GenreStore){
    var vm = this;
    
    vm.keyword = $stateParams.keyword.toLowerCase();
    vm.arr_books = [];
    vm.arr_people = [];

    new Loader(4, function(success){
      if (success){
        $rootScope._loading = false;

        vm.arr_books = BookStore.searchBy(vm.keyword);
        vm.arr_people = CelebrityStore.searchBy(vm.keyword);
      }
    }, function(remaining, loader){
      if (remaining == 2) {
        BookStore._loadBooks(loader);
        CelebrityStore._loadCelebrities(loader);
      }
    }).startLoading(function(loader){
      $rootScope._loading = true;
      GenreStore._loadGenres(loader);
      CategoryStore._loadCategories(loader);
    });

  }]);