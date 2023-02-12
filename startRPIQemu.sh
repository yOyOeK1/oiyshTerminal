
#qemu-system-aarch64 -machine type=raspi3 -m 1024 -kernel vmlinux -initrd initramfs \
qemu-system-arm -M versatilepb -cpu arm1176 -m 256 \
  -drive "file=/home/yoyo/Downloads/rpi/2022-09-22-raspios-buster-armhf-lite.img" \
  -net "user,hostfwd=tcp::5022-:22" 
