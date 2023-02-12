adb shell am broadcast --user 0 -n pl.yoyo.ysensorsservice/.MyBroadcastReceiver -a pl.yoyo.ysensorsservice.intent.DISPLAY_OFF --es socket_output "abc"
