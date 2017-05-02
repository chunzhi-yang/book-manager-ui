'use strict';
app.controller('loginCtrl',['httpService','$scope','$location','curUserService','$ionicPopup',
	function(httpService,$scope,$location,curUserService,$ionicPopup){
	$scope.doCreate = function(){

		var param = {};
		param['userName'] = $scope.regist.userName;
		param['password'] = encrypt($scope.regist.userPassword);
		httpService.post('login/signup',param).then(function(r){

			if(r.data>0){
				var myPopup =
				$ionicPopup.show({
					template: '<label class="text-center">注册成功</label>',
				    title: '消息',
				    scope: $scope,
				    buttons: [
				        {
				        	text: '<b>确定</b>',
				         	type: 'button-positive',
				         	onTap: function(e) {
					           $location.url("login/signin");
				         	}
				        },
				    ]
				});

			}

		},function(e){
			console.log(e);
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
	  var flag = $scope.login.rememberMe ?$scope.login.rememberMe:false;
		var param = {userName:$scope.login.userName,rememberMe: flag};
		param.password = encrypt($scope.login.userPassword);
    curUserService.doLogin(param);
	}
	$scope.changePassword = function(){

	}
}]);
