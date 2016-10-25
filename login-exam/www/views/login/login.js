angular.module('App')

  // 로그인 컨트롤러
  .controller('SigninController', function ($scope, $rootScope, $localstorage) {
    var ref = new Firebase("https://rscamper-d7c4d.firebaseio.com");

    $scope.loginWithEmail = function(username, password){
      ref.authWithPassword({
        email    : username,
        password : password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          // localstorage에 로그인정보를 담습니다.
          authData.loginType = "email";
          $localstorage.setObject("authData",authData);
          console.log("Authenticated successfully with payload:", authData);
        }
      });
    };

    $scope.loginWithPortal = function(providerName){
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          // $rootScope.authData = authData;
          // $rootScope.authData.loginType = "facebook"; //추가 인증수단이 생김으로서 facebook로그인임을 표시.

          authData.loginType = "facebook"
          $localstorage.setObject("authData",authData);
        }
      },{remember:"default"});
    };



  })

  // 회원가입 컨트롤러
  .controller('SignupController', function ($scope, $firebase, $rootScope, $localstorage) {

    $scope.register = function(username, password){
      ref.createUser({
        email    : username,
        password : password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          //register에서는 로그인이 되지 않도록 수정했습니다.
          console.log("Successfully created user account with uid:", userData.uid);
        }
      });
    };

  })

  // 로그인완료 컨트롤러
  .controller('signinResultContoller', function ($scope, $firebase, $rootScope, $localstorage) {

  })

  // 비밀번호 초기화 컨트롤러
  .controller('resetPasswordController', function ($scope, $firebase, $rootScope, $localstorage) {
    $scope.resetPassword = function(username){
      ref.resetPassword({
        email : username
      }, function(error) {
        if (error === null) {
          console.log("Password reset email sent successfully");
        } else {
          console.log("Error sending password reset email:", error);
        }
      });
    };
  });

