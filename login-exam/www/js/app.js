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
      });

    // 로그인 화면을 기본 뷰로 사용
    $urlRouterProvider.otherwise('/loginMain');
  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  // 파이어베이스 인증 서비스
  .factory('$auth', ['$firebaseAuth',
    function ($firebaseAuth) {
      return $firebaseAuth();
    }
  ])

  //localStorage사용을 위한 셋팅
  .factory('$localstorage', ['$window', function ($window) {
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  }])

  // TODO: 로그아웃, 정보변경, 회원탈퇴 등등
  .factory('$auth', ['$window', function ($window) {
    return {
      login: function () {

      },
      logout: function () {

      },
      register: function () {

      },
      resign: function () {
        
      },
      mod: function () {
        
      }
    }
  }])

  // 팝업창 사용을 위한 셋팅
  .factory('$myPopup', ['$ionicPopup', function ($ionicPopup) {
    return {
      show: function (title, template) {
        $ionicPopup.alert({
          title: title,
          template: template
        })
          .then(function(res) {});
      }
    }
  }]);
