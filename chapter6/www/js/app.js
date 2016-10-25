angular.module('App', ['ionic'])
    
    .config(function ($stateProvider, $urlRouterProvider) {

        // 검색용 상태 선언
        $stateProvider
            .state('search', {
                url: '/search',
                controller: 'SearchController',
                templateUrl: 'views/search/search.html'
            })
            .state('settings', {
                url: '/settings',
                controller: 'SettingsController',
                templateUrl: 'views/settings/settings.html'
            })
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

    .controller('LeftMenuController', function ($scope, Locations) {
        $scope.locations = Locations.data;
    })

    .filter('timezone', function () {
        return function (input, timezone) {
            if (input && timezone) {
                var time = moment.tz(input * 1000, timezone);
                return time.format('LT');
            }
            return '';
        };
    })

    .filter('chance', function () {
        return function (chance) {
            if (chance) {
                var value = Math.round(chance * 10);
                return value * 10;
            }
            return 0;
        };
    })

    .filter('icons', function () {
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
            toggle: function (item) {
                var index = Locations.getIndex(item);
                if (index >= 0) {
                    $ionicPopup.confirm({
                        title: 'Are you sure?',
                        template: 'This will remove ' + Locations.data[index].city
                    }).then(function (res) {
                        if (res) {
                            Locations.data.splice(index, 1);
                        }
                    });
                } else {
                    Locations.data.push(item);
                    $ionicPopup.alert({
                        title: 'Location saved'
                    });
                }
            },
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

        return Locations;
    });
