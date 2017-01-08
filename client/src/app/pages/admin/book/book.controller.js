angular
  .module('mba')
  .controller('AdminBookController', ['$scope', '$rootScope', '$state', 'Loader', 'Helper', 'BookStore', 'GenreStore',
  function($scope, $rootScope, $state, Loader, Helper, BookStore, GenreStore){
    var vm = this;

    vm.arr_books = [];
    vm.displayed = [];

    new Loader(2, function(success){
      if (success)
        vm.arr_books = BookStore.getBook();
    }, function(remaining, loader){
      if (remaining == 1)
        BookStore._loadBooks(loader);
    }).startLoading(function(loader){
      GenreStore._loadGenres(loader, true);
    });

    vm.actions = {
      create: function(){
        $state.go('admin.books.create', {reload: false});
      },
      edit: function(book){
        $state.go('admin.books.edit', {book_id: book.id}, {reload:false});
      },
      remove: function(book){
        Helper.triggerConfirmation({
          title: 'Confirm Removal',
          desc: 'Are you sure to remove book "' + book.title + '"?'
        }, function(){
          removeBook(book);
        });
      }
    };

    function removeBook(book){
      $rootScope._loading = true;
      BookStore._removeBook(book.id, function(success){
        $rootScope._loading = false;
        if (!success){
          console.log("Removing book failed...");
        }
      });
    }
  }]);