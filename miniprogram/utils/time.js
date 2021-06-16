/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()

  var d = new Date()
  var weekday = new Array(7)
  weekday[0] = "星期日"
  weekday[1] = "星期一"
  weekday[2] = "星期二"
  weekday[3] = "星期三"
  weekday[4] = "星期四"
  weekday[5] = "星期五"
  weekday[6] = "星期六"

  return year + "年" + month + "月" + day + "日" + "  " + weekday[d.getDay()] + '  ' + hour + "点"
}
function formatTime_fanxiexian(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()


  var d = new Date()
  var weekday = new Array(7)
  weekday[0] = "星期日"
  weekday[1] = "星期一"
  weekday[2] = "星期二"
  weekday[3] = "星期三"
  weekday[4] = "星期四"
  weekday[5] = "星期五"
  weekday[6] = "星期六"

  return year + "/" + month + "/" + day 
}
function formatTime_month(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()

  var d = new Date()
  var weekday = new Array(7)
  weekday[0] = "星期日"
  weekday[1] = "星期一"
  weekday[2] = "星期二"
  weekday[3] = "星期三"
  weekday[4] = "星期四"
  weekday[5] = "星期五"
  weekday[6] = "星期六"

  return month + "月" + day + "日" + "  " + weekday[d.getDay()] + '  ' + hour + "点"
}

function formatTime_year_month_day(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()

  var d = new Date()
  var weekday = new Array(7)
  weekday[0] = "星期日"
  weekday[1] = "星期一"
  weekday[2] = "星期二"
  weekday[3] = "星期三"
  weekday[4] = "星期四"
  weekday[5] = "星期五"
  weekday[6] = "星期六"

  return year + "-" + month + "-" + day 
}
function get_week_day(date) {
  var d = new Date()
  var weekday = new Array(7)
  weekday[0] = "日"
  weekday[1] = "一"
  weekday[2] = "二"
  weekday[3] = "三"
  weekday[4] = "四"
  weekday[5] = "五"
  weekday[6] = "六"

  return weekday[d.getDay()]
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function CompareDate(t1, t2) {
  var date = new Date();
  var t1Arr = t1.split(':');
  var t2Arr = t2.split(':');
  if (t1Arr[0] - t2Arr[0] < 0) {
    return true;
  } else if (t1Arr[0] == t2Arr[0]) {
    if (t1Arr[1] - t2Arr[1] < 0)
    return true;
  } else {
    return false;
  }
}

function  get_date_diff(startDay,endDay){
  return DateDiff(startDay, endDay)
}

//计算天数差的函数，通用 
function DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2002-12-18格式 
var aDate, oDate1, oDate2, iDays
aDate = sDate1.split("-")
oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式 
aDate = sDate2.split("-")
oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数 
return parseInt(iDays/7)
}
function DateDiff_days(sDate1, sDate2) {    //sDate1和sDate2是2002-12-18格式 
  var aDate, oDate1, oDate2, iDays
  aDate = sDate1.split("-")
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式 
  aDate = sDate2.split("-")
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数 
  return iDays
  }

module.exports = {
  formatTime: formatTime,
  CompareDate: CompareDate,
  formatTime_month: formatTime_month,
  get_date_diff:get_date_diff,
  get_week_day:get_week_day,
  formatTime_year_month_day:formatTime_year_month_day,
  formatTime_fanxiexian:formatTime_fanxiexian,
  DateDiff_days:DateDiff_days
}