app.controller('mainCtrl',['$rootScope','$scope','curUserService', function($rootScope,$scope,curUserService) {
	console.log($rootScope.darkTheme);
	$scope.logout = function(){
		curUserService.doLogout();
	}

}]);
