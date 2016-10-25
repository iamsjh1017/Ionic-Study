angular.module('App')
    // 컨트롤러를 등록하고 서비스를 주입
    .controller('DetailController', function ($scope, $stateParams, $state, Currencies) {
        // 요청받은 화폐를 찾기 위해 순회한 후 스코프에 저장
        angular.forEach(Currencies, function (currency) {
            if (currency.code === $stateParams.currency) {
                $scope.currency = currency;
            }
        });
        // 화폐와 시세 데이터가 없으며 환율 뷰로 돌아감
        if (angular.isUndefined($scope.currency.ticker)) {
            $state.go('tabs.rates');
        }

    });
