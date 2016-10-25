angular.module('App', ['ionic'])
    
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            // 검색용 상태 선언
            .state('search', {
                url: '/search',
                controller: 'SearchController',
                templateUrl: 'views/search/search.html'
            })
            // 설정 뷰를 위한 상태 선언
            .state('settings', {
                url: '/settings',
                controller: 'SettingsController',
                templateUrl: 'views/settings/settings.html'
            })
            // 날씨 뷰를 위한 상태 선언
            .state('weather', {
                url: '/weather/:city/:lat/:lng',
                controller: 'WeatherController',
                templateUrl: 'views/weather/weather.html'
            });


        // 검색을 위한 상태를 기본 뷰로 사용
        $urlRouterProvider.otherwise('/search');
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

    // 컨트롤러를 만들고 서비스를 주입
    .controller('LeftMenuController', function ($scope, Locations) {
        // Locations.data 배열을 스코프에 대입
        $scope.locations = Locations.data;
    })

    // 해당 지역의 시간대를 변환하는 timezone 필터
    .filter('timezone', function () {
        return function (input, timezone) {
            // 타임스탬프와 타임존 인자가 모두 주어질 때에만 타임스탬프를 변환
            if (input && timezone) {
                var time = moment.tz(input * 1000, timezone);
                return time.format('LT');
            }
            return '';
        };
    })

    // 강수 확률을 변환할 chance 필터
    .filter('chance', function () {
        return function (chance) {
            // 값이 주어지면 10의 배수에 가까운 값으로 근사
            if (chance) {
                var value = Math.round(chance * 10);
                return value * 10;
            }
            return 0;
        };
    })

    // 날씨 상태에 따라 아이콘을 변경하는 icons필터
    .filter('icons', function () {
        // 기상 조건과 이에 대응하는 아이콘을 맵으로 구성하고, 상황에 맞는 아이콘을 반환
        var map = {
            'clear-day': 'ion-ios-sunny',
            'clear-night': 'ion-ios-moon',
            rain: 'ion-ios-rainy',
            snow: 'ion-ios-snowy',
            sleet: 'ion-ios-rainy',
            wind: 'ion-ios-flag',
            fog: 'ion-ios-cloud',
            cloudy: 'ion-ios-cloudy',
            'partly-cloudy-day': 'ion-ios-partlysunny',
            'partly-cloudy-night': 'ion-ios-cloudy-night'
        };
        return function (icon) {
            return map[icon] || '';
        }
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
