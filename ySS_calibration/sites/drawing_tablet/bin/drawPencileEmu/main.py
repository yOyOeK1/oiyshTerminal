#!/usr/bin/env python3
import sys
import libevdev
import time
import json
import random

import wsHelper


wsHostUrl = "ws://localhost:2999/"


dev = 0
uinputForWs = 0
toSend = []
clickState = False


def on_message(ws, message):
    global toSend
    #print(message)
    if message[0:6]=='{"0":{':
        j = json.loads(message)
        j = j['0']
        j['force'] = int( j['force']*1000.00 )
        j['x'] = int(j['x'])
        j['y'] = int(j['y'])
        toSend.append( j )
        if 0:
            print("Will send: x={}, y={}, press={} (pc={}) e={}".format(
                j['x'],
                j['y'],
                j['force'],
                0,
                j['e']))
        
        


wsHelper.wsStart(on_message, 'draPenEmuPyth',host=wsHostUrl )


def main(args):
    global toSend
    global clickState

    lastForce = 0

    dev = libevdev.Device()
    dev.name = "Tablet alone OOOoooyss"

    dev.enable(libevdev.INPUT_PROP_DIRECT)
    # Say that we are using the pen (not the erasor), and should be set to 1 when we are at proximity to the device.
    # See http://www.infradead.org/~mchehab/kernel_docs_pdf/linux-input.pdf page 9 (=13) and guidelines page 12 (=16), or the https://github.com/linuxwacom/input-wacom/blob/master/4.5/wacom_w8001.c (rdy=proximity)
    dev.enable(libevdev.EV_KEY.BTN_TOOL_PEN)
    dev.enable(libevdev.EV_KEY.BTN_TOOL_RUBBER)
    # Click
    dev.enable(libevdev.EV_KEY.BTN_TOUCH)
    # Press button 1 on pen
    dev.enable(libevdev.EV_KEY.BTN_STYLUS)
    # Press button 2 on pen, see great doc
    dev.enable(libevdev.EV_KEY.BTN_STYLUS2)
    # Send absolute X coordinate
    dev.enable(libevdev.EV_ABS.ABS_X,
               libevdev.InputAbsInfo(minimum=0, maximum=320, resolution=100))
    # Send absolute Y coordinate
    dev.enable(libevdev.EV_ABS.ABS_Y,
               libevdev.InputAbsInfo(minimum=0, maximum=240, resolution=100))
    # Send absolute pressure
    dev.enable(libevdev.EV_ABS.ABS_PRESSURE,
               libevdev.InputAbsInfo(minimum=0, maximum=512))

    dev.enable(libevdev.EV_KEY.BTN_LEFT)
    # Use to confirm that we finished to send the informations
    # (to be sent after every burst of information, otherwise
    # the kernel does not proceed the information)
    dev.enable(libevdev.EV_SYN.SYN_REPORT)
    # Report buffer overflow
    dev.enable(libevdev.EV_SYN.SYN_DROPPED)
    try:
        uinput = dev.create_uinput_device()
        print("New device at {} ({})".format(uinput.devnode, uinput.syspath))
        # Sleep for a bit so udev, libinput, Xorg, Wayland, ...
        # all have had a chance to see the device and initialize
        # it. Otherwise the event will be sent by the kernel but
        # nothing is ready to listen to the device yet. And it
        # will never be detected in the futur ;-)
        time.sleep(1) 
        # Reports that the PEN is close to the surface
        # Important to make sure xinput can detect (and list)
        # the pen. Otherwise, it won't write anything in gimp.
        uinput.send_events([
            libevdev.InputEvent(libevdev.EV_KEY.BTN_TOUCH,
                                value=0),
            libevdev.InputEvent(libevdev.EV_KEY.BTN_TOOL_PEN,
                                value=1),
            libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT,
                                value=0),
        ])
        # Says that the pen it out of range of the tablet. Useful
        # to make sure you can move your mouse, and to avoid
        # strange things during the first draw.
        uinput.send_events([
            libevdev.InputEvent(libevdev.EV_KEY.BTN_TOUCH,
                                value=0),
            libevdev.InputEvent(libevdev.EV_KEY.BTN_TOOL_PEN,
                                value=0),
            libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT,
                                value=0),
        ])


        time.sleep(5)
        print("OK lets go!")
        uinputForWs = uinput

       


       
        edgeIs = 80
        noMoveFor = 0
        lastWas = ''
        while True:
            #print(".")
            if noMoveFor > 0:
                noMoveFor = noMoveFor - 1


            if len( toSend )> 0:
                toSendEvs = []
                j = toSend[0]
                #print("Som to send {0}\n{1}".format(len(toSend),j))
                
                force = int(j['force'])
                forceToSend = 0
                
                    

                if False and j['e'] == 's':
                    print('start')
                    #uinput.send_events([
                        #libevdev.InputEvent(libevdev.EV_KEY.BTN_TOOL_AIRBRUSH, value=1),
                    #    libevdev.InputEvent(libevdev.EV_ABS.ABS_PRESSURE, value=0)
                    #    libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT, value=0),
                    #])    

                noMoveFor = noMoveFor + 5

                if force > edgeIs: 
                    forceToSend = int( (force-edgeIs)*3 )
                
                #if lastForce != forceToSend:
                #print(j['e'], force, forceToSend)
                #   lastForce = forceToSend
                if j['e'] == 'm':
                    uinput.send_events([
                        libevdev.InputEvent(libevdev.EV_ABS.ABS_X,
                                            value=j['x']),
                        libevdev.InputEvent(libevdev.EV_ABS.ABS_Y,
                                            value=j['y']),
                        libevdev.InputEvent(libevdev.EV_ABS.ABS_PRESSURE,
                                            value=int(forceToSend)),
                        #libevdev.InputEvent(libevdev.EV_KEY.BTN_TOUCH,
                        #                    value=1),
                        libevdev.InputEvent(libevdev.EV_KEY.BTN_STYLUS,
                                            value=0),
                        libevdev.InputEvent(libevdev.EV_KEY.BTN_STYLUS2,
                                            value=0),
                        libevdev.InputEvent(libevdev.EV_KEY.BTN_TOOL_PEN,
                                            value=1),
                        libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT,
                                            value=0),
                    ])

                if force > edgeIs and clickState == False:
                    noMoveFor = noMoveFor + 20
                    #print("click")
                    uinput.send_events([
                        # Pen close to device
                        libevdev.InputEvent(libevdev.EV_KEY.BTN_TOOL_PEN,
                                            value=1),
                        libevdev.InputEvent(libevdev.EV_KEY.BTN_TOUCH,
                                            value=1),
                        libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT,
                                            value=0),
                    ])   
                    clickState = True
                #else:





                if j['e'] == 'e':
                    print('end')
                    #print("un click")
                    
                    if lastEWas['e'] == 's':
                        print("click?")
                        uinput.send_events([
                            libevdev.InputEvent(libevdev.EV_KEY.BTN_LEFT, value=1),
                            libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT, value=0),
                        ])
                        time.sleep(0.01)
                        uinput.send_events([
                            libevdev.InputEvent(libevdev.EV_KEY.BTN_LEFT, value=0),
                            #libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT, value=0),
                        ])
                    
                    clickState = False  
                    uinput.send_events([
                        libevdev.InputEvent(libevdev.EV_ABS.ABS_PRESSURE, value=0),
                        libevdev.InputEvent(libevdev.EV_KEY.BTN_TOUCH, value=0),
                        # Pen outside of the position
                        libevdev.InputEvent(libevdev.EV_KEY.BTN_TOOL_PEN, value=0),
                        libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT, value=0),
                    ])


                    
                    #uinput.send_events([
                    #    libevdev.InputEvent(libevdev.EV_KEY.BTN_TOOL_AIRBRUSH, value=0),
                    #    libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT, value=0),
                    #])
                

                toSend.pop(0)
                lastEWas = j

            
            if False and noMoveFor <= 0 and clickState == True:
                print("un click")
                clickState = False
                uinput.send_events([
                    #libevdev.InputEvent(libevdev.EV_KEY.BTN_LEFT, 1),
                    #libevdev.InputEvent(libevdev.EV_KEY.BTN_TOUCH, value=0),
                    # Pen outside of the position
                    #libevdev.InputEvent(libevdev.EV_KEY.BTN_TOOL_PEN, value=0),
                    libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT, value=0),
                ]) 
            

            time.sleep(0.001)
        
        a='''
            if not already_pressed_one:
                print("Press!")
                uinput.send_events([
                    libevdev.InputEvent(libevdev.EV_KEY.BTN_LEFT, 1),
                    libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT, 0),
                ])                
                already_pressed_one = True
            if pc >= 100 or pc <=0 :
                print("Release click.")
                uinput.send_events([
                    libevdev.InputEvent(libevdev.EV_KEY.BTN_LEFT, 0),
                    libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT, 0),
                ])
                if pc >= 100:
                    pc = 100
                    direc = -1
                if pc <= 0:
                    pc = 0
                    direc = +1
                time.sleep(10)
                print("Press!")
                uinput.send_events([
                    libevdev.InputEvent(libevdev.EV_KEY.BTN_LEFT, 1),
                    libevdev.InputEvent(libevdev.EV_SYN.SYN_REPORT, 0),
                ])
                already_pressed_one = True
        '''
        
    except KeyboardInterrupt:
        pass
    except OSError as e:
        print(e)


if __name__ == "__main__":
    if len(sys.argv) > 2:
        print("Usage: {}")
        sys.exit(1)
    main(sys.argv)
