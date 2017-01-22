(function() {
  'use strict';

  angular
    .module('mba')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        abstract: true,
        // defaultChild: 'admin.celebrities',
        templateUrl: 'app/pages/admin/index.tpl.html',
        controller: 'AdminController',
        controllerAs: 'vm',
        data: {
          css: 'assets/stylesheets/light-bootstrap-dashboard.css'
        }
        // redirectTo: 'admin.celebrities'
      })
      .state('admin.celebrities', {
        url: '',
        templateUrl: 'app/pages/admin/celebrity/index.tpl.html',
        controller: 'AdminCelebrityController',
        controllerAs: 'vm'
      })
      .state('admin.celebrities.edit', {
        url: '/celebrities/edit/:person_id',
        templateUrl: 'app/pages/admin/celebrity/edit.tpl.html',
        controller: 'CelebrityEditController',
        controllerAs: 'vm'
      })
      .state('admin.celebrities.booklist', {
        url: '/celebrities/booklist/:person_id',
        templateUrl: 'app/pages/admin/celebrity/booklist.tpl.html',
        controller: 'CelebrityBooklistController',
        controllerAs: 'vm'
      })
      .state('admin.celebrities.create', {
        url: '/celebrities/create',
        templateUrl: 'app/pages/admin/celebrity/edit.tpl.html',
        controller: 'CelebrityCreateController',
        controllerAs: 'vm'
      })
      .state('admin.books', {
        url: '/books',
        templateUrl: 'app/pages/admin/book/index.tpl.html',
        controller: 'AdminBookController',
        controllerAs: 'vm'
      })
      .state('admin.books.edit', {
        url: '/edit/:book_id',
        templateUrl: 'app/pages/admin/book/edit.tpl.html',
        controller: 'BookEditController',
        controllerAs: 'vm'
      })
      .state('admin.books.create', {
        url: '/create',
        templateUrl: 'app/pages/admin/book/edit.tpl.html',
        controller: 'BookCreateController',
        controllerAs: 'vm'
      })
      .state('admin.categories', {
        url: '/categories',
        templateUrl: 'app/pages/admin/category/index.tpl.html',
        controller: 'CategoryController',
        controllerAs: 'vm'
      })
      .state('admin.genres', {
        url: '/genres',
        templateUrl: 'app/pages/admin/genre/index.tpl.html',
        controller: 'GenreController',
        controllerAs: 'vm'
      })
      .state('main', {
        url: '',
        abstract: true,
        // defaultChild: 'main.home',
        templateUrl: 'app/pages/main/layout.tpl.html',
        controller: 'MainController',
        data : {
          cssClassnames : 'main',
          css: 'assets/stylesheets/booklife.css'
        },
        controllerAs: 'vm'
        // redirectTo: 'main.home'
      })
      .state('main.home', {
        url: '/home',
        templateUrl: 'app/pages/main/home/index.tpl.html',
        controller: 'MainHomeController',
        controllerAs: 'vm'
      })
      .state('main.search', {
        url: '/search/:keyword',
        templateUrl: 'app/pages/main/search/index.tpl.html',
        controller: 'MainSearchController',
        controllerAs: 'vm'
      })
      .state('main.books', {
        url: '/books/:genre_id',
        templateUrl: 'app/pages/main/books/index.tpl.html',
        controller: 'MainBooksController',
        controllerAs: 'vm'
      })
      .state('main.book', {
        url: '/book/:book_id',
        templateUrl: 'app/pages/main/books/detail.tpl.html',
        controller: 'MainBookController',
        controllerAs: 'vm'
      })
      .state('main.celebrities', {
        url: '/celebrities/:category_id',
        templateUrl: 'app/pages/main/celebrities/index.tpl.html',
        controller: 'MainCelebritiesController',
        controllerAs: 'vm'
      })
      .state('main.celebrity', {
        url: '/celebrity/:celebrity_id',
        templateUrl: 'app/pages/main/celebrities/detail.tpl.html',
        controller: 'MainCelebrityController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/home');
  }

})();
