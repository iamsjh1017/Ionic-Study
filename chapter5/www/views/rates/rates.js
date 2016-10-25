angular.module('App')
    // RatesController를 선언하고 사용할 서비스를 주입
    .controller('RatesController', function ($scope, $http, $ionicPopover, Currencies) {

        // 스코프에 Currencies서비스 데이터를 지정
        $scope.currencies = Currencies;

        $ionicPopover.fromTemplateUrl('views/rates/help-popover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;
        });
        $scope.openHelp = function ($event) {
            $scope.popover.show($event);
        };
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });

        // 필요시 호출되어 데이터를 불러올 메소드
        $scope.load = function () {
            // 현재 환율을 구하기 위해 BitcoinAverage로 HTTP 요청을 전송
            $http.get('https://api.bitcoinaverage.com/ticker/all').success(function (tickers) {
                // 통화 목록을 순회하면서 시세 데이터를 저장
                angular.forEach($scope.currencies, function (currency) {
                    currency.ticker = tickers[currency.code];
                    // 응답으로 받은 타임스탬프를 자바스크립트 Date객체로 변환
                    currency.ticker.timestamp = new Date(currency.ticker.timestamp);
                });
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        // 컨트롤러가 처음 로딩될 때 load 호출
        $scope.load();
    });
