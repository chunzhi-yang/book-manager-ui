'use strict';
//输入校验
app.directive('jxbBindCompiledHtml', function ($compile) {
  'use strict';

  return {
    template: ' <div></div>',
    scope: {
      rawHtml: '=jxbBindCompiledHtml'
    },
    link: function (scope, elem, attrs) {
      scope.$watch('rawHtml', function (value) {

        if (!value) {
          return;
        }

        // we want to use the scope OUTSIDE of this directive
        // (which itself is an isolate scope).
        var newElem = $compile($.parseHTML(value))(scope.$parent);
        elem.contents().remove();
        elem.append(newElem);
      });
    }
  };
});
app.directive('bfAssertEquals',function (){
   return{
       restrict:'A',
       require:'ngModel',
       link:function(scope,element,attrs,ngModel){
           var isSame=function(value){
               var second = scope.$eval(attrs.bfAssertEquals);
               return value == second;
           }
           ngModel.$parsers.push(function(value){
              ngModel.$setValidity('same',isSame(value));
              return isSame(value)?value:undefined;
           });
           scope.$watch(
               function(){
                   return scope.$eval(attrs.bfAssertEquals);
               },function(){

                   ngModel.$setValidity('same',isSame(ngModel.$modelValue));
               }
           );
       }
   }
});
app.directive('uniqueAccount',function(httpService,$q){
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element,attr, ngModel) {
      ngModel.$asyncValidators.uniqueAccount = function (modelValue, viewValue) {
        return httpService.get('/app/checkAccount?account=' + viewValue).then(
          function (response) {
            if (response.data == 3002) {
              return $q.reject(response.data);
            }
            return true;
          }
        );

      }
    }
  }
});

app.directive('onFinishRender',function(){
    return{
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                element.ready(function () {
                    var id = element.id;
                    $('#'+id).remove();
                });
            }
        }
    }
});



app.directive('usernameValidator', ['$log', function($log) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, $element, $attrs, $ngModelCtrl) {
            var verifyRule = [/^\d+$/, /^[a-z]+$/, /^[A-Z]+$/];
            var verify = function(input) {
                return !(verifyRule[0].test(input) ||
                    verifyRule[1].test(input) ||
                    verifyRule[2].test(input));
            };
            $ngModelCtrl.$parsers.push(function(input) {
                var validity = verify(input);
                $ngModelCtrl.$setValidity('defined', validity);

            });
            $ngModelCtrl.$formatters.push(function(input) {
                var validity = verify(input);
                $ngModelCtrl.$setValidity('defined', validity);

            })
        }
    }
}]);
