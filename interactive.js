function onOpen() {
  form_initial_menu();
}

function rem_triggers() {
  var message;
  remove_triggers();
  message = 'All triggers under ' + Session.getEffectiveUser() + 'have been removed';
  SpreadsheetApp.getActive().toast(message, 'Triggers removal', 3);
  log(message);
}


function form_initial_menu() {
  var submenu = [{name:"Authorize & install", functionName:"auth_install"}];
  SpreadsheetApp.getActiveSpreadsheet().addMenu('Sheet Actions', submenu);  
}

function auth_install() {
  var user;
  auth();
  form_menu();
  user = Session.getActiveUser();
  install_triggers(user);
}

function auth() {
  //ScriptApp.invalidateAuth();

}


function show_alert(user) {
  Browser.msgBox('All triggers have been installed under ' + user + ' account');
}

function on_open() {
  form_menu();
}

function form_menu() {
  var submenu = 
  [{name:"Manual pull", functionName:"pull_new_data"}, 
   {name:'Reinstall triggers', functionName:'reinstall_triggers'}, 
   {name:'Remove triggers', functionName:'rem_triggers'}

  ];
  //   
  SpreadsheetApp.getActiveSpreadsheet().updateMenu('Sheet Actions', submenu);  
}



function install_triggers(user) {
 var ss, triggers;
 ss = SpreadsheetApp.getActive();
 triggers =  ScriptApp.getProjectTriggers();
 if (! trigger_installed(ON_OPEN, triggers)) {
   ScriptApp.newTrigger(ON_OPEN).forSpreadsheet(ss).onOpen().create();
 }
 if (! trigger_installed(TIME_DEAMON1, triggers)) {ScriptApp.newTrigger(TIME_DEAMON1).timeBased().everyDays(1).atHour(HOUR1).create();}
 if (! trigger_installed(TIME_DEAMON2, triggers)) {ScriptApp.newTrigger(TIME_DEAMON2).timeBased().everyDays(1).atHour(HOUR2).create();}
 //if (! trigger_installed(MINUTE_DAEMON, triggers)) {ScriptApp.newTrigger(MINUTE_DAEMON).timeBased().everyMinutes(1).create();}
 SpreadsheetApp.getActive().toast('All triggers have been installed under' + Session.getEffectiveUser(), 'Triggers installation', 3);
 log('All triggers have been installed under ' + Session.getActiveUser() + ' account');
}