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
}]).service('curUserService',['httpService','Config','$state','Popup',function(httpService,config,$state,Popup){
  var curUser = {};
  var rememberMe = false;
  var isLogined = false;
  var darkTheme = false;
  this.getIsLogined = function(){
    return isLogined;
  }
  this.setDarkTheme = function(t){
    darkTheme = t;
  }
  this.getDarkTheme = function(){
    return darkTheme;
  }
  this.doLogin = function(params){
    var promise =httpService.post( '/login/signin', params);
    promise.then(function (d) {

      if(d.data.success) {
        var curUserReq =httpService.post( 'user/'+params.userName);
        curUserReq.success(function (data) {

          if (data.imgPath != undefined && data.imgPath != '') {
            data.imgPath = config.imgPrefix + data.imgPath;
          }else{
            data.imgPath = 'img/thumbnail-'+data.sex ==0?'male.png':'female.png';
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
      $state.go('login.signin');
    });
  }

  this.test = function(){
    curUser = {usersId: 2, uid: "20170425231430000", userName: "chunzhi123", sex: 0,birth: new Date('1992-12-27 18:00:50')};
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
}]).service('fileTransferHelper',['curUserService',function(curUserService){
  var param={};
  this.setter = function(p){
    param = p;
  }
  this.getter = function(){
    return param;
  }
}]).factory('localStorage',['$window',function($window){
  return{        //存储单个属性
    set :function(key,value){
      $window.localStorage[key]=value;
    },        //读取单个属性
    get:function(key,defaultValue){
      return  $window.localStorage[key] || defaultValue;
    },        //存储对象，以JSON格式存储
    setObject:function(key,value){

      $window.localStorage[key]=JSON.stringify(value);
    },        //读取对象
    getObject: function (key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }

  }
}]);
