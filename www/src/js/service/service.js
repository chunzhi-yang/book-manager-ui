'use strict';
app.service('httpService',['$http','Config',function($http,configs){

    function getUrl(url){
        if(url.startsWith('http')){
            return url;
        } else{
            return configs.serverUrl+url;
        }
    }

    return{
        post:function(url,param,config){
            url=getUrl(url);
            return $http.post(url, $.param(param || {}),angular.extend({},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}},config));
        },
        get:function(url,config){
            url=getUrl(url);
            return $http.get(url,angular.extend({},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}},config));
        },
        put:function(url, param){
            url=getUrl(url);
            return $http.put(url, JSON.stringify(param), {headers: {'Content-Type': 'application/json'}});
        },
        'delete':function(url){
            url=getUrl(url);
            return $http['delete'](url, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        },
    }
}]);
app.service('curUserService',['httpService','Config','$state',function(httpService,config,$state){
  var curUser = {};
  var rememberMe = false;
  var isLogined = false;
  this.getIsLogined = function(){
    return isLogined;
  }
  this.doLogin = function(params){
    var promise =httpService.post( '/login/signin', params);
    promise.then(function (d) {
      console.log(d);
      if(d.data == 1) {

        var curUserReq =httpService.post( '/user/'+params.userName);

        curUserReq.then(function (data) {
          console.log(data.data);
          if (data.data.imgPath != undefined && data.data.imgPath != '') {
            data.data.imgPath = config.imgPrefix + data.data.imgPath;

          }else{
            data.data.imgPath = 'img/thumbnail.jpg';
          }

          curUser = data.data;
          isLogined = true;
          rememberMe = params.rememberMe;
          $state.go("app.self.index");
        },function(data){
          console.log("获取用户信息失败"+data);
        });

      }else{

        return false;
      }
    });

  }
  this.doLogout = function(){
    isLogined = false;
    httpService.post('login/logout').success(function(d){
      ionic.Platform.exitApp();
    });
  }

  this.getIsLogined = function(){
    return isLogined;
  }
  this.getCurUser =function (){
    return curUser;
  }
  this.setCurUser =function (user){
    curUser = user;
  }

  this.getRemeberMe = function (){
    return rememberMe;
  }
}]);
