angular
  .module('mba')
  .controller('GenreCreateController', ['$scope', '$uibModalInstance',
  function($scope, $uibModalInstance){
    $scope.genre = { title: '' };

    $scope.confirm = function(){
      $uibModalInstance.close($scope.genre);
    }
    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    }
  }]);
