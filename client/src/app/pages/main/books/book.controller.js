angular
  .module('mba')
  .controller('MainBookController', ['$scope', '$rootScope', '$state', '$stateParams', 'Loader', 'BookStore', 'GenreStore', 'CelebrityStore',
  function($scope, $rootScope, $state, $stateParams, Loader, BookStore, GenreStore, CelebrityStore){
    // $rootScope._page = 'admin';

    var vm = this;

    vm.book = {};

    new Loader(3, function(success){
      if (success){
        $rootScope._loading = false;
        vm.book = BookStore.getBookById($stateParams['book_id'], true);
        vm.book.summary = vm.book.summary.replace(/(\n)+/g, '<br/><br/>');
      }
    }, function(remaining, loader){
      if (remaining == 1){
        BookStore._loadBooks(loader);
      }
    }).startLoading(function(loader){
      $rootScope._loading = true;
      GenreStore._loadGenres(loader);
      CelebrityStore._loadCelebrities(loader);
    });
  }]);