var force = {};

force.wordpress_cron = function() {
  //this function only for force runining wordpress 'crontab' - it work only when somebody visit the page
  var response;
  try {
    response = UrlFetchApp.fetch('http://www.ronaldvanloon.com');
    if (response.getResponseCode() == 200) {
      log('Remote cron activated');
    }
    else {
      log('Response: ' + response.getResponseCode());
    }
  }
  catch(e) {
    Logger.log(e);
  }
}