angular
  .module('mba')
  .controller('GenreController', ['$scope', '$rootScope', '$state', '$uibModal', 'Loader', 'Helper', 'GenreStore',
  function($scope, $rootScope, $state, $uibModal, Loader, Helper, GenreStore){
    var vm = this;

    vm.arr_genres = [];
    vm.displayed = [];

    new Loader(1, function(success){
      if (success) vm.arr_genres = GenreStore.getGenre();
    }).startLoading(function(loader){
      GenreStore._loadGenres(loader);
    });

    vm.actions = {
      create: function(){
        var modalInstance = $uibModal.open({
          templateUrl: 'app/pages/admin/genre/create/genre.create.tpl.html',
          controller: 'GenreCreateController',
        });

        modalInstance.result.then(function(genre){
          $rootScope._loading = true;
          GenreStore._addGenre(genre, function(success){
            $rootScope._loading = false;
            if (!success){
              console.log("Creating genre failed...");
            }
          });
        }, function(){
          console.log("Gracefully cancelled genre creation.");
        });
      },

      remove: function(genre){
        Helper.triggerConfirmation({
          title: 'Confirm Removal',
          desc: 'Are you sure to remove genre "' + genre.title + '"?'
        }, function(){
          removeGenre(genre);
        });
      }
    };

    vm.onUpdateGenreAttr = function(genre, field_name, value){
      var abs_hash = {}; abs_hash[field_name] = value;
      GenreStore._updateGenre(genre, function(success){
        if (!success){
          console.log("Updating genre failed...");
        }
      }, abs_hash);
      return false;
    }

    function removeGenre(genre){
      GenreStore._removeGenre(genre.id, function(success){
        if (!success){
          console.log("Removing genre failed...");
        }
      });
    }
  }]);