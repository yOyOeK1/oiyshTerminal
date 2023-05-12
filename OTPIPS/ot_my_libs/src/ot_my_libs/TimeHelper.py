
from datetime import datetime
import random
import time

class TimeHelper:
	
	def benStart(self):
		try:
			self.benKeys
		except:
			self.benKeys = {}
		key = random.randint(0,999999)*random.randint(0,999999)*random.randint(0,999999)
		self.benKeys[key] = self.getTimestamp(microsec=True)
		return key
		
	def benDone(self,key,desc='',onlyTime=False, printIt = False):
		sec = round((self.getTimestamp(microsec=True)-self.benKeys[key])/1000000.0,6)
		if onlyTime:
			return sec
		if desc == '':
			tr = "%s"%sec
		else:
			tr = "BenDone [%s] Done in [%s] sec"%(desc, sec ) 
		
		if printIt:
			print(tr)
		return tr
	
	def getNiceShortDate(self,timeStamp = None):
		if timeStamp == None:
			timeStamp = self.getTimestamp()
		return datetime.fromtimestamp(float(timeStamp)).strftime("%y%m%d_%H%M%S")
	
	def getDate(self,timeStamp = None, resAsDic = False):
		if timeStamp == None:
			timeStamp = self.getTimestamp()
		
		d = datetime.fromtimestamp(float(timeStamp))
		if resAsDic:
			return {
				'y':int(d.strftime("%y")),
				'm':int(d.strftime("%m")),
				'd':int(d.strftime("%d")),
				'H':int(d.strftime("%H")),
				'M':int(d.strftime("%M")),
				'S':int(d.strftime("%S"))
				}
		else:
			return [ 
				d.strftime("%y"),
				d.strftime("%m"),
				d.strftime("%d"),
				d.strftime("%H"),
				d.strftime("%M"),
				d.strftime("%S")
			]
		
		
	def niceNumbers(self,v):
		if v < 10:
			return "0"+str(v)
		else:
			return str(v)
		
	def getNiceHowMuchTimeItsTaking(self, sec):
		tr = ""
		day = self.niceNumbers( sec // (60*60*24) )
		hh = self.niceNumbers( ( sec // ( 60*60 ) )  % 24 )
		min = self.niceNumbers( (sec // 60) % 60 )
		ss = self.niceNumbers( (sec) % 60 )
		
		return ("%s / %s:%s:%s"%(day,hh,min,ss))
		

	def getTimestampFromStr(self,yyyymmdd_HHMMSS):
		return datetime.strptime(yyyymmdd_HHMMSS, "%Y/%m/%d %H%M%S").strftime('%s')

	

	def getTimestamp(self,microsec=False):
		strf = "%s"
		if microsec:
			strf = "%s%f"
		tr = int(datetime.now().strftime( strf ))
		return tr

	


	def getNiceDateFromTimestamp(self, timeStamp = None, tformat="%Y-%m-%d %T"):
		if timeStamp == None:
			timeStamp = self.getTimestamp()
		return datetime.fromtimestamp(float(timeStamp)).strftime( tformat )

	def getNiceFileNameFromTimestamp(self, timeStamp = None):
		if timeStamp == None:
			timeStamp = self.getTimestamp()
		return datetime.fromtimestamp(float(timeStamp)).strftime("%Y-%m-%d %T").replace("-","_").replace(" ","_").replace(":","_")
