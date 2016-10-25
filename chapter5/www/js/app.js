// 앱 모듈을 선언하고 ionic 모듈을 포함시킴
angular.module('App', ['ionic', 'highcharts-ng'])
    // config() 메소드를 선언하고 서비스 주입 
    .config(function ($stateProvider, $urlRouterProvider) {
        // 탭을 위한 상태 선언
        $stateProvider
            .state('tabs', {
                url: '/tabs',
                // tabs 상태를 abstract로 수정한다. 항상 자식 상태를 사용하기 떄문이다.
                abstract: true,
                templateUrl: 'views/tabs/tabs.html'
            })
            // 부모-자식 관계를 표현하기 위해 닷(.)표기법을 사용해 tabs.rates를 선언한다.
            .state('tabs.rates', {
                // 라우팅할 URL을 선언한다. 자식 상태이기 떄문에 여기에는 부모의 URL이 추가된다.
                url: '/rates',
                // 환율 뷰에 대한 이름을 선언하고 관련 템플릿을 전달한다.
                views: {
                    'rates-tab': {
                        templateUrl: 'views/rates/rates.html',
                        controller: 'RatesController'
                    }
                }
            })
            // 이력 뷰 선언
            .state('tabs.history', {
                // 화폐 값을 전달하는 파라미터 추가
                url: '/history?currency',
                views: {
                    'history-tab': {
                        templateUrl: 'views/history/history.html',
                        // 컨트롤러의 선언
                        controller: 'HistoryController'
                    }
                }
            })
            // 통화 뷰 선언
            .state('tabs.currencies', {
                url: '/currencies',
                views: {
                    'currencies-tab': {
                        templateUrl: 'views/currencies/currencies.html',
                        controller: 'CurrenciesController'
                    }
                }
            })
            // 화폐코드를 나타내는 파라미터인 :currency
            .state('tabs.detail', {
                url: '/detail/:currency',
                views: {
                    // 환율 탭의 뷰를 재사용한다. 이상태도 같은 영역에 표시되기 때문이다.
                    'rates-tab': {
                        // 템플릿과 컨트롤러 선언
                        templateUrl: 'views/detail/detail.html',
                        controller: 'DetailController'
                    }
                }
            });
        // 기본 라우팅 경로를 환율 뷰로 지정
        $urlRouterProvider.otherwise('/tabs/rates');
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

    // AngularJS의 factory 메소드로 서비스를 등록
    .factory('Currencies', function () {
        return [
            // 화폐 배열을 생성하고 디폴트 여부를 설정
            {code: 'AUD', text: 'Australian Dollar', selected: true},
            {code: 'BRL', text: 'Brazilian Real', selected: false},
            {code: 'CAD', text: 'Canadian Dollar', selected: true},
            {code: 'CNY', text: 'Chinese Yuan', selected: true},
            {code: 'EUR', text: 'Euro', selected: true},
            {code: 'GBP', text: 'British Pound Sterling', selected: true},
            {code: 'IDR', text: 'Indonesian Rupiah', selected: false},
            {code: 'ILS', text: 'Israeli New Sheqel', selected: false},
            {code: 'MXN', text: 'Mexican Peso', selected: true},
            {code: 'NOK', text: 'Norwegian Krone', selected: false},
            {code: 'NZD', text: 'New Zealand Dollar', selected: false},
            {code: 'PLN', text: 'Polish Zloty', selected: false},
            {code: 'RON', text: 'Romanian Leu', selected: false},
            {code: 'RUB', text: 'Russian Ruble', selected: true},
            {code: 'SEK', text: 'Swedish Krona', selected: false},
            {code: 'SGD', text: 'Singapore Dollar', selected: false},
            {code: 'USD', text: 'United States Dollar', selected: true},
            {code: 'ZAR', text: 'South African Rand', selected: false}
        ];
    });
