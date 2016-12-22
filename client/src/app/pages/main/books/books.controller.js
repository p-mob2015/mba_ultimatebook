angular
  .module('mba')
  .controller('MainBooksController', ['$scope', '$rootScope', '$state', '$stateParams', 'Loader', 'BookStore', 'GenreStore',
  function($scope, $rootScope, $state, $stateParams, Loader, BookStore, GenreStore){
    // $rootScope._page = 'admin';

    var vm = this;

    vm.arr_books = [];
    vm.arr_genres = [];

    vm.genre_id = $stateParams['genre_id'];

    new Loader(2, function(success){
      if (success){
        $rootScope._loading = false;
        if (vm.genre_id){
          vm.arr_books = BookStore.getBookByGenre(vm.genre_id);
          vm.genre = GenreStore.getGenreById(vm.genre_id);
        }else{
          vm.arr_books = BookStore.getBook();
          vm.arr_genres = GenreStore.getGenre();
        }
      }
    }, function(remaining, loader){
      if (remaining == 1){
        BookStore._loadBooks(loader);
      }
    }).startLoading(function(loader){
      $rootScope._loading = true;
      GenreStore._loadGenres(loader);
    });
  }]);