
##
# To start in shareitso directory.
# Will start http server enable POST so can revceive files
# push notification about start to mqtt
# do directorys with datas

import http.server, http, cgi, pathlib, sys, argparse, ssl, os, builtins
import tempfile, base64, binascii
import importlib.util
import socket

from datetime import datetime
if sys.version_info.major > 3 or sys.version_info.minor >= 7:
    import functools

if sys.version_info.major > 3 or sys.version_info.minor >= 8:
    import contextlib

## check /usr/local/lib/python3.8/dist-packages/uploadserver
import uploadserver
import sys
import os
import time




## -------- set home --
#
shareitsoDir="/data/data/com.termux/files/home/.otdm/yss-shareitso"
pathTo_otdmWcspMqtt="/data/data/com.termux/files/usr/bin/otdmWcspMqtt.py"

mqttClientName='MyUploadserver'
mqttHost='192.168.43.1'
mqttPort=10883



# updateserver module to use
us = -1
cMqtt = -1


## importing external mqtt client ....
#
spec = importlib.util.spec_from_file_location( "otdmWcspMqtt", pathTo_otdmWcspMqtt )
cMqttI = importlib.util.module_from_spec(spec)
sys.modules["otdmWcspMqtt"] = cMqttI
spec.loader.exec_module(cMqttI)
#cMqttSpec.MyClass()
#print( cMqttI )



##pip3 show uploadserver
'''
Name: uploadserver
Version: 4.1.2
Summary: Python's http.server extended to include a file upload page
Home-page: https://github.com/Densaugeo/uploadserver
Author: Densaugeo
Author-email: author@example.com
License: None
Location: /usr/local/lib/python3.8/dist-packages
Requires:
Required-by:
'''
def new_send_upload_page( header ):
    print("My send upload header work !!!!")

class MySimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        global us
        print("MySimpleHTTPRequestHandler GET ....")
        if not us.check_http_authentication(self): return

        if self.path == '/upload':
            us.send_upload_page(self)
        else:
            super().do_GET()

    def do_POST(self):
        global us
        print("MySimpleHTTPRequestHandler POST ...")
        if not us.check_http_authentication(self): return

        if self.path in ['/upload', '/upload/validateToken']:
            if self.path == '/upload/validateToken':
                result = us.validate_token(self)
            elif self.path == '/upload':
                result = us.receive_upload(self)

            print("MySimple got result: ")
            print( result )

            if result == -123456: # force stop!
                print(" DONE Send Finito")
            elif result[0] < http.HTTPStatus.BAD_REQUEST:
                self.send_response(result[0], result[1])
                self.end_headers()
            else:
                self.send_error(result[0], result[1])
        else:
            self.send_error(http.HTTPStatus.NOT_FOUND, 'Can only POST to /upload')





