angular.module('App')
    // 컨트롤러를 만들고 서비스를 주입
    .controller('HistoryController', function ($scope, $http, $state, $stateParams, Currencies) {

        // history 모델을 정의하고, US 달러를 기본으로 설정
        $scope.history = {
            currency: $stateParams.currency || 'USD'
        };
        // 스코프에 화폐 목록을 저장
        $scope.currencies = Currencies;

        // 새로운 통화가 선택 되었을 때 변경 사항을 처리할 함수
        $scope.changeCurrency = function () {
            $state.go('tabs.history', {currency: $scope.history.currency});
        };

        // HIghcharts 디렉티브가 차트를 보여줄 때 사용할 차트 정의 객체
        $scope.chart = {
            options: {
                chart: {
                    type: 'line'
                },
                legend: {
                    enabled: false
                }
            },
            title: {
                text: null
            },
            yAxis: {
                title: null
            },
            xAxis: {
                type: 'datetime'
            },
            series: []
        };

        // 선택한 화폐를 기준으로 이력 정보를 불러옴
        $http.get('https://api.bitcoinaverage.com/history/' + $scope.history.currency + '/per_hour_monthly_sliding_window.csv').success(function (prices) {

            // 가격 문자열을 분리시켜 가격 행의 배열로 변환
            prices = prices.split(/\n/);
            
            // 데이터를 저장할 빈 series 객체를 생성
            var series = {
                data: []
            };

            // 루프를 돌며 가격 행에 접근
            angular.forEach(prices, function (price, index) {
                // 콤마로 구분된 문자열을 분리해서 배열로 변환
                price = price.split(',');
                // 시간과 가격 정보를 파싱하고 포맷을 지정
                var date = new Date(price[0].replace(' ', 'T')).getTime();
                var value = parseFloat(price[3]);
                // 날짜와 값이 유효하면 series에 추가
                if (date && value > 0) {
                    series.data.push([date, value]);
                }
            });

            // 완료된 series 데이터를 차트에 추가
            $scope.chart.series.push(series);
        });

        // $ionicView.enter 이벤트를 감지하면 잘못 캐시된 화폐 모델 값을 재설정한다.
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.history = {
                currency: $stateParams.currency || 'USD'
            };
        });
    });
