'use strict';
app.controller('loginCtrl',['httpService','$scope','Config','$http',
	function(httpService,$scope,config,$http){
	$scope.doCreate = function(regist){
		var param = {username:regist.userName};
		RSAUtils.setMaxDigits(200);
		var key = new RSAUtils.getKeyPair($scope.publicKeyExponent,"",$scope.publicKeyModulus);
		var reversedPwd = $scope.password.split('').reverse().join('');
		var encryptedPwd = RSAUtils.encryptedString(key,reversedPwd);
		param.password = encryptedPwd;
		$http.post(config.serverUrl+'/login/signin',param).then(function(r){
			console.log(r);
		});
	}
	$http.get(config.serverUrl+'/login/publicKey',{'headers': {
          'Content-Disposition': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'

        }}).then(function(data){
		$scope.publicKeyExponent = data.data.publicKeyExponent;
		$scope.publicKeyModulus = data.data.publicKeyModulus;		
	});

	$scope.doLogin = function(){
		console.log( $scope.loginForm);
	}
	$scope.changePassword = function(){

	}
}]);