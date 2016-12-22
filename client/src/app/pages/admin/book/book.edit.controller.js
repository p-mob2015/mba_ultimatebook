angular
  .module('mba')
  .controller('BookEditController', ['$scope', '$rootScope', '$state', '$stateParams', 'Loader', 'Helper', 'BookStore', 'GenreStore', 'Upload',
  function($scope, $rootScope, $state, $stateParams, Loader, Helper, BookStore, GenreStore, Upload){
    var vm = this;

    vm._isEditing = true;
    var _book_id = $stateParams['book_id'];

    if (!BookStore.getSync()) $state.go('admin.books');
    
    vm.book = {};
    angular.copy(BookStore.getBookById(_book_id), vm.book);
    var _old_cover_id = vm.book.cover;

    vm.ui = {
      arr_genres: GenreStore.getGenre(),
      title: vm.book.title
    };

    vm.onSave = function(){
      $rootScope._loading = true;
      if (!vm.picFile)
        saveBook();
      else{
        var pic_name = md5(Date.now()+"");;
        var uploader = Upload.upload({
          url: 'api/upload/cover', 
          method: 'POST',
          data: {
            'cover': {
              'old': _old_cover_id,
              'name': pic_name,
              'file': vm.picFile
            }
          }
        });
        uploader.then(function(){
          saveBook(pic_name);
          console.log("Successfully uploaded...");
        }, function(){
          alert("Failed uploading image. Please try again.");
          $rootScope._loading = false;
        });
      }
    }

    vm.onCancel = function(){
      $state.go('admin.books');
    }

    vm.cancelPicSelection = function(){
      vm.picFile = null;
      vm.book.cover = vm._tmpCoverImg;
      vm._tmpCoverImg = null;
    }

    vm.onChangePic = function(){
      vm._tmpCoverImg = vm.book.cover;
      vm.book.cover = null;
    }

    function saveBook(img_name){
      if ((vm._tmpCoverImg != null) && (!img_name))
        vm.book.cover = vm._tmpCoverImg;

      BookStore._updateBook(vm.book, function(success){
        $rootScope._loading = false;
        if (success){
          $state.go('admin.books');
        }
        else{
          console.log("Failed saving the book.")
        }
      }, img_name?{cover: img_name}:null);
    }
  }]);