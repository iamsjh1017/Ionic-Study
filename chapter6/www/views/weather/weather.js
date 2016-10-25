angular.module('App')
    // 컨트롤러를 정의하고 서비스 주입
    .controller('WeatherController', function ($scope, $http, $stateParams, $ionicActionSheet, $ionicModal, Locations, Settings) {
        // 서비스 데이터를 스코프에 대입
        $scope.params = $stateParams;
        $scope.settings = Settings;

        // HTTP요청을 만들어 일기예보를 불러옴
        $http.get('/api/forecast/' + $stateParams.lat + ',' + $stateParams.lng, {params: {units: Settings.units}}).success(function (forecast) {
            $scope.forecast = forecast;
        });

        // 헤더 바의 높이를 구함
        var barHeight = document.getElementsByTagName('ion-header-bar')[0].clientHeight;

        // 앱의 너비를 제공
        $scope.getWidth = function () {
            return window.innerWidth + 'px';
        };

        // 페이지의 수만큼 곱해서 전체 높이를 구함
        $scope.getTotalHeight = function () {
            return parseInt(parseInt($scope.getHeight()) * 3) + 'px';
        };

        // 헤더 바를 제외한 영역의 높이를 구함
        $scope.getHeight = function () {
            return parseInt(window.innerHeight - barHeight) + 'px';
        };

        // 액션
        $scope.showOptions = function () {
            var sheet = $ionicActionSheet.show({
                buttons: [
                    {text: 'Toggle Favorite'},
                    {text: 'Set as Primary'},
                    {text: 'Sunrise Sunset Chart'}
                ],
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    if (index === 0) {
                        Locations.toggle($stateParams);
                    }
                    if (index === 1) {
                        Locations.primary($stateParams);
                    }
                    if (index === 2) {
                        $scope.showModal();
                    }
                    return true;
                }
            });
        };

        $scope.showModal = function () {
            if ($scope.modal) {
                $scope.modal.show();
            } else {
                $ionicModal.fromTemplateUrl('views/weather/modal-chart.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.modal = modal;
                    var days = [];
                    var day = Date.now();
                    for (var i = 0; i < 365; i++) {
                        day += 1000 * 60 * 60 * 24;
                        days.push(SunCalc.getTimes(day, $scope.params.lat, $scope.params.lng));
                    }
                    $scope.chart = days;
                    $scope.modal.show();
                });
            }
        };
        $scope.hideModal = function () {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
    });
