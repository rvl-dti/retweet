var pull = {};

pull.new_data = function(){
  force.wordpress_cron();
  update.raw_summary();
  update.filtered();
  supplement.summary(get.filtered());
}

pull_new_data = pull.new_data;//plain name for calling from menu