// 로그인 컨트롤러
app.controller('SigninController', function ($scope, $auth, $location, $localstorage, $cordovaOauth, $myPopup) {
  // 인증 객체 스코프에 저장
  $scope.auth = $auth;
  console.log($auth);

  // TODO: 로그인 폼 유효성 검사

  // 이메일 로그인 메소드
  $scope.loginWithEmail = function (useremail, password) {
    if ($scope.auth.$getAuth()) {
      console.log("로그아웃됨");
      $scope.auth.$signOut();
    } else {
      $scope.auth.$signInWithEmailAndPassword(useremail, password)
        .then(function (result) {
          // 이메일 인증 확인
          if (!result.emailVerified) {
            $myPopup.show('로그인 실패', '이메일 인증이 필요합니다.')
            $scope.auth.$signOut();
            return;
          }
          console.log('이메일 로그인 성공');
          // 로그인 성공 후 $localstorage에 유저정보 저장
          $localstorage.setObject("user", result);

          // 로그인 성공후 페이지 이동
          $location.path('/loginMain');
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            console.log('로그인 실패 : 비밀번호가 잘못되었습니다.');
            $myPopup.show('로그인 실패', '비밀번호가 잘못되었습니다.');
          } else {
            console.log('로그인 실패 : ' + errorMessage);
            $myPopup.show('로그인 실패', errorMessage);
          }
        });
    }
  };

  // TODO: 소셜 로그인 메소드
  // TODO: 로그인 성공 후 $localstorage에 인증 정보 저장
  // TODO: MySQL DB 유저정보에 있는지 확인하고 있으면 UPDATE 없으면 INSERT
  $scope.loginWithPortal = function (providerName) {
    if ($scope.auth.$getAuth()) {
      console.log("로그아웃됨");
      $scope.auth.$signOut();
    } else {

      switch (providerName) {
        case "google":
          $cordovaOauth.google("506479374537-4o2pa5ghuj68ocudca9fbohmikfsth56.apps.googleusercontent.com", ["email", "profile"]).then(function(result) {
            var credential = new firebase.auth.GoogleAuthProvider.credential(result.id_token);
            console.log('----------------credential--------------');
            console.log(result);
            console.log(result.id_token);
            console.log(result.access_token);
            console.log(credential);
            console.log('----------------------------------------');
            $scope.auth.$signInWithCredential(credential).then(function (authData) {
              $myPopup.show('알림', '구글 로그인성공');
              $localstorage.setObject('user', JSON.stringify(authData));
              $location.path('/loginMain');
            }, function (error) {
              console.error("firebase: " + error);
            });
          }, function(error) {
            console.error("ERROR: " + error);
          });
          break;


        case "facebook":
          // 페북에서 Oauth토근 가져와서
          $cordovaOauth.facebook("947628548702706", ["email"]).then(function (result) {
            // Firebase에 토큰 가져가서 인증
            $scope.auth.$authWithOAuthToken("facebook", result.access_token).then(function (authData) {
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

    }
  }

})

// 회원가입 컨트롤러
  .controller('SignupController', ['$scope', '$auth', '$location', '$localstorage', '$myPopup',
    function ($scope, $auth, $location, $localstorage, $myPopup) {
      $scope.auth = $auth;


      // TODO: 회원가입 폼 유효성 검사

      // 이메일 회원 등록 메소드
      $scope.register = function (username, useremail, password) {
        console.log('회원가입');
        $scope.auth.$createUserWithEmailAndPassword(useremail, password)
          .then(function (result) {
            // TODO: 회원가입 성공시 MySQL DB에 Insert
            var uid = result.uid;
            result.displayName = username;
            var displayName = esult.displayName;
            var email = result.email;
            var photoURL = result.photoURL;
            var providerId = result.providerId;
            var providerData = result.providerData;
            console.log('uid : ' + uid);
            console.log('displayName : ' + displayName);
            console.log('email : ' + email);
            console.log('photoURL : ' + photoURL);
            console.log('providerId :  ' + providerId);
            console.log('providerData : ' + providerData);

            // 인증 메일 발송
            firebase.auth().currentUser.sendEmailVerification().then(function() {
              $myPopup.show('회원가입 성공', '계정 활성화를 위해 이메일 인증을 해주시기 바랍니다.');
            });

            // 회원가입 완료후 로그인페이지로 이동
            $location.path('/signin');
          })
          .catch(function (error) {
            console.log(error);
          })


      };
    }])

  // 비밀번호 초기화 컨트롤러
  .controller('ResetPasswordController', ['$scope', '$auth', '$location', '$localstorage', '$myPopup',
    function ($scope, $auth, $location, $localstorage, $myPopup) {
      $scope.auth = $auth;
      $scope.resetPassword = function (useremail) {
        firebase.auth().sendPasswordResetEmail(useremail).then(function() {
          $myPopup.show('알림', '비밀번호 초기화 메일이 발송 되었습니다. 이메일을 확인해 주세요!');
          $location.path('/signin');
        }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/invalid-email') {
            $myPopup.show('에러', '잘못된 이메일 주소입니다.');
          } else if (errorCode == 'auth/user-not-found') {
            $myPopup.show('에러', '요청한 이메일이 존재하지 않습니다.');
          }
          console.log(error);
        });
      };
    }])

  // 로그인 메인 컨트롤러
  .controller('LoginMainController', ['$scope', '$auth', '$location', '$localstorage',
    function ($scope, $auth, $location, $localstorage) {
      $scope.auth = $auth;
      var user = $localstorage.get('user');
      console.log('유저정보로딩', user);

      // TODO: 로그인 정보가 있으면 로그아웃 버튼 활성화, 없으면 로그인 버튼 활성화
      if (user) {

      } else {

      };



      $scope.user = user;
      $scope.img = '/img/ionic.png';

    }])

  // TODO: 로그아웃, 정보변경, 회원탈퇴 등등
  .controller('AccountController', ['$scope', '$auth', '$location', '$localstorage',
    function ($scope, $auth, $location, $localstorage) {
      $scope.auth = $auth;

    }]);
