// TODO: 로그아웃, 정보변경, 회원탈퇴 등등
// 회원 관련 서비스
app.factory('AuthService', function ($location, $firebaseAuth, $cordovaOauth, $http, MyPopup, Localstorage) {
  return {
    // 이메일 로그인 메소드
    loginWithEmail: function (useremail, password, redirectTo) {
      if ($firebaseAuth().$getAuth()) {
        $firebaseAuth().$signOut();
        Localstorage.remove('user');
        console.log('로그아웃');
        $firebaseAuth().$signOut();
        MyPopup.show('알림', '로그아웃 되었습니다.');
      } else {
        $firebaseAuth().$signInWithEmailAndPassword(useremail, password)
          .then(function (result) {
            // 이메일 인증 확인
            if (!result.emailVerified) {
              MyPopup.show('로그인 실패', '이메일 인증이 필요합니다.')
              $firebaseAuth().$signOut();
              return;
            }
            console.log('이메일 로그인 성공');
            // 로그인 성공 후 Localstorage에 유저정보 저장
            Localstorage.setObject("user", result);

            // 로그인 성공후 페이지 이동
            $location.path(redirectTo);
          })
          .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              console.log('로그인 실패 : 비밀번호가 잘못되었습니다.');
              MyPopup.show('로그인 실패', '비밀번호가 잘못되었습니다.');
            } else {
              console.log('로그인 실패 : ' + errorMessage);
              MyPopup.show('로그인 실패', errorMessage);
            }
          });
      }
    },

    // 소셜 로그인 메소드
    loginWithSocial: function (providerName, redirecTo) {

      // TODO: 소셜 로그인 메소드
      // TODO: 로그인 성공 후 $localstorage에 인증 정보 저장
      // TODO: MySQL DB 유저정보에 있는지 확인하고 있으면 UPDATE 없으면 INSERT
      if ($firebaseAuth().$getAuth()) {
        $firebaseAuth().$signOut();
        Localstorage.remove('user');
        console.log('로그아웃');
      } else {
        switch (providerName) {

          case "google":
            if (ionic.Platform.isWebView()) {
              $cordovaOauth.google("506479374537-4o2pa5ghuj68ocudca9fbohmikfsth56.apps.googleusercontent.com" + "&include_profile=true", ["email", "profile"]).then(function (result) {
                var credential = firebase.auth.GoogleAuthProvider.credential(result.id_token);
                console.log('----------------credential--------------');
                console.log(result);
                console.log(result.id_token);
                console.log(result.access_token);
                console.log(credential);
                console.log('----------------------------------------');
                firebase.auth().signInWithCredential(credential).then(function (result) {
                  MyPopup.show('알림', '구글 로그인성공');
                  Localstorage.setObject('user', result);
                  $location.path(redirecTo);
                }, function (error) {
                  console.error("firebase: " + error);
                });
              }, function (error) {
                console.error("ERROR: " + error);
              });
            } else {
              var provider = new firebase.auth.GoogleAuthProvider();
              provider.addScope('email');
              provider.addScope('profile');
              firebase.auth().signInWithPopup(provider).then(function (result) {
                MyPopup.show('알림', '구글 로그인성공');
                Localstorage.setObject('user', result);
                $location.path(redirecTo);
              });
            }
            break;

          case "facebook":
            // 페북에서 Oauth토근 가져와서
            $cordovaOauth.facebook("947628548702706", ["email"]).then(function (result) {
              // Firebase에 토큰 가져가서 인증
              $firebaseAuth().$authWithOAuthToken("facebook", result.access_token).then(function (authData) {
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
            $cordovaOauth.twitter("CLIENT_ID_HERE", "CLIENT_SECRET_HERE").then(function (result) {
              console.log(JSON.stringify(result));
            }, function (error) {
              console.error("ERROR: " + error);
            });
            break;

        }
      }
    },

    // 로그아웃 메소드
    logout: function () {
      $firebaseAuth().$signOut();
      Localstorage.remove('user');
      MyPopup.show('알림', '로그아웃 되었습니다.');
      console.log('로그아웃');
    },

    // 이메일 회원가입 메소드
    register: function (username, useremail, password, redirectTo) {
      console.log('회원가입');
      $firebaseAuth().$createUserWithEmailAndPassword(useremail, password)
        .then(function (result) {

          // 회원정보 파싱
          var uid = result.uid;
          var email = result.email;
          var photoURL = result.photoURL;
          var providerId = result.providerId;
          var providerData = result.providerData;

          // 회원정보 DB 입력
          $http({
            url: 'http://localhost:3001/rscamper-server/app/user/insert',
            method: 'POST',
            data: $.param({
              userUid: uid,
              displayName: username,
              email: email,
              photoUrl: photoURL,
              providerName: providerId,
              providerUid: providerData.uid,
              providerDisplayName: providerData.displayName,
              providerPhotoUrl: providerData.photoUrl,
              providerEmail: providerData.email
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          }).success(function () {
            console.log('회원정보 DB입력 성공');
            // 인증 메일 발송
            firebase.auth().currentUser.sendEmailVerification().then(function () {
              MyPopup.show('회원가입 성공', '계정 활성화를 위해 이메일 인증을 해주시기 바랍니다.');
              // 회원가입 완료후 로그인페이지로 이동
              $location.path(redirectTo);
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    // 비밀번호 초기화 메소드
    resetPassword: function (useremail) {
      firebase.auth().sendPasswordResetEmail(useremail).then(function () {
        MyPopup.show('알림', '비밀번호 초기화 메일이 발송 되었습니다. 이메일을 확인해 주세요!');
        $location.path('/signin');
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
          MyPopup.show('에러', '잘못된 이메일 주소입니다.');
        } else if (errorCode == 'auth/user-not-found') {
          MyPopup.show('에러', '요청한 이메일이 존재하지 않습니다.');
        }
        console.log(error);
      });
    },

    // 인증메일 재발송
    sendVerifyEmail: function (email) {

    },

    // 로그인한 유저정보 가져오기
    getCurrentUser: function () {
      return Localstorage.getObject('user');
    },

    // 회원탈퇴 메소드
    resign: function () {
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      user.delete().then(function() {
        $http({
          url: 'http://localhost:3001/rscamper-server/app/user/delete',
          method: 'POST',
          data: $.param({
            userUid: uid
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        }).success(function () {
          MyPopup.show('성공', '회원탈퇴가 완료되었습니다.');
        });
      }, function(error) {
        MyPopup.show('에러', error);
      });
    },

    // 회원정보 수정 메소드
    update: function () {

    }
  };
})



// [유틸] localStorage사용을 위한 셋팅
  .factory('Localstorage', ['$window', function ($window) {
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
      },
      remove: function (key) {
        $window.localStorage.removeItem(key);
      }
    }
  }])

  // [유틸] 팝업창 사용을 위한 서비스
  .factory('MyPopup', ['$ionicPopup', function ($ionicPopup) {
    return {
      show: function (title, template) {
        $ionicPopup.alert({
          title: title,
          template: template
        })
          .then(function (res) {
          });
      }
    }
  }]);

