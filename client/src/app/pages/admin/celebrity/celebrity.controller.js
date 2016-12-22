angular
  .module('mba')
  .controller('AdminCelebrityController', ['$scope', '$rootScope', '$state', 'Loader', 'Helper', 'CelebrityStore', 'CategoryStore',
  function($scope, $rootScope, $state, Loader, Helper, CelebrityStore, CategoryStore){
    var vm = this;

    vm.arr_celebrities = [];
    vm.displayed = [];

    new Loader(2, function(success){
      if (success)
        vm.arr_celebrities = CelebrityStore.getCelebrity();
    }, function(remaining, loader){
      if (remaining == 1)
        CelebrityStore._loadCelebrities(loader);
    }).startLoading(function(loader){
      CategoryStore._loadCategories(loader);
    });

    vm.actions = {
      create: function(){
        $state.go('admin.celebrities.create', {reload: false});
      },
      edit: function(person){
        $state.go('admin.celebrities.edit', {person_id: person.id}, {reload:false});
      },
      booklist: function(person){
        $state.go('admin.celebrities.booklist', {person_id: person.id}, {reload: false});
      },
      remove: function(person){
        Helper.triggerConfirmation({
          title: 'Confirm Removal',
          desc: 'Are you sure to remove celebrity "' + person.name + '"?'
        }, function(){
          removeCelebrity(person);
        });
      }
    };
    
    function removeCelebrity(person){
      $rootScope._loading = true;
      CelebrityStore._removeCelebrity(person.id, function(success){
        $rootScope._loading = false;
        if (!success){
          console.log("Removing celebrity failed...");
        }
      });
    }
  }]);