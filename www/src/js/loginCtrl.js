'use strict';
app.controller('loginCtrl',['httpService','$scope','$location','curUserService','Popup',
	function(httpService,$scope,$location,curUserService,Popup){
	$scope.doCreate = function(){
		 httpService.get('login/getRSAPublicKey').success(function(data){
				$scope.publicKeyExponent = data.publicKeyExponent;
				$scope.publicKeyModulus = data.publicKeyModulus;
				var param = {};
				param['userName'] = $scope.regist.userName;
				param['password'] = encrypt($scope.regist.userPassword);
				httpService.post('login/signup',param).success(function(r){
			      console.log(r);
						if(r.success){
					        Popup.alert("注册成功!",function(){
					            $location.url('login/signin');
					        });

						}else{
			        	Popup.alert(r.message,function(){

				        });
				      }

				});  
			});
		
	}
	
$scope.doChange = function(){
		 httpService.get('login/getRSAPublicKey').success(function(data){
				$scope.publicKeyExponent = data.publicKeyExponent;
				$scope.publicKeyModulus = data.publicKeyModulus;
				var param = {}; 
				param['oldPassword'] = encrypt($scope.regist.oldPassword);
				param['newPassword'] = encrypt($scope.regist.newPassword);
				httpService.post('user/updatePassword',param).success(function(r){
			      console.log(r);
						if(r.success){					        
					       $location.url('login/signin');					         

						}else{
				        	Popup.alert(r.message,function(){

					        });
				      }

				});  
			});
		
	}
	var encrypt = function(pwd){
		RSAUtils.setMaxDigits(200);
		var key = new RSAUtils.getKeyPair($scope.publicKeyExponent,"",$scope.publicKeyModulus);
		var reversedPwd = pwd.split('').reverse().join('');
		var encryptedPwd = RSAUtils.encryptedString(key,reversedPwd);
		return encryptedPwd;
	}
	$scope.doLogin = function(){
		httpService.get('login/getRSAPublicKey')
		.success(function(data){
				$scope.publicKeyExponent = data.publicKeyExponent;
				$scope.publicKeyModulus = data.publicKeyModulus;
				 var flag = $scope.login.rememberMe ?$scope.login.rememberMe:false;
				var param = {userName:$scope.login.userName,rememberMe: flag};
				param.password = encrypt($scope.login.userPassword);
		    	curUserService.doLogin(param);
		});
	 
	}
	$scope.changePassword = function(){

	}
}]);
