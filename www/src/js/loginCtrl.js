'use strict';
app.controller('loginCtrl',['httpService','$scope','Config','$http',
	function(httpService,$scope,config,$http){
	$scope.doCreate = function(){
	
		var param = {userName:$scope.regist.userName};
		
		param.userPassword = encrypt($scope.regist.userPassword);
		$http.post(config.serverUrl+'/login/signup?userName='+param.userName+'&userPassword='+param.userPassword).then(function(r){
			console.log(r);
		});
	}
	var p = httpService.get('login/getRSAPublicKey'); 
	p.then(function(data){
		$scope.publicKeyExponent = data.data.publicKeyExponent;
		$scope.publicKeyModulus = data.data.publicKeyModulus;		
	},function(e){
		 
	});

	var encrypt = function(pwd){
		RSAUtils.setMaxDigits(200); 
		var key = new RSAUtils.getKeyPair($scope.publicKeyExponent,"",$scope.publicKeyModulus); 
		var reversedPwd = pwd.split('').reverse().join('');		
		var encryptedPwd = RSAUtils.encryptedString(key,reversedPwd);
		return encryptedPwd;
	}
	$scope.doLogin = function(){
		var param = {userName:$scope.login.userName};
		
		param.userPassword = encrypt($scope.login.userPassword);
		$http.post(config.serverUrl+'/login/signin?userName='+param.userName+'&userPassword='+param.userPassword).then(function(r){
			console.log(r);
		});
	}
	$scope.changePassword = function(){

	}
}]);