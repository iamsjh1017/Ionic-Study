// TODO: 로그아웃, 정보변경, 회원탈퇴 등등
// 회원 관련 서비스
app.factory('AuthService', function ($location, $firebaseAuth, $cordovaOauth, $http, MyPopup, Localstorage, DbService) {
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
            var userUid = result.uid;
            DbService.selectUserByUid(userUid, function (userData) {
              console.log(userData);
              Localstorage.setObject("user", userData);
              $location.path(redirectTo);
            });
          })
          .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              MyPopup.show('로그인 실패', '비밀번호가 잘못되었습니다.');
            } else {
              MyPopup.show('로그인 실패', errorMessage);
            }
          });
      }
    },

    // 소셜 로그인 메소드
    loginWithSocial: function (providerName, redirectTo) {

      // TODO: 소셜 로그인 메소드
      // TODO: 로그인 성공 후 $localstorage에 인증 정보 저장
      // TODO: MySQL DB 유저정보에 있는지 확인하고 있으면 UPDATE 없으면 INSERT
      if ($firebaseAuth().$getAuth()) {
        $firebaseAuth().$signOut();
        Localstorage.remove('user');
        console.log('로그아웃');
        $firebaseAuth().$signOut();
        MyPopup.show('알림', '로그아웃 되었습니다.');
      } else {
        switch (providerName) {
          case "google":
            if (ionic.Platform.isWebView()) {
              $cordovaOauth.google("506479374537-4o2pa5ghuj68ocudca9fbohmikfsth56.apps.googleusercontent.com" + "&include_profile=true", ["email", "profile"]).then(function (result) {
                var credential = firebase.auth.GoogleAuthProvider.credential(result.id_token);
                firebase.auth().signInWithCredential(credential).then(function (result) {

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
                DbService.insertUser(result.user, function () {
                  // DB에서 유저정보 가져오기
                  DbService.selectUserByUid(result.user.uid, function (userData) {
                    console.log(userData);
                    Localstorage.setObject("user", userData);
                    MyPopup.show('알림', '구글 로그인성공');
                    $location.path(redirectTo);
                  });
                })
              });
            }
            break;

          case "facebook":

            if (ionic.Platform.isWebView()) {
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
            } else {
              var provider = new firebase.auth.FacebookAuthProvider();
              firebase.auth().signInWithPopup(provider).then(function (result) {
                DbService.insertUser(result.user, function () {
                  DbService.selectUserByUid(result.user.uid, function (userData) {
                    console.log(userData);
                    Localstorage.setObject("user", userData);
                    MyPopup.show('알림', '페이스북 로그인성공');
                    $location.path(redirectTo);
                  });
                })
              });
            }
            break;

          case "twitter":
            if (ionic.Platform.isWebView()) {
              $cordovaOauth.twitter("O0aubI3UlDJzlzaAVLGJ3BqVf", "qwyWjtCq0TDIXCB8PsoM854B30Pu7ANjKYAyLBaCOYFUWGxeUm").then(function (result) {
                $firebaseAuth().$authWithOAuthToken("twitter", result.access_token).then(function (authData) {
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
            } else {
              var provider = new firebase.auth.TwitterAuthProvider();
              firebase.auth().signInWithPopup(provider).then(function (result) {
                DbService.insertUser(result.user, function () {
                  DbService.selectUserByUid(result.user.uid, function (userData) {
                    console.log(userData);
                    Localstorage.setObject("user", userData);
                    MyPopup.show('알림', '트위터 로그인성공');
                    $location.path(redirectTo);
                  });
                })
              });
            }
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
          DbService.insertUser(result, function () {
            console.log('회원정보 DB입력 성공');
            // 인증 메일 발송
            firebase.auth().currentUser.sendEmailVerification().then(function () {
              MyPopup.show('회원가입 성공', '계정 활성화를 위해 이메일 인증을 해주시기 바랍니다.');
              $firebaseAuth().$signOut();
              Localstorage.remove('user');
              // 회원가입 완료후 로그인페이지로 이동
              $location.path(redirectTo);
            });
          })
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
      var user = AuthService.getCurrentUser();
      var userUid = user.uid;
      user.delete().then(DbService.deleteUserByUid(userUid, function () {
        MyPopup.show('성공', '회원탈퇴가 완료되었습니다.');
      }), function(error) {
        MyPopup.show('에러', error);
      });
    },

    // 회원정보 수정 메소드
    update: function () {

    }
  };
})
  .factory('DbService', ['$http', function ($http) {
    var url = 'http://localhost:3001/rscamper-server/app';
    return {
      // 회원정보 입력 혹은 업데이트
      insertUser: function (userData, successCB) {
        $http({
          url: url + '/user/insert',
          method: 'POST',
          data: $.param({
            userUid: userData.uid,
            displayName: userData.username,
            email: userData.email,
            photoUrl: userData.photoURL,
            providerName: userData.providerId,
            providerUid: userData.providerData.uid,
            providerDisplayName: userData.providerData.displayName,
            providerPhotoUrl: userData.providerData.photoUrl,
            providerEmail: userData.providerData.email
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        }).success(successCB);
      },
      // 회원정보 삭제
      deleteUserByUid: function (userUid, successCB) {
        $http({
          url: url + '/user/delete?userUid=' + userUid,
          method: 'GET'
        }).success(successCB);
      },
      // 회원정보 UID로 조회
      selectUserByUid: function (userUid, successCB) {
        $http({
          url: url + '/user/select/oneUser?userUid=' + userUid,
          method: 'GET'
        }).success(successCB);
      }
    }
  }])

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
      },
      confirm: function (title, template) {
        $ionicPopup.confirm({

        })
          .then(function (res) {
          });
      }
    }
  }]);

