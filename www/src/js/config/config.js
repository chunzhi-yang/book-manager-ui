app.constant('Config',{
	serverUrl:'http://192.168.191.3:8080/book-manager-api/',
    imgPrefix:'http://192.168.191.3:8080/book-manager-api/app/downloadAvatar?url=',
    filePrefix:'http://192.168.191.3:8080/book-manager-api/app/downloadFile?id='
});
app.config(function (ionicDatePickerProvider) {
  var datePickerObj = {
    inputDate: new Date(),
    setLabel: '确定',
    todayLabel: '今天',
    closeLabel: '取消',
    mondayFirst: false,
    weeksList: ["日", "一", "二", "三", "四", "五", "六"],
    monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    templateType: 'popup',
    dateFormat: 'yyyy-MM-dd',
    from: new Date(1970, 1, 1),
    to: new Date(),
    showTodayButton: true,
    dateFormat: 'yyyy-MM-dd',
    closeOnSelect: false,
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);
})
