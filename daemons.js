function time_deamon2() {
  time_deamon();
}

function time_deamon1() {
  time_deamon();
}

function time_deamon() {
  log('time deamon under ' + Session.getEffectiveUser());
  pull.new_data();
}