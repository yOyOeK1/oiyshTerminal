adb shell am broadcast --user 0 -n pl.yoyo.ysensorsservice/.MyBroadcastReceiver -a pl.yoyo.ysensorsservice.intent.STOP_SERVICE --es socket_output "abc"
