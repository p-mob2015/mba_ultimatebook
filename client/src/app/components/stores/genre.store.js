angular
  .module('mba')
  .service('GenreStore', function(GenreConnector, BookStore){
    this.arr_genres = [];
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
      this.arr_genres.length = 0;
    }
    
    this.setSync = function(){
      this.sync = true;
    }
    this.getSync = function(){
      return this.sync;
    }

    this.pushGenre = function(obj_genre){
      this.arr_genres.push(obj_genre);
    }
    this.getGenre = function(){
      return this.arr_genres;
    }
    this.getGenreById = function(genre_id){
      var genre_index = _.findIndex(this.arr_genres, {
        id: genre_id
      });
      if (genre_index == -1){
        return null;
      }else{
        return this.arr_genres[genre_index];
      }
    }
    this.removeGenre = function(genre_id){
      var genre_index = _.findIndex(this.arr_genres, {
        id: genre_id
      });
      if (genre_index != -1){
        BookStore.dismissGenre(genre_id);
        this.arr_genres.splice(genre_index, 1);
      }
    }

    this._loadGenres = function(loader, skip_loading_callback){
      var _this = this;
      if (_this.getSync())
        loader.finishLoading(true);
      else{
        _this.triggerLoadingCallback(true, skip_loading_callback);
        GenreConnector.query({}, function(arr_genres){
          for (var i=0; i<arr_genres.length; i++){
            _this.pushGenre(arr_genres[i]);
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

    this._addGenre = function(genre_obj, callback){
      var _this = this;
      var post_data = genre_obj; //_this.getPostVersion(celeb_obj);

      _this.triggerLoadingCallback(true);
      GenreConnector.save(post_data, function(result_obj){
        _this.pushGenre(result_obj);
        _this.triggerLoadingCallback(false);
        callback(true);
      }, function(){
        callback(false);
      });
    }

    this._updateGenre = function(genre_obj, callback, abs_hash){
      var _this = this;
      
      var genre_obj_origin = _this.getGenreById(genre_obj.id);
      var genre_obj_clone = {};
      angular.copy(genre_obj, genre_obj_clone);

      if (abs_hash == null) abs_hash = {};
      genre_obj_clone = _.extend(genre_obj_clone, abs_hash);

      var genre_connector = new GenreConnector();
      genre_connector.id = genre_obj.id;

      for (var key in genre_obj_clone){
        genre_connector[key] = genre_obj_clone[key];
      }

      _this.triggerLoadingCallback(true);
      genre_connector.$update({}, function(result_obj){
        for (var key in genre_obj_clone){
          genre_obj_origin[key] = genre_obj_clone[key];
        }
        _this.triggerLoadingCallback(false);
        callback(true);
      }, function(){
        callback(false);
      })
    }

    this._removeGenre = function(genre_id, callback){
      var _this = this;

      _this.triggerLoadingCallback(true);
      GenreConnector.remove({genre_id: genre_id}, function(result){
        _this.removeGenre(genre_id);
        _this.triggerLoadingCallback(false);
        callback(true);
      }, function(){
        callback(false);
      })
    }
  });