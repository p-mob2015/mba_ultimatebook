(function() {
  'use strict';

  angular
    .module('mba')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, editableOptions) {
    editableOptions.theme = 'bs3'; // xEditable bootstrap3 theme
    $log.debug('runBlock end');
  }

})();
