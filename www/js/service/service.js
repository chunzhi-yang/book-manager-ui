"use strict";app.service("httpService",["$http","Config",function($http,configs){function getUrl(url){return url.startsWith("http")?url:configs.serverUrl+url}return{post:function(url,param,config){return url=getUrl(url),$http.post(url,param),angular.extend({},{headers:{"Content-Type":"application/x-www-form-urlencoded"}},config)},get:function(url,config){return url=getUrl(url),$http.get(url,angular.extend({},{headers:{"Content-Type":"application/x-www-form-urlencoded"}},config))},put:function(url,param){return url=getUrl(url),$http.put(url,param,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})},"delete":function(url){return url=getUrl(url),$http["delete"](url,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})}}}]);