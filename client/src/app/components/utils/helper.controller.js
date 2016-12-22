angular
  .module('mba')
  .controller('ConfirmModalController', ['$scope', '$uibModalInstance', 'info', 
  function($scope, $uibModalInstance, info){
    $scope.info = info;

    $scope.confirm = function(){
      $uibModalInstance.close();
    };
    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    }
  }]);