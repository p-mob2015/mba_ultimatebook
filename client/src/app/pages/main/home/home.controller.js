angular
  .module('mba')
  .controller('MainHomeController', ['$scope', '$rootScope', '$state', 'Loader', 'BookStore', 'GenreStore', 'CelebrityStore', 'CategoryStore',
  function($scope, $rootScope, $state, Loader, BookStore, GenreStore, CelebrityStore, CategoryStore){
    // $rootScope._page = 'admin';

    var vm = this;

    vm.arr_top_books = [];
    vm.arr_top_readers = [];
    vm.arr_genres = [];
    vm.arr_categories = [];

    new Loader(4, function(success){
      if (success){
        $rootScope._loading = false;
        vm.arr_top_books = BookStore.getTopBooks(8);
        vm.arr_top_readers = CelebrityStore.getTopCelebrities(8);
        vm.arr_genres = GenreStore.getGenre();
        vm.arr_categories = CategoryStore.getCategory();
      }
    }, function(remaining, loader){
      if (remaining == 2){
        BookStore._loadBooks(loader);
        CelebrityStore._loadCelebrities(loader);
      }
    }).startLoading(function(loader){
      $rootScope._loading = true;
      GenreStore._loadGenres(loader);
      CategoryStore._loadCategories(loader);
    });
  }]);