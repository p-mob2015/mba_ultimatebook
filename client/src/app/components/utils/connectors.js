angular
  .module('mba')
  .factory('CelebrityConnector', function($resource){
    return $resource('/api/celebrities/:celeb_id', {celeb_id: '@id'}, {
      update: {
        method: 'PUT'
      }
    });
  })
  .factory('BookConnector', function($resource){
    return $resource('/api/books/:book_id', {book_id: '@id'}, {
      update: {
        method: 'PUT'
      }
    });
  })
  .factory('CategoryConnector', function($resource){
    return $resource('/api/categories/:category_id', {category_id: '@id'}, {
      update: {
        method: 'PUT'
      }
    });
  })
  .factory('GenreConnector', function($resource){
    return $resource('/api/genres/:genre_id', {genre_id: '@id'}, {
      update: {
        method: 'PUT'
      }
    });
  });