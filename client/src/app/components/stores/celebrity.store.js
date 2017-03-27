angular
  .module('mba')
  .service('CelebrityStore', function(CelebrityConnector, $injector, Helper){
    this.arr_celebrities = [];
    this.sync = false;
    this.loading_callbacks = [];

    this.registerLoadingCallbacks = function(st_callback, en_callback){
      this.loading_callbacks[0] = st_callback;
      this.loading_callbacks[1] = en_callback;
    }
    this.triggerLoadingCallback = function(starting, skip){
      if (skip) return;
      if (this.loading_callbacks.length == 0) return;
      
      if (starting)
        this.loading_callbacks[0]();
      else
        this.loading_callbacks[1]();
    }

    this.purge = function(){
      this.sync = false;
      this.arr_celebrities.length = 0;
    }
    
    this.setSync = function(){
      this.sync = true;
    }
    this.getSync = function(){
      return this.sync;
    }

    this.pushCelebrity = function(obj_celeb){
      this.arr_celebrities.push(obj_celeb);
    }
    this.removeCelebrity = function(celeb_id){
      var celeb_index = _.findIndex(this.arr_celebrities, {
        id: celeb_id
      });
      if (celeb_index != -1){
        this.arr_celebrities.splice(celeb_index, 1);
      }
    }
    this.getCelebrity = function(){
      return this.arr_celebrities;
    }
    this.getTopCelebrities = function(count){
      return _.first(_.sortBy(this.arr_celebrities, function(person){
        return person.book_ids.count;
      }), count);
    }
    this.getCelebrityByCategory = function(category_id){
      return _.filter(this.arr_celebrities, function(person){
        return (person.category_ids.indexOf(category_id) != -1);
      });
    }
    this.searchBy = function(keyword){
      return _.filter(this.arr_celebrities, function(person){
        var person_obj_full = Helper.getClone(person);
        person_obj_full.categories = [];
        person_obj_full.books = [];

        for (var key in person_obj_full.category_ids){
          person_obj_full.categories.push($injector.get('CategoryStore').getCategoryById(person_obj_full.category_ids[key]));
        }

        var name_test = person_obj_full.name.toLowerCase().indexOf(keyword);
        var category_test = _.map(person_obj_full.categories, function(c){
          return c.title;
        }).join('|').toLowerCase().indexOf(keyword);

        return (name_test != -1) || (category_test != -1);
      });
    }
    this.getCelebrityById = function(celeb_id, populate){
      var celeb_index = _.findIndex(this.arr_celebrities, {
        id: celeb_id
      });
      if (celeb_index == -1){
        return null;
      }else{
        var person_obj = this.arr_celebrities[celeb_index];
        if (populate){
          var person_obj_full = Helper.getClone(person_obj);
          person_obj_full.categories = [];
          person_obj_full.books = [];

          for (var key in person_obj_full.category_ids){
            person_obj_full.categories.push($injector.get('CategoryStore').getCategoryById(person_obj_full.category_ids[key]));
          }

          for (var key in person_obj_full.book_ids){
            person_obj_full.books.push($injector.get('BookStore').getBookById(person_obj_full.book_ids[key]));
          }

          return person_obj_full;
        }else{
          return person_obj;
        }
      }
    }
    this.dimissCategory = function(category_id){
      for (var key in this.arr_celebrities){
        var tmpIndex = this.arr_celebrities[key].category_ids.indexOf(category_id);
        if (tmpIndex != -1)
          this.arr_celebrities[key].category_ids.splice(tmpIndex, 1);
      }
    }

    this._loadCelebrities = function(loader, skip_loading_callback){
      var _this = this;
      if (_this.getSync())
        loader.finishLoading(true);
      else{
        _this.triggerLoadingCallback(true, skip_loading_callback);
        CelebrityConnector.query({}, function(arr_celebs){
          for (var i=0; i<arr_celebs.length; i++){
            _this.pushCelebrity(arr_celebs[i]);
          }
          _this.setSync();
          _this.triggerLoadingCallback(false, skip_loading_callback);
          loader.finishLoading(true);
        }, function(){
          // API fail...
          loader.finishLoading(false);
        });
      }
    }

    this._addCelebrity = function(celeb_obj, callback){
      var _this = this;
      var post_data = celeb_obj; //_this.getPostVersion(celeb_obj);

      _this.triggerLoadingCallback(true);
      CelebrityConnector.save(post_data, function(result_obj){
        _this.pushCelebrity(result_obj);
        _this.triggerLoadingCallback(false);
        callback(true);
      }, function(){
        callback(false);
      });
    }

    this._updateCelebrity = function(celeb_obj, callback, abs_hash){
      var _this = this;

      var celeb_obj_origin = _this.getCelebrityById(celeb_obj.id);
      var celeb_obj_clone = {};
      angular.copy(celeb_obj, celeb_obj_clone);

      if (abs_hash == null) abs_hash = {};
      celeb_obj_clone = _.extend(celeb_obj_clone, abs_hash);

      var celeb_connector = new CelebrityConnector();
      celeb_connector.id = celeb_obj.id;

      for (var key in celeb_obj_clone){
        celeb_connector[key] = celeb_obj_clone[key];
      }

      _this.triggerLoadingCallback(true);
      celeb_connector.$update({}, function(result_obj){
        for (var key in celeb_obj_clone){
          celeb_obj_origin[key] = celeb_obj_clone[key];
        }
        _this.triggerLoadingCallback(false);
        callback(true);
      }, function(){
        callback(false);
      })
    }

    this._removeCelebrity = function(celeb_id, callback){
      var _this = this;

      _this.triggerLoadingCallback(true);
      CelebrityConnector.remove({celeb_id: celeb_id}, function(result){
        _this.removeCelebrity(celeb_id);
        _this.triggerLoadingCallback(false);
        callback(true);
      }, function(){
        callback(false);
      })
    }
  });