def new_receive_upload(handler):
    global us
    global cMqtt
    print("UP UP new_receive_upload ..")

    result = (http.HTTPStatus.INTERNAL_SERVER_ERROR, 'Server error')
    name_conflict = False

    #print("---------------------")
    #print("handler")
    #print(handler)
    #print("handler.headers")
    #print(handler.headers)

    form = us.PersistentFieldStorage(fp=handler.rfile, headers=handler.headers, environ={'REQUEST_METHOD': 'POST'})

    isMsg = False
    msgFormItem = -1
    class fileContener:
        def __init__(self, file_):
            self.t = file_
        def read(self):
            return bytes( self.t, 'utf-8' )
    class mmsg:
        def __init__(self, file_, filename_):
            self.file = fileContener(file_)#bytes( file_, 'utf-8' )
            self.filename = filename_


    msgToStore=""
    if 'msg' in form and form['msg'].value != "":
        print(f"BUM !! msg in form [{form['msg'].value}]")
        isMsg = True
        msgFormItem = mmsg(form['msg'].value,'msg.txt')

    if isMsg == False and 'files' not in form:
        return (http.HTTPStatus.BAD_REQUEST, 'Field "files" not found')


    isMulti=False
    fields = form['files']
    if not isinstance(fields, list):
        fields = [fields]
    else:
        isMulti=True

    if isMsg:
        fields.append( msgFormItem )



    if isMsg == False and not all(field.file and field.filename for field in fields):
        return (http.HTTPStatus.BAD_REQUEST, 'No files selected')


    fNoTotal = len(fields)

    print(f" fields len {len(fields)}")
    for fNo,field in enumerate(fields):
        fieldS=(f"{field}")[:70]
        print(f" doing field NO {fNo} --> {fieldS}...")


        if field.file and field.filename:
            filename = pathlib.Path(field.filename).name
        else:
            filename = None

        if us.args.token:
            # server started with token.
            if 'token' not in form or form['token'].value != us.args.token:
                # no token or token error
                handler.log_message('Upload of "{}" rejected (bad token)'.format(filename))
                result = (http.HTTPStatus.FORBIDDEN, 'Token is enabled on this server, and your token is missing or wrong')
                continue # continue so if a multiple file upload is rejected, each file will be logged

        if filename:
            destination = pathlib.Path(us.args.directory) / filename
            if os.path.exists(destination):
                if us.args.allow_replace and os.path.isfile(destination):
                    os.remove(destination)
                else:
                    destination = us.auto_rename(destination)
                    name_conflict = True
            if hasattr(field.file, 'name'):
                source = field.file.name
                field.file.close()
                os.rename(source, destination)
            else:  # class '_io.BytesIO', small file (< 1000B, in cgi.py), in-memory buffer.
                with open(destination, 'wb') as f:
                    f.write(field.file.read())
            handler.log_message(f'[Uploaded] "{filename}" --> {destination}')

            ## last file on the list
            if (fNoTotal-1) == fNo:
                print(f"## this one is what? {isMulti}")
                result = (http.HTTPStatus.OK, 'Some filename(s) changed due to name conflict' if name_conflict else 'Files accepted')

                cMqtt.pub("notification",'''{
                    "status": "low",
                    "payload": "SIS new file ..."
                }''')

                bodyToRet = bytes('''<html><body>shareitsonized OK!</body></html>''', 'utf-8')
                handler.send_response(http.HTTPStatus.OK)
                handler.send_header('Content-Type', 'text/html; charset=utf-8')
                handler.send_header('Content-Length', len(bodyToRet))
                handler.end_headers()
                handler.wfile.write( bodyToRet )
                return -123456 # force stop!
            else:
                result = (http.HTTPStatus.NO_CONTENT, 'Some filename(s) changed due to name conflict' if name_conflict else 'Files accepted')
            #handler.end_headers()
            #handler.wfile.write("Ferfecto!")
            #return True

    return result


if __name__ == "__main__":
    print("-- oiyshTerminal - shareitso - my upload server over http POST --")


    print("Initing mqtt client .....")
    cMqtt = cMqttI.otdmWcspMqtt()
    ## TODO -- host and port from config file
    cMqtt.makeCli( mqttClientName, { 'host':mqttHost, 'port':mqttPort } )
    cMqtt.runIt()
    time.sleep(.5)
    print(" publicating ... start notification")
    cMqtt.pub("notification",'''{
        "status": "low",
        "payload": "SIS upload server starnig ...."
    }''')
    time.sleep(1)

    #print(" importing otdmWcspMqtt.py ..... EXIT 7")
    #sys.exit( 7 )







    dirDate=("DIR____%s"%datetime.today().strftime('%y_%m_%d'))

    print(f"Run as main .... dirertory date: {dirDate}")

    pwd = os.getcwd()
    if pwd == shareitsoDir:
        print("pwd is OK!")
    else:
        print(f"Error start app from shareitsoDir: {shareitsoDir}   EXIT 3")
        sys.exit(3)

    if os.path.isdir( pwd ) == True:
        print("./dir is OK")
    else:
        print(f"Error ./Files directory not exists :/ shareitsoDir: {shareitsoDir}   EXIT 4")
        sys.exit(4)

    targetDir=f"{pwd}/Files/{dirDate}"
    print(f"Target directory .... [{targetDir}] ... ",end="")
    if os.path.isdir( targetDir ) == False:
        print("Not there")
        print(" making it")
        os.mkdir( targetDir )
    else:
        print("OK")


    print("Change directory to target ...")
    os.chdir( targetDir )
    print(os.getcwd())


    #print("-- EXIT 2")
    #sys.exit( 1 )

    us = sys.modules["uploadserver"]
    us.receive_upload = new_receive_upload
    us.SimpleHTTPRequestHandler = MySimpleHTTPRequestHandler
    us.main()

    print ("See you! buyy")
