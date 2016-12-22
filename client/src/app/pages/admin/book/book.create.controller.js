angular
  .module('mba')
  .controller('BookCreateController', ['$scope', '$rootScope', '$state', 'Loader', 'Helper', 'BookStore', 'GenreStore', 'Upload',
  function($scope, $rootScope, $state, Loader, Helper, BookStore, GenreStore, Upload){
    var vm = this;

    vm.book = {};

    if (!GenreStore.getSync()) $state.go('admin.books');
    
    vm.ui = {
      arr_genres: GenreStore.getGenre(),
      title: 'Add a Book'
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
    };

    vm.cancelPicSelection = function(){
      vm.picFile = null;
    };

    function saveBook(img_name){
      BookStore._addBook(img_name?_.extend(vm.book, {cover: img_name}):vm.book, function(success){
        $rootScope._loading = false;
        if (success){
          $state.go('admin.books');
        }
        else{
          console.log("Failed saving the book.")
        }

      });
    }
  }]);