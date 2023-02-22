
# TODO
# nrf-notification expecting it to be in
# /data/data/com.termux/files/usr/bin/otdmTtsSolver.sh
# link ??

ttsMsg="$*"

echo '{"exitCode": "'$(
  termux-tts-speak "$ttsMsg" && echo '0", "msg":"termux-api handle it"}' || \
  espeak "$ttsMsg" && echo '0", "msg":"espeak handle it"}' || \
  echo '1","msg":"no tts found"}'
)

# {"exitCode": "0", "msg":"espeak handle it"}
# if exitCode=1 - error with processing args to tts engine
