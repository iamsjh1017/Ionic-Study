angular.module('App', ['ionic'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
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
                url: '/resetPassword/',
                controller: 'resetPasswordController',
                templateUrl: 'views/login/resetPassword.html'
            });


        // 검색을 위한 상태를 기본 뷰로 사용
        $urlRouterProvider.otherwise('/login');
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

    // 팩토리로 Settings 서비스 선언
    .factory('Settings', function () {
        // 기본 설정값을 가지는 자바스크립트 객체를 만들고 반환
        var Settings = {
            units: 'us',
            days: 8
        };
        return Settings;
    })

    // 팩토리로 Locations 서비스 선언
    .factory('Locations', function ($ionicPopup) {
        // Locations 객체를 생성하고 데이터 배열에 시카고 지역의 값을 기본으로 저장
        var Locations = {
            data: [{
                city: 'Chicago, IL, USA',
                lat: 41.8781136,
                lng: -87.6297982
            }],
            // 특정지역의 인덱스 값을 얻기 위한 메소드
            getIndex: function (item) {
                var index = -1;
                angular.forEach(Locations.data, function (location, i) {
                    if (item.lat == location.lat && item.lng == location.lng) {
                        index = i;
                    }
                });
                return index;
            },
            // Locations에서 아이템 추가와 삭제를 토글링하는 메소드
            toggle: function (item) {
                var index = Locations.getIndex(item);
                if (index >= 0) {
                    // 확인 팝업을 만들고, 이를 정의하기 위한 객체를 전달, 기본값은 OK와 Cancel 버튼을 가짐
                    $ionicPopup.confirm({
                        // 팝업의 제목과 내용을 지정
                        title: 'Are you sure?',
                        template: 'This will remove ' + Locations.data[index].city
                    }).then(function (res) {
                        // 버튼이 선택되면 함수가 호출되고, 사용자가 아이템을 삭제하기 위해 OK를 눌렀다면 res는 true값을 가짐
                        if (res) {
                            Locations.data.splice(index, 1);
                        }
                    });
                } else {
                    Locations.data.push(item);
                    $ionicPopup.alert({
                        // 제목을 지정하고 경고 팝업을 생성 기본값은 OK 버튼만 있음
                        title: 'Location saved'
                    });
                }
            },
            // 주어진 아이템을 맨 위로 옮기거나 추가하는 primary메소드
            primary: function (item) {
                var index = Locations.getIndex(item);
                if (index >= 0) {
                    Locations.data.splice(index, 1);
                    Locations.data.splice(0, 0, item);
                } else {
                    Locations.data.unshift(item);
                }
            }
        };

        // 데이터와 메소드를 가지는 Locations 객체 반환
        return Locations;
    });
