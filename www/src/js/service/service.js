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
            return $http.post(url, param), angular.extend({},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}},config);
        },
        get:function(url,config){
            url=getUrl(url);
            return $http.get(url,angular.extend({},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}},config));
        },
        put:function(url, param){
            url=getUrl(url);
            return $http.put(url, param, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        },
        'delete':function(url){
            url=getUrl(url);
            return $http['delete'](url, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        },
    }
}]);