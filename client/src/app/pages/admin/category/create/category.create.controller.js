angular
  .module('mba')
  .controller('CategoryCreateController', ['$scope', '$uibModalInstance',
  function($scope, $uibModalInstance){
    $scope.category = { title: '' };

    $scope.confirm = function(){
      $uibModalInstance.close($scope.category);
    }
    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    }
  }]);
