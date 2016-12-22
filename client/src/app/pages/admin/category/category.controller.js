angular
  .module('mba')
  .controller('CategoryController', ['$scope', '$rootScope', '$state', '$uibModal', 'Loader', 'Helper', 'CategoryStore',
  function($scope, $rootScope, $state, $uibModal, Loader, Helper, CategoryStore){
    var vm = this;

    vm.arr_categories = [];
    vm.displayed = [];

    new Loader(1, function(success){
      if (success) vm.arr_categories = CategoryStore.getCategory();
    }).startLoading(function(loader){
      CategoryStore._loadCategories(loader);
    });

    vm.actions = {
      create: function(){
        var modalInstance = $uibModal.open({
          templateUrl: 'app/pages/admin/category/create/category.create.tpl.html',
          controller: 'CategoryCreateController',
        });

        modalInstance.result.then(function(category){
          CategoryStore._addCategory(category, function(success){
            if (!success){
              console.log("Creating category failed...");
            }
          });
        }, function(){
          console.log("Gracefully cancelled category creation.");
        });
      },

      remove: function(category){
        Helper.triggerConfirmation({
          title: 'Confirm Removal',
          desc: 'Are you sure to remove category "' + category.title + '"?'
        }, function(){
          removeCategory(category);
        });
      }
    };

    vm.onUpdateCategoryAttr = function(category, field_name, value){
      var abs_hash = {}; abs_hash[field_name] = value;
      CategoryStore._updateCategory(category, function(success){
        if (!success){
          console.log("Updating category failed...");
        }
      }, abs_hash);
      return false;
    }

    function removeCategory(category){
      $rootScope._loading = true;
      CategoryStore._removeCategory(category.id, function(success){
        $rootScope._loading = false;
        if (!success){
          console.log("Removing category failed...");
        }
      });
    }
  }]);