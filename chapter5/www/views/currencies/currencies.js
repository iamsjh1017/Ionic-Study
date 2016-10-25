angular.module('App')
    // 컨트롤러를 선언하고 서비스를 주입
    .controller('CurrenciesController', function ($scope, Currencies) {
        // Currencies를 스코프에 대임
        $scope.currencies = Currencies;
        
        // 기본 재정렬 상태 값을 선언
        $scope.state = {
            reordering: false
        };

        // 탭을 떠나면 재정렬 기능을 끔
        $scope.$on('$stateChangeStart', function () {
            $scope.state.reordering = false;
        });

        // 배열의 splice()를 사용해 아이템 이동을 처리
        $scope.move = function (currency, fromIndex, toIndex) {
            $scope.currencies.splice(fromIndex, 1);
            $scope.currencies.splice(toIndex, 0, currency);
        };
    });
