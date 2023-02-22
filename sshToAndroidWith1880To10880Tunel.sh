
# /emulator -avd '5.1_WVGA_API_26' -writable-system
# in termux to make tunel
# ssh -R 10880:127.0.0.1:1880 192.168.43.1 -p 2222
# or to me on dell
# ssh -R 10880:0.0.0.0:1880 yoyo@192.168.43.220 -p 2222


ssh -L 10880:localhost:1880 localhost -p 20222
