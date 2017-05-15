'use strict';
app.controller('loginCtrl',['httpService','$scope','$location','curUserService','Popup',
	function(httpService,$scope,$location,curUserService,Popup){
	$scope.doCreate = function(){

		var param = {};
		param['userName'] = $scope.regist.userName;
		param['password'] = encrypt($scope.regist.userPassword);
		httpService.post('login/signup',param).then(function(r){
      console.log(r);
			if(r.data.success){
        Popup.alert("注册成功!",function(){
            $location.url('login/signin');
        });

			}else{
        Popup.alert(r.data.message,function(){

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
