'use strict';
app.service('httpService',['$http','Config',function($http,configs){

    function getUrl(url){
        return configs.serverUrl+url;
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
}]).service('curUserService',['httpService','Config','$rootScope','$state','Popup',function(httpService,config,$rootScope,$state,Popup){

  this.doLogin = function(params){
    var promise =httpService.post( '/login/signin', params);
    promise.then(function (d) {

      if(d.data.success) {
        var curUserReq =httpService.post( 'user/'+params.userName);
        curUserReq.success(function (data) {

          if (!data.imgPath ){
            data.imgPath = data.sex ==0?'img/thumbnail-male.png':'img/thumbnail-female.png';
          }
          $rootScope.curUser = data;
          $rootScope.isLogined = true;
          $rootScope.rememberMe = params.rememberMe;
          $state.go("app.self.index");
        });

      }else{
        Popup.alert(d.data.message,function(){
        });
      }
    });
  }
  this.doLogout = function(){
    $rootScope.isLogined = false;
    $rootScope.curUser = {};
    httpService.post('login/logout').success(function(d){
      $state.go('login.signin');
    });
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
