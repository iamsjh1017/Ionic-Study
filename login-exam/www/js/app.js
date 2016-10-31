var app = angular.module('App', ['ionic', 'firebase', 'ngCordova', 'ngCordovaOauth'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      // 로그인 메인 화면
      .state('loginMain', {
        url: '/loginMain',
        controller: 'LoginMainController',
        templateUrl: 'views/login/loginMain.html'
      })
      // 로그인화면
      .state('signin', {
        url: '/signin',
        controller: 'SigninController',
        templateUrl: 'views/login/signin.html'
      })
      // 회원가입화면
      .state('signup', {
        url: '/signup',
        controller: 'SignupController',
        templateUrl: 'views/login/signup.html'
      })
      // 비밀번호 재설정 화면
      .state('resetPassword', {
        url: '/resetPassword',
        controller: 'ResetPasswordController',
        templateUrl: 'views/login/resetPassword.html'
      })
      // 프로필 화면
      .state('profile', {
        url: '/profile',
        controller: 'ProfileController',
        templateUrl: 'views/login/profile.html'
      });

    // 로그인 화면을 기본 뷰로 사용
    $urlRouterProvider.otherwise('/loginMain');
  })

  .run(function ($ionicPlatform, $firebaseAuth, Localstorage, DbService, MyPopup) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    // 로그인 로그아웃처리
    $firebaseAuth().$onAuthStateChanged(function (user) {
      if (user) {

      } else {
        Localstorage.remove('user');
      }
    })
  });
