angular
  .module('mba')
  .controller('CelebrityCreateController', ['$scope', '$rootScope', '$state', 'Loader', 'Helper', 'CelebrityStore', 'CategoryStore', 'Upload',
  function($scope, $rootScope, $state, Loader, Helper, CelebrityStore, CategoryStore, Upload){
    var vm = this;

    vm.person = {};

    if (!CategoryStore.getSync()) $state.go('admin.celebrities');
    
    vm.ui = {
      arr_categories: CategoryStore.getCategory(),
      title: 'Add a Celebrity'
    };

    vm.onSave = function(){
      $rootScope._loading = true;
      if (!vm.picFile)
        saveCelebrity();
      else{
        var pic_name = md5(Date.now()+"");;
        var uploader = Upload.upload({
          url: 'api/upload/photo', 
          method: 'POST',
          data: {
            'photo': {
              'name': pic_name,
              'file': vm.picFile
            }
          }
        });
        uploader.then(function(){
          saveCelebrity(pic_name);
          console.log("Successfully uploaded...");
        }, function(){
          alert("Failed uploading image. Please try again.");
          $rootScope._loading = false;
        });
      }
    }

    vm.onCancel = function(){
      $state.go('admin.celebrities');
    };

    vm.cancelPicSelection = function(){
      vm.picFile = null;
    };

    function saveCelebrity(img_name){
      CelebrityStore._addCelebrity(img_name?_.extend(vm.person, {photo: img_name}):vm.person, function(success){
        $rootScope._loading = false;
        if (success){
          $state.go('admin.celebrities');
        }
        else{
          console.log("Failed saving the celebrity.")
        }

      });
    }
  }]);