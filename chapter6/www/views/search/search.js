angular.module('App')
.controller('SearchController', function ($scope, $http) {
  // 검색어를 위한 모델 정의
  $scope.model = {term: ''};

  // 검색어와 지오코딩 API로 검색한 결과를 저장하기 위한 메소드
  $scope.search = function () {
    $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {address: $scope.model.term}}).success(function (response) {
      $scope.results = response.results;
    });
  };
});
