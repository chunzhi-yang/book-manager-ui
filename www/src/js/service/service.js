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
            return $http.post(url, JSON.stringify(param), {headers: {'Content-Type': 'application/json'}});
        },
        'delete':function(url){
            url=getUrl(url);
            return $http['delete'](url, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        },
    }
}]);
app.service('curUserService',['httpService','Config','$state','Popup',function(httpService,config,$state,Popup){
  var curUser = {};
  var rememberMe = false;
  var isLogined = false;
  this.getIsLogined = function(){
    return isLogined;
  }
  this.doLogin = function(params){
    var promise =httpService.post( '/login/signin', params);
    promise.then(function (d) {

      if(d.data.success) {
        var curUserReq =httpService.post( 'user/'+params.userName);
        curUserReq.success(function (data) {
          console.log(data);
          if (data.imgPath != undefined && data.imgPath != '') {
            data.imgPath = config.imgPrefix + data.imgPath;
          }else{
            data.imgPath = 'img/thumbnail.jpg';
          }
          curUser = data;
          isLogined = true;
          rememberMe = params.rememberMe;
          $state.go("app.self.index");
        });

      }else{
        Popup.alert(d.data.message,function(){

        });

      }
    });

  }
  this.doLogout = function(){
    isLogined = false;
    httpService.post('login/logout').success(function(d){
      ionic.Platform.exitApp();
    });
  }

  this.test = function(){
    curUser = {usersId: 2, uid: "20170425231430000", userName: "chunzhi123", sex: 0,birth: new Date('1992-12-27 18:00:50')};
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
