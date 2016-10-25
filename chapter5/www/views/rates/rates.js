angular.module('App')
    // RatesController를 선언하고 사용할 서비스를 주입
    // $ionicPopover 서비스 주입
    .controller('RatesController', function ($scope, $http, $ionicPopover, Currencies, $interval) {

        // 스코프에 Currencies서비스 데이터를 지정
        $scope.currencies = Currencies;

        // 탬플릿 URL로 팝오버를 선언하고, 스코프는 부모 스코프로 지정
        $ionicPopover.fromTemplateUrl('views/rates/help-popover.html', {
            scope: $scope,
        // 탬플릿이 로딩되면 스코프에 팝오버 저장
        }).then(function (popover) {
            $scope.popover = popover;
        });
        // 팝오버를 열기 위한 $scope의 메소드. $event 전달을 필요로 한다.
        $scope.openHelp = function ($event) {
            $scope.popover.show($event);
        };
        // $destroy 이벤트를 리스닝. 뷰가 사라질 때 팝오버도 정리한다.(7시방향)
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
            // finally() 메소드는 HTTP 요청이 완료되었을 때 성공 실패 여부에 관계없이 호출된다.
            }).finally(function () {
                // scroll.refreshComplete 이벤트를 브로드캐스팅하면 ionRefresher가 닫을 시점을 알게 된다.
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        // 컨트롤러가 처음 로딩될 때 load 호출
        $scope.load();

        // 1분에 한번 업데이트
        $interval($scope.load, 100 * 60);

    });
