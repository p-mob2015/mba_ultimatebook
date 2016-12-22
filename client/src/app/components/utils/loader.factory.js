angular
  .module('mba')
  .factory('Loader', function(){
    var Loader = function(count_to_load, callback_notify, threshold_notify){
      this.count_to_load = count_to_load;
      this.loading = false;
      this.callback_notify = callback_notify;
      this.threshold_notify = threshold_notify;
    };

    Loader.prototype.startLoading = function(func_call){
      if (func_call != null)
        func_call(this);
      this.loading = true;
      if (this.count_to_load == 0){
        this.loading = false;
        if (this.callback_notify != null)
          this.callback_notify();
      }
    };
    Loader.prototype.finishLoading = function(success){
      this.count_to_load --;
      if (this.count_to_load == 0){
        this.loading = false;
        if (this.callback_notify != null)
          this.callback_notify(success);
      }else if (success === false) {
        this.count_to_load = 0;
        this.loading = false;
        if (this.callback_notify != null)
          this.callback_notify(success);
      }else{
        if (this.threshold_notify != null)
          this.threshold_notify(this.count_to_load, this);
      }
    };
    Loader.prototype.forceFinish = function(){
      this.loading = false;
      if (this.callback_notify != null)
          this.callback_notify();
    }
    Loader.prototype.reset = function(count_to_load){
      this.count_to_load = count_to_load;
      this.loading = false;

      return this;
    }

    return Loader;
  });