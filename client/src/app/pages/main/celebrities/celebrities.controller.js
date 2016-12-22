angular
  .module('mba')
  .controller('MainCelebritiesController', ['$scope', '$rootScope', '$state', '$stateParams', 'Loader', 'CelebrityStore', 'CategoryStore',
  function($scope, $rootScope, $state, $stateParams, Loader, CelebrityStore, CategoryStore){
    // $rootScope._page = 'admin';

    var vm = this;

    vm.arr_people = [];
    vm.arr_categories = [];

    vm.category_id = $stateParams['category_id'];

    new Loader(2, function(success){
      if (success){
        $rootScope._loading = false;

        if (vm.category_id){
          vm.arr_people = CelebrityStore.getCelebrityByCategory(vm.category_id);
          vm.category = CategoryStore.getCategoryById(vm.category_id);
        }else{
          vm.arr_people = CelebrityStore.getCelebrity();
          vm.arr_categories = CategoryStore.getCategory();
        }        
      }
    }, function(remaining, loader){
      if (remaining == 1){
        CelebrityStore._loadCelebrities(loader);
      }
    }).startLoading(function(loader){
      $rootScope._loading = true;
      CategoryStore._loadCategories(loader);
    });
  }]);