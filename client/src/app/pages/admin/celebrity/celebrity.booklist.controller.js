angular
  .module('mba')
  .controller('CelebrityBooklistController', ['$scope', '$rootScope', '$state', '$stateParams', 'Loader', 'Helper', 'CelebrityStore', 'BookStore',
  function($scope, $rootScope, $state, $stateParams, Loader, Helper, CelebrityStore, BookStore){
    var vm = this;

    var _person_id = $stateParams['person_id'];

    if (!CelebrityStore.getSync()) $state.go('admin.celebrities');

    vm.person = {};
    angular.copy(CelebrityStore.getCelebrityById(_person_id), vm.person);

    vm.arr_books = [];

    vm.ui = {
      // arr_categories: CategoryStore.getCategory(),
      pool_shelf: [],
      pool_library: [],
      search: '',
      title: vm.person.name + "'s reading list",
      filtered: function(title, keyword){
        return (title.toLowerCase().indexOf(keyword.toLowerCase()) != -1);
      }
    };

    new Loader(1, function(success){
      if (success){
        vm.arr_books = BookStore.getBook();
        initBookPools();
      }
    }).startLoading(function(loader){
      BookStore._loadBooks(loader);
    });

    vm.onCancel = function(){
      $state.go('admin.celebrities');
    };

    vm.onSubmit = function(){
      var book_ids = _.map(vm.ui.pool_shelf, 'id');
      $rootScope._loading = true;
      CelebrityStore._updateCelebrity(vm.person, function(success){
        $rootScope._loading = false;
        if (success){
          $state.go('admin.celebrities');
        }else{
          console.log("Failed saving the celebrity.");
        }
      }, {book_ids: book_ids});
    };

    function initBookPools(){
      // Personal reading list
      for (var key in vm.person.book_ids){
        vm.ui.pool_shelf.push(
          Helper.getClone(BookStore.getBookById(vm.person.book_ids[key]))
        );
      }

      // Pool books
      for (var key in vm.arr_books){
        var obj_book = vm.arr_books[key];
        if (vm.person.book_ids.indexOf(obj_book.id) == -1)
          vm.ui.pool_library.push(
            Helper.getClone(obj_book)
          );
      }
    }


  }]);