angular
  .module('mba')
  .service('BookStore', function(BookConnector, $injector, Helper){
    this.arr_books = [];    
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
      this.arr_books.length = 0;
    }
    
    this.setSync = function(){
      this.sync = true;
    }
    this.getSync = function(){
      return this.sync;
    }

    this.pushBook = function(obj_book){
      this.arr_books.push(obj_book);
    }
    this.removeBook = function(book_id){
      var book_index = _.findIndex(this.arr_books, {
        id: book_id
      });
      if (book_index != -1){
        this.arr_books.splice(book_index, 1);
      }
    }
    this.getBook = function(){
      return this.arr_books;
    }
    this.getTopBooks = function(count){
      return _.first(_.sortBy(this.arr_books, function(book){
        return book.celebrity_ids.count;
      }), count);
    }
    this.getBookByGenre = function(genre_id){
      return _.filter(this.arr_books, function(book){
        return (book.genre_ids.indexOf(genre_id) != -1);
      });
    }
    this.searchBy = function(keyword){
      return _.filter(this.arr_books, function(book){
        var book_obj_full = Helper.getClone(book);
        book_obj_full.genres = [];
        for (var key in book_obj_full.genre_ids){
          book_obj_full.genres.push($injector.get('GenreStore').getGenreById(book_obj_full.genre_ids[key]));
        }

        var title_test = book_obj_full.title.toLowerCase().includes(keyword);
        var genre_test = _.map(book_obj_full.genres, function(c){
          return c.title;
        }).join('|').toLowerCase().includes(keyword);
        var author_test = book_obj_full.author.toLowerCase().includes(keyword);

        return title_test || genre_test || author_test;
      });
    }
    this.getBookById = function(book_id, populate){
      var book_index = _.findIndex(this.arr_books, {
        id: book_id
      });
      if (book_index == -1){
        return null;
      }else{
        var book_obj = this.arr_books[book_index];
        if (populate){
          var book_obj_full = Helper.getClone(book_obj);
          book_obj_full.genres = [];
          book_obj_full.readers = [];

          for (var key in book_obj_full.genre_ids){
            book_obj_full.genres.push($injector.get('GenreStore').getGenreById(book_obj_full.genre_ids[key]));
          }

          for (var key in book_obj_full.celebrity_ids){
            book_obj_full.readers.push($injector.get('CelebrityStore').getCelebrityById(book_obj_full.celebrity_ids[key]));
          }

          return book_obj_full;
        }else{
          return book_obj;
        }
        
      }
    }
    this.dismissGenre = function(genre_id){
      for (var key in this.arr_books){
        var tmpIndex = this.arr_books[key].genre_ids.indexOf(genre_id);
        if (tmpIndex != -1)
          this.arr_books[key].genre_ids.splice(tmpIndex, 1);
      }
    }

    this._loadBooks = function(loader, skip_loading_callback){
      var _this = this;
      if (_this.getSync())
        loader.finishLoading(true);
      else{
        _this.triggerLoadingCallback(true, skip_loading_callback);
        BookConnector.query({}, function(arr_books){
          for (var i=0; i<arr_books.length; i++){
            _this.pushBook(arr_books[i]);
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

    this._addBook = function(book_obj, callback){
      var _this = this;
      var post_data = book_obj; //_this.getPostVersion(book_obj);

      _this.triggerLoadingCallback(true);
      BookConnector.save(post_data, function(result_obj){
        _this.pushBook(result_obj);
        _this.triggerLoadingCallback(false);
        callback(true);
      }, function(){
        callback(false);
      });
    }

    this._updateBook = function(book_obj, callback, abs_hash){
      var _this = this;

      var book_obj_origin = _this.getBookById(book_obj.id);
      var book_obj_clone = {};
      angular.copy(book_obj, book_obj_clone);

      if (abs_hash == null) abs_hash = {};
      book_obj_clone = _.extend(book_obj_clone, abs_hash);

      var book_connector = new BookConnector();
      book_connector.id = book_obj.id;

      for (var key in book_obj_clone){
        book_connector[key] = book_obj_clone[key];
      }

      _this.triggerLoadingCallback(true);
      book_connector.$update({}, function(result_obj){
        for (var key in book_obj_clone){
          book_obj_origin[key] = book_obj_clone[key];
        }

        _this.triggerLoadingCallback(false);
        callback(true);
      }, function(){
        callback(false);
      })
    }

    this._removeBook = function(book_id, callback){
      var _this = this;

      _this.triggerLoadingCallback(true);
      BookConnector.remove({book_id: book_id}, function(result){
        _this.removeBook(book_id);
        _this.triggerLoadingCallback(false);
        callback(true);
      }, function(){
        callback(false);
      })
    }
  });