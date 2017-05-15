app.controller('bookstoreDetailCtrl',['$scope','httpService','$location','$stateParams','Popup',
  'Config','ngDialog','curUserService','$cordovaSocialSharing',
  function($scope,httpService,$location,$stateParams,Popup,config,ngDialog,
           curUserService,$cordovaSocialSharing){
    httpService.post('books/'+$stateParams.id)
      .success(function(d){

          d.imgPath = config.imgPrefix + d.imgPath;
          $scope.book = d;
          loadChapters();
      });
    var user = curUserService.getCurUser();
    $scope.usingAccount = user.userName;
    $scope.usingAvatar = config.imgPrefix + user.imgPath;
    $scope.usingUid = user.uid;

    var loadAccount = function(){
      httpService.post('userAccount/'+user.uid).success(function(d){
        $scope.account = d;
        $scope.remain = d.remain;
      });
    }
    loadAccount();

    $scope.showChapters = function(){
      var dlg = ngDialog.open({
        template: 'chapterPage.html',
        className: 'ngdialog-theme-default',
        height: 400,
        scope: $scope
      });
    }
      $scope.addOrder = function() {
      var dlg = ngDialog.open({
        template: 'order.html',
        className: 'ngdialog-theme-default',
        height: 400,
        scope:$scope,
        controller: function() {

          $scope.changeAmount = 1;
          $scope.changeAmount = function(d){
            $scope.amount = d;
          }
          $scope.doSubmit = function () {
            var remain = $scope.remain - $scope.book.cost*$scope.amount;

            if(remain <0){
              Popup('账户余额不足，请充值!',function(){
                $location.url('login/self/account');
              },function(){

              });
              return;
            }
            var param = {bmUserAccountId:$scope.account.bmUserAccountId,remain:remain};
            httpService.put('userAccount/update', param).success(function (d) {
              dlg.close(d);
            });
          }

        }
      });
      dlg.closePromise.then(function(r){
        if(r.value > 0){

          Popup.alert("购买成功!",function(){
          });
        }
      });
    }

  var loadChapters = function(){
    $scope.loading = true;
    httpService.post('app/bookWithChapters',{fileName:$scope.book.filePath}).success(function(d){
      $scope.chapterLength = d.length;
      $scope.chapterList = d;
      angular.forEach($scope.chapterList,function(eve){
        eve.chapterName = eve.chapterName.trim();
      });
    });
  }
  $scope.share = function(){
    var message = $scope.book.bookName,
      subject = "ionicBookReader",
      file = config.filePrefix + $scope.book.booksId,
      link = config.filePrefix + $scope.book.booksId;
    $cordovaSocialSharing
      .share(message, subject, file, link) // Share via native share sheet
      .then(function(result) {
        console.log(result);
      }, function(err) {
        // An error occured. Show a message to the user
      });
    $cordovaSocialSharing
      .shareViaTwitter(message, image, link)
      .then(function(result) {
        Popup.alert('分享成功');
      }, function(err) {
        // An error occurred. Show a message to the user
      });

    $cordovaSocialSharing
      .shareViaWhatsApp(message, image, link)
      .then(function(result) {
        Popup.alert('分享成功');
      }, function(err) {
        // An error occurred. Show a message to the user
      });

    $cordovaSocialSharing
      .shareViaFacebook(message, image, link)
      .then(function(result) {
        Popup.alert('分享成功');
      }, function(err) {
        // An error occurred. Show a message to the user
      });

    // access multiple numbers in a string like: '0612345678,0687654321'
    $cordovaSocialSharing
      .shareViaSMS(message, number)
      .then(function(result) {
        Popup.alert('分享成功');
      }, function(err) {
        // An error occurred. Show a message to the user
      });

// toArr, ccArr and bccArr must be an array, file can be either null, string or array
    $cordovaSocialSharing
      .shareViaEmail(message, subject, toArr, ccArr, bccArr, file)
      .then(function(result) {
        Popup.alert('分享成功');
      }, function(err) {
        // An error occurred. Show a message to the user
      });

    $cordovaSocialSharing
      .canShareVia(socialType, message, image, link)
      .then(function(result) {
        Popup.alert('分享成功');
      }, function(err) {
        // An error occurred. Show a message to the user
      });

    $cordovaSocialSharing
      .canShareViaEmail()
      .then(function(result) {
        Popup.alert('分享成功');
      }, function(err) {
        // Nope
      });
  }
}]);
