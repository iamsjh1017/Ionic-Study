// 로그인 컨트롤러
app.controller('SigninController', function ($scope, AuthService) {
  // TODO: 로그인 폼 유효성 검사

  $scope.loginWithEmail = AuthService.loginWithEmail;
  $scope.loginWithPortal = AuthService.loginWithSocial;
})

// 회원가입 컨트롤러
  .controller('SignupController', function ($scope, AuthService) {
    // TODO: 회원가입 폼 유효성 검사

    $scope.register = AuthService.register;
  })

  // 비밀번호 초기화 컨트롤러
  .controller('ResetPasswordController', function ($scope, AuthService) {
    $scope.resetPassword = AuthService.resetPassword;
  })

  // 로그인 메인 컨트롤러
  .controller('LoginMainController', function ($scope, $interval, AuthService) {
    $scope.logout = AuthService.logout;
    $scope.resign = AuthService.resign;
  })

  // 프로필 컨트롤러
  .controller('ProfileController', function ($scope, $interval, AuthService) {

    // TODO: 로컬스토리지의 유저정보가 바뀔때마다 이를 감지해서 유저정보를 스코프에 저장해주어야 함
    $scope.getUser = function () {
      $scope.user = AuthService.getCurrentUser();
      console.log('유저정보로딩', $scope.user);
    }

  })
;
