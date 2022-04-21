#
# small helper script to compile it as it is...
#

inc="-I/home/yoyo/src/mosquitto-2.0.13/include "
libsDir="-L/home/yoyo/src/mosquitto-2.0.13/bu/lib "
libs="-lmosquitto "

gcc -o cIMUExtractor main.c `mysql_config --cflags --libs` $inc $libsDir $libs

./cIMUExtractor
