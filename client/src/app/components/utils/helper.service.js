angular
  .module('mba')
  .service('Helper', ['$uibModal',
  function($uibModal){
    this.triggerConfirmation = function(info, callback_yes, callback_no){
      var modalInstance = $uibModal.open({
        templateUrl: 'app/components/tpls/confirm_modal.tpl.html',
        controller: 'ConfirmModalController',
        resolve: {
          info: info
        }
      });

      modalInstance.result.then(function(){
        callback_yes();
      }, function(){
        if (callback_no)
          callback_no();
      });
    };

    this.getClone = function(obj){
      var cloned = {};
      angular.copy(obj, cloned);

      return cloned;
    }
  }]);