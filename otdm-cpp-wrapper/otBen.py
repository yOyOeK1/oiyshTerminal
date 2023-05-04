from datetime import datetime
import random
import time

class otBen:

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

    def getTimestamp(self,microsec=False):
        strf = "%s"
        if microsec:
        	strf = "%s%f"
        tr = int(datetime.now().strftime( strf ))
        return tr
