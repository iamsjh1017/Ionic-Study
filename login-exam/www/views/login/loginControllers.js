// 로그인 컨트롤러
app.controller('SigninController', function ($scope, Auth, $location, $localstorage, $cordovaOauth) {
  // 인증 객체 스코프에 저장
  $scope.auth = Auth;
  console.log(Auth);

  // 이메일 로그인 메소드
  $scope.loginWithEmail = function (useremail, password) {

    if ($scope.auth.$getAuth()) {
      console.log("로그아웃됨");
      $scope.auth.$signOut();
    } else {
      $scope.auth.$signInWithEmailAndPassword(useremail, password)
        .then(function (result) {
          // TODO: 이메일 인증 확인
          console.log(result.emailVerified);
          if (!result.emailVerified) {
            console.log('로그인실패 : 이메일 인증을 해주시기 바랍니다.');
            $scope.auth.$signOut();
            return;
          }
          console.log('이메일 로그인 성공');
          // TODO: 로그인 성공 후 $localstorage에 유저정보 저장
          $localstorage.setObject("user", result);
          console.log(result);
          console.log(result.email);

          // 로그인 성공후 페이지 이동
          $location.path('/loginMain');
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            console.log('로그인 실패 : 비밀번호가 잘못되었습니다.');
          } else {
            console.log('로그인 실패 : ' + errorMessage);
          }
        });
    }
  };

  // 소셜 로그인 메소드
  $scope.loginWithPortal = function (providerName) {
    if ($scope.auth.$getAuth()) {
      console.log("로그아웃됨");
      $scope.auth.$signOut();
    } else {
      switch (providerName) {

        case "google":
          $cordovaOauth.google("506479374537-4o2pa5ghuj68ocudca9fbohmikfsth56.apps.googleusercontent.com", ["email", "profile"]).then(function(result) {
            $scope.auth.$authWithOAuthToken("google", result.access_token).then(function (authData) {
              alert("로그인성공");
              console.log("소셜로그인성공")
              console.log(JSON.stringify(authData));
            }, function (error) {
              console.error("ERROR: " + error);
            });
          }, function(error) {
            console.error("ERROR: " + error);
          });
          break;

        case "facebook":
          // 페북에서 Oauth토근 가져와서
          $cordovaOauth.facebook("947628548702706", ["email"], {"auth_type": "rerequest"}).then(function (result) {
            // Firebase에 토큰 가져가서 인증
            $scope.auth.$authWithOAuthToken("facebook", result.access_token).then(function (authData) {
              alert("로그인성공");
              console.log("소셜로그인성공")
              console.log(JSON.stringify(authData));
              $localstorage.setObject('user', authData)
              $location.path('/loginMain');
            }, function (error) {
              console.error("ERROR: " + error);
            });
          }, function (error) {
            console.error("ERROR: " + error);
          });
          break;

        case "twitter":
          $cordovaOauth.twitter("CLIENT_ID_HERE", "CLIENT_SECRET_HERE").then(function(result) {
            console.log(JSON.stringify(result));
          }, function(error) {
            console.error("ERROR: " + error);
          });
          break;

      }
       // TODO: 로그인 성공 후 $localstorage에 인증 정보 저장
       // TODO: MySQL DB 유저정보에 있는지 확인하고 있으면 UPDATE 없으면 INSERT
    }
  }

})

// 회원가입 컨트롤러
  .controller('SignupController', ['$scope', 'Auth', '$location', '$localstorage',
    function ($scope, Auth, $location, $localstorage) {
      $scope.auth = Auth;
      $scope.register = function (useremail, password) {
        console.log('회원가입');
        $scope.auth.$createUserWithEmailAndPassword(useremail, password)
          .then(function (result) {
            console.log('회원가입 성공')
            // TODO: 회원가입 성공시 MySQL DB에 Insert
            console.log('uid : ' + result.uid);
            // result.email;
            // result.provider;

            // TODO: 이메일 인증 처리

            // 회원가입 완료후 로그인페이지로 이동
            $location.path('/signin');
          })
          .catch(function (error) {
            console.log(error);
          })


      };
    }])

  // 비밀번호 초기화 컨트롤러
  .controller('ResetPasswordController', ['$scope', 'Auth', '$location', '$localstorage',
    function ($scope, Auth, $location, $localstorage) {
      $scope.auth = Auth;
      $scope.resetPassword = function (useremail) {
        console.log("비밀번호 초기화");


      };
    }])

  // 로그인 메인 컨트롤러
  .controller('LoginMainController', ['$scope', 'Auth', '$location', '$localstorage',
    function ($scope, Auth, $location, $localstorage) {
      $scope.auth = Auth;
      var user = $localstorage.get("user");
      console.log(user);
      $scope.user = user;
      $scope.img = "/img/ionic.png";

    }])

  // TODO: 로그아웃, 정보변경, 회원탈퇴 등등
  .controller('AccountController', ['$scope', 'Auth', '$location', '$localstorage',
    function ($scope, Auth, $location, $localstorage) {
      $scope.auth = Auth;

    }]);