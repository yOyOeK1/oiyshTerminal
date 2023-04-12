## using sections of
#  https://github.com/Pithikos/python-websocket-server

import time
import _thread
import json
import random
import os
import subprocess

from otdm_serviceIt_prototype import *
from otdmSTS import *

import logging
from websocket_server import WebsocketServer


class otSWebSocketHandlers:
	apis = -1
	otP = -1

	def __init__( self, otP ):
		print("otS WebSocket Handler init ....")
		self.otP = otP


	# Called for every client connecting (after handshake)
	def new_client(self, client, server):
		print("New client connected and was given id %d" % client['id'])
		m="Hey all, a new client (%s) has joined us"%client['id']
		#server.send_message_to_all( m )
		server.send_message( client, m )


	# Called for every client disconnecting
	def client_left(self, client, server):
		print("Client(%d) disconnected" % client['id'])


	# Called when a client sends a message
	def message_received(self, client, server, message):
		if len(message) > 200:
			message = message[:200]+'..'

		print("Client(%d) said: %s" % (client['id'], message))
		#ms = "ok client (%s) pong len (%s)"%(client['id'], len(message))
		#server.send_message( client, ms )
		j=json.loads( message )
		print("J: %s"%j)
		print("sending args [%s] to sts"%j['payload'])
		stsRes = otdmSTS( self.otP.sapis, j['payload'], self.otP.debugConfig )
		print("so sts return:")
		print(stsRes)

		print("is type [%s]"%type(stsRes))


		server.send_message( client, str( json.dumps( {
			"topip": j['topic'],
			'payload': stsRes
		} ) ) )

		'''
		if isinstance( stsRes, tuple ):
			#print("return %s"%stsRes[1])
			client.sendstr( list(stsRes) ) )
		else:
			server.send_message( client, str( json.dumps( stsRes ) ) )
		'''

class otdm_serviceIt_ws( otdm_serviceIt_prototype ):
	count = { "in":0, "out":0, "ok":0, "err":0,"cmdOk":0,"cmdEr":0}
	conf = -1
	name = "ws"
	ver = "0.0.1"
	otSWS = -1
	otWebS = -1
	confWS = { "ip": "192.168.43.220", "port": 9001 }

	def __init__(self, sapis, args, conf, sDebug ):
	    #print(f"${self.name} constructor ....")
	    super( otdm_serviceIt_ws, self ).__init__( sapis, args, conf, sDebug )
	    #print("redirect it ....")

	def setArgsConf(self, args, conf):
	    self.args = args
	    self.conf = conf

	def runIt( self, conf ):
		self.conf = conf
		print(f"otSWS . runIt ....")
		self.otSWS = otSWebSocketHandlers( self )
		self.otWebS = WebsocketServer(port = self.confWS['port'], loglevel=logging.DEBUG)
		self.otWebS.set_fn_new_client( self.otSWS.new_client )
		self.otWebS.set_fn_client_left( self.otSWS.client_left )
		self.otWebS.set_fn_message_received( self.otSWS.message_received )

		_thread.start_new(self.intRunIt,())


	def intRunIt(self, a=0, b=0):
		print("ws run it ...")
		print("otSWS Server started ws://%s:%s" % (self.confWS['ip'], self.confWS['port']))
		self.isOk = True
		self.otWebS.run_forever()
		try:

			print(" .........................")
		except KeyboardInterrupt:
		    pass

		self.isOk = False
		print("otSWS Server stopped.")
