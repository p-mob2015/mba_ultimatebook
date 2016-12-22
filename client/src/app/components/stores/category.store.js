angular
  .module('mba')
  .service('CategoryStore', function(CategoryConnector, CelebrityStore){
    this.arr_categories = [];
    this.sync = false;

    this.purge = function(){
      this.sync = false;
      this.arr_categories.length = 0;
    }
    
    this.setSync = function(){
      this.sync = true;
    }
    this.getSync = function(){
      return this.sync;
    }

    this.pushCategory = function(obj_category){
      this.arr_categories.push(obj_category);
    }
    this.getCategory = function(){
      return this.arr_categories;
    }
    this.getCategoryById = function(category_id){
      var category_index = _.findIndex(this.arr_categories, {
        id: category_id
      });
      if (category_index == -1){
        return null;
      }else{
        return this.arr_categories[category_index];
      }
    }
    this.removeCategory = function(category_id){
      var category_index = _.findIndex(this.arr_categories, {
        id: category_id
      });
      if (category_index != -1){
        CelebrityStore.dismissCategory(category_id);
        this.arr_categories.splice(category_index, 1);
      }
    }

    this._loadCategories = function(loader){
      var _this = this;
      if (_this.getSync())
        loader.finishLoading(true);
      else{
        CategoryConnector.query({}, function(arr_categories){
          for (var i=0; i<arr_categories.length; i++){
            _this.pushCategory(arr_categories[i]);
          }
          _this.setSync();
          loader.finishLoading(true);
        }, function(){
          // API fail...
          loader.finishLoading(false);
        });
      }
    }

    this._addCategory = function(category_obj, callback){
      var _this = this;
      var post_data = category_obj; //_this.getPostVersion(celeb_obj);

      CategoryConnector.save(post_data, function(result_obj){
        _this.pushCategory(result_obj);
        callback(true);
      }, function(){
        callback(false);
      });
    }

    this._updateCategory = function(category_obj, callback, abs_hash){
      var _this = this;
      
      var category_obj_origin = _this.getCategoryById(category_obj.id);
      var category_obj_clone = {};
      angular.copy(category_obj, category_obj_clone);

      if (abs_hash == null) abs_hash = {};
      category_obj_clone = _.extend(category_obj_clone, abs_hash);

      var category_connector = new CategoryConnector();
      category_connector.id = category_obj.id;

      for (var key in category_obj_clone){
        category_connector[key] = category_obj_clone[key];
      }

      category_connector.$update({}, function(result_obj){
        for (var key in category_obj_clone){
          category_obj_origin[key] = category_obj_clone[key];
        }

        callback(true);
      }, function(){
        callback(false);
      })
    }

    this._removeCategory = function(category_id, callback){
      var _this = this;
      CategoryConnector.remove({category_id: category_id}, function(result){
        _this.removeCategory(category_id);
        callback(true);
      }, function(){
        callback(false);
      })
    }
  });