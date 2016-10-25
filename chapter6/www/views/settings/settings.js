angular.module('App')
    // 컨트롤러를 선언하고 서비스를 주입
    .controller('SettingsController', function ($scope, Settings, Locations) {
        // 설정 값과 지역 목록 데이터를 스코프에 저장
        $scope.settings = Settings;
        $scope.locations = Locations.data;
        // 삭제 가능 상태의 기본값 지정
        $scope.canDelete = false;

        // 지역 목록에서 특정 아이템을 삭제 처리하기 위한 메소드 
        $scope.remove = function (index) {
            Locations.toggle(Locations.data[index]);
        };
    });
