![Welcome in oiyshTerminal - Logo](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/images/otWorld1.png?raw=true)

**Important!** Although oiyshTerminal was created for our boat it is not limited to boats alone. Every time the word boat is used feel free to substitute it with home, RV, car, dinghy or whatever else you choose to use it for. Most of the features currently included are boat specific but you are free to modify them to your needs or create your own. With that out of the way...


# What is oiyshTerminal ?

Imagine your boat has an **onboard computer that has access to all the information about the boat you wish it to have and displays it in the way you wish it too**. For a lot of sailors it sounds futuristic and/or expensive, but this is exactly what oiyshTerminal was created for. The software part's free and open-source and the hardware can be created easily and cheaply* or also for free. The basic functionality requires only a smartphone. We provide the base puzzles that you can either use as is or modify to your liking. 

OiyshTerminal is not a black box solution. Depending on which functionalities you choose to implement you will need to put some of the pieces of the puzzle together. This is done on purpose as we believe that everyone with **minimal amount of effort, regardless of the level of technical knowledge they have,** is able to do it. This approach ensures that you have at least basic knowledge of the system you are using. It will give you at minimum the ability to troubleshoot it if needed and perhaps also enough confidence to explore further and expand the system to your specific needs.

If you are not willing to put in the minimal effort this is probably not a project for you and we hope you can afford 'off the shelve solutions' and their installation fees.


# Practical use cases 
_( again some of these are boat specific but the system can be used elsewhere as well )_

* battery monitoring system
* navigation instruments (depth, compass, chart plotter, wind, speed, etc)
* autopilot
* resource management
* notification/alarm system
* engine controls
* and many more

# Puzzles of oiyshTerminal

## Software side
You can find detailed installation information on respective wiki pages ( 'one-click' installation will be added later )
* ySensorsService - gps, pitch, heel, orientation rotation correction app.
* termux - linux shell provider for android.
* termux:api - gate to some device information.
* mqtt - communication layer for IoT devices (mosquitto)
* mysql - data base storage place. Store long term data for graphana or different analysis.
* nodeRed - :) graphical base programming / logic creator / data processing
* graphana - graphical base analysis service
* cMqtt2Mysql - service running in background creating a bridge from mqtt to mysql. Stores traffic from mqtt layer to database.
 
## Hardware 
### Required:
Android phone is your base here (especially if there is no RasberryPi corner in the shop next to you )
Phones are all around us. Easy thing to buy in nearest shop if you don't have an old one laying in the drawer already. 
It has a screen, build in GPS and UPS, WiFi, no cables no connectors no corrosion. (minimum :P) 
For boat specific needs it should be one with magnetometer (compass)

### Optional:
Depending on the functionalities you might need some jellybean parts e.g.
* esp family development board (esp8266, esp32, wemos, nodeMCU etc)
* relays
* cables 
* servos 
* sensors 
* resistors
* etc

Most of them are extremely cheap ( couple of $) or can be salvaged from things you already have. More details in particular use case descriptions.

***

Legend:

[ ] - open

[+] - done

[?] - question

[-] - info

List:
[+] - ySS_calibration for easy orientation calbration of sensors. More to come.


[+] - reorganize topics db structure. now topic will have it's table
	
	[i] - yes for cMqtt2Mysql2
	 
[ ] - cMqtt2Mysql to new topics db structure
	
	[+] - it's now a cMqtt2Mysql2 avery topic is in it's ovne table

[ ] - cMqtt2Mysql should have configuration for ignore topics list
	
	[+] - yes in cMqtt2Mysql2 
	
[ ] - cMqtt2Mysql configuration for insert only changes ?

[ ] - episode installation of termux is a first step 1 to oiyshTerminal

[+] - oiyshTerminal installation from vanilla Wiki

[+] - oiyshTerminal installation node-red, termux-services, nodejs, mosquitto as mqtt broker

check wiki: https://github.com/yOyOeK1/oiyshTerminal/wiki

[ ] - oiyshTerminal topology graph

[ ] - ySensorsService make simple case use example for opencpn

[+] - make first episode

[+] - release ySensorsService
