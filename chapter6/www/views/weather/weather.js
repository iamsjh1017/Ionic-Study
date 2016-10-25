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

        // 액션시트를 설정하고 보여주기 위해 show메소드를 사용 $ionicActionSheet서비스가 주입되어 있어야만 한다.
        $scope.showOptions = function () {
            var sheet = $ionicActionSheet.show({
                // 버튼을 위한 객체들의 배열. 객체는 text속성을 가져야 한다
                buttons: [
                    {text: 'Toggle Favorite'},
                    {text: 'Set as Primary'},
                    {text: 'Sunrise Sunset Chart'}
                ],
                // 취소 버튼의 텍스트 지정
                cancelText: 'Cancel',
                // 버튼이 클릭되었을때 실행될 메소드. 선택된 버튼의 인덱스가 주어진다.
                buttonClicked: function (index) {
                    // 현재 지역을 선호 지역으로 지정하거나 빼기 위해 Locations 서비스 사용
                    if (index === 0) {
                        Locations.toggle($stateParams);
                    }
                    // 현재 지역을 주요 지역으로 정하기 위해 Locations 서비스 사용
                    if (index === 1) {
                        Locations.primary($stateParams);
                    }
                    // 모달 창을 연다
                    if (index === 2) {
                        $scope.showModal();
                    }
                    return true;
                }
            });
        };

        // 모달을 열기 위한 메소드
        $scope.showModal = function () {
            // 모달이 이미 존재한다면, 다시 보여준다
            if ($scope.modal) {
                $scope.modal.show();
            } else {
                $ionicModal.fromTemplateUrl('views/weather/modal-chart.html', {
                    scope: $scope
                }).then(function (modal) {
                    // 템플릿이 로드되면 모달 인스턴스를 스코프에 저장한다.
                    $scope.modal = modal;
                    // 계산을 위한 변수들을 생성
                    var days = [];
                    var day = Date.now();
                    // 각각의 날에 대한 타임스탬프 지정
                    for (var i = 0; i < 365; i++) {
                        day += 1000 * 60 * 60 * 24;
                        // 위도, 경도, 날짜를 기반으로 시간을 얻기 위해 SunCalc 사용
                        days.push(SunCalc.getTimes(day, $scope.params.lat, $scope.params.lng));
                    }
                    // 날짜 목록을 스코프에 부여
                    $scope.chart = days;
                    // 그리고 모달을 보여준다
                    $scope.modal.show();
                });
            }
        };
        // 모달을 숨기는 메소드
        $scope.hideModal = function () {
            $scope.modal.hide();
        };
        // 현재뷰가 소멸 될 때 모달도 메모리에서 제거한다.
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
    });
