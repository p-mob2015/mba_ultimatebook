angular
  .module('mba')
  .controller('CelebrityEditController', ['$scope', '$rootScope', '$state', '$stateParams', 'Loader', 'Helper', 'CelebrityStore', 'CategoryStore', 'Upload',
  function($scope, $rootScope, $state, $stateParams, Loader, Helper, CelebrityStore, CategoryStore, Upload){
    var vm = this;

    vm._isEditing = true;
    var _person_id = $stateParams['person_id'];

    if (!CelebrityStore.getSync()) $state.go('admin.celebrities');
    
    vm.person = {};
    angular.copy(CelebrityStore.getCelebrityById(_person_id), vm.person);
    var _old_photo_id = vm.person.photo;

    vm.ui = {
      arr_categories: CategoryStore.getCategory(),
      title: vm.person.name
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
              'old': _old_photo_id,
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
    }

    vm.cancelPicSelection = function(){
      vm.picFile = null;
      vm.person.photo = vm._tmpPersonImg;
      vm._tmpPersonImg = null;
    }

    vm.onChangePic = function(){
      vm._tmpPersonImg = vm.person.photo;
      vm.person.photo = null;
    }

    function saveCelebrity(img_name){
      if ((vm._tmpPersonImg != null) && (!img_name))
        vm.person.photo = vm._tmpPersonImg;

      CelebrityStore._updateCelebrity(vm.person, function(success){
        $rootScope._loading = false;
        if (success){
          $state.go('admin.celebrities');
        }
        else{
          console.log("Failed saving the celebrity.")
        }
      }, img_name?{photo: img_name}:null);
    }
  }]);