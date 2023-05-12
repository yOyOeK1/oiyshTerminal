import xml.etree.cElementTree as ET
import sys
"""
class NOPoint:
	lat = 0.000
	lon = 0.000
	
class NOWPT:
	tagName = "wpt"
	point = None
	time = 0
	name = ""
	md5 = ""
	xml = None
	
class NORTEPT(NOWPT):
	tagName = "rtept"
	

class NORTE:
	tagName = "rte"
	name = ""
	md5 = ""
	xml = None
	rtepts = []
	
class NOTRK:
	tagName = "trk"
	name = ""
	md5 = ""
	xml = None
"""
class XMLHelper:
	textBufSize = 1024
	nsBlank = 'b'
	fileParsed = ""
	nsLocal = None
	
	def gb(self,tag):
		return "%s:%s"%(self.nsBlank, tag)

	def tostring(self, element):
		return ET.tostring(element)

	def parse(self,file):
		try:
			self.fileParsed = file
			self.root = ET.parse(file).getroot()
			self.nsLocal = self.namespaceExtract(open(file).read(self.textBufSize))
			return True
		except:
			print( "XMLHelper file error [%s] not correct!"%file)
			return False
	
	def namespaceExtract(self,text):
		deb = False
		text = text[:self.textBufSize]		
		nsTr = {}		
		if deb:print( "text[%s]"%text)
		for s in text.split("xmlns"):
			if s[0] in [':', '=']:
				if deb:print( "found ns ?")
				if deb:print( "to chk [%s]"%s)
				fRowna = s.find('=')
				fQStart = s.find('"')+1
				fQEnd = fQStart + s[fQStart:].find('"')
				if deb:print( "={} s{} e{}".format(fRowna, fQStart, fQEnd))
				if fRowna < fQStart < fQEnd:
					dd = s.find(':')
					ns = self.nsBlank
					if dd > -1 and dd < fQStart:
						ns = s[dd+1:fQStart-2]
					
					nsUrl = s[fQStart:fQEnd]
					if deb:print( "ns [%s]"%ns)
					if deb:print( "nsUrl [%s]"%nsUrl)
					nsTr[ns] = nsUrl
				
			if deb:print( "-------------------")
		return nsTr
	
	
	def correctDumpXmlFromElement(self,element):
		return self.correctDumpXml( 
			self.tostring(element) 
			)			
	
	def correctDumpXml(self, text):		
		deb = False
		if self.nsLocal == None:
			print( "error no file parsed by object !")
			print( "you need to parse file first to get namespace frome file")
			return None
		dicForReplace = {}
		nsLocal = self.namespaceExtract(text)
		if deb:
			print ("nsFound: %s"%nsLocal)
			print ("in --------------------------")
			print (text)
			print ("-----------------------------")
		for n,u in nsLocal.items():
			key = ' xmlns:{}="{}"'.format(n,u)
			dicForReplace[key] = ''
			
			for ns, url in self.nsLocal.items():
				if url == u:
					if ns == self.nsBlank:
						ns = ''
						n = "%s:"%n
					dicForReplace["<%s"%n] = "<%s"%ns
					dicForReplace["</%s"%n] = "</%s"%ns
					break
				
		if deb:print( "dicForReplace %s"%dicForReplace)
		for f,t in dicForReplace.items():
			if deb:print ("replace from [{}] -> [{}]".format(f,t))
			text = text.replace(f,t)
				
		if deb:
			print( "out ----------------------------")
			print( text)
			print( "out ----------------------------")
		
		return text
		
if __name__ == "__main__":
	print( "----------------------------------\n"*3)
	print( "runing test of xmlhelper ....")
	
	print( "testing namespace extraction from file.....")
	nsE = XMLHelper()
	print( nsE.namespaceExtract( open("/tmp/n.xml").read(1024) ))
	print( "DONE")
	
	print( "----------------------------------\n"*3)
	print( "testing correcting name space from xml.etree.eElementTree.dump.....")
	file = "/tmp/n.xml"
	corSampel = '''
	<ns0:wpt xmlns:ns0="http://www.topografix.com/GPX/1/1" xmlns:ns1="http://www.opencpn.org" lat="15.861516667" lon="-83.891600000">
    <ns0:time>2015-08-11T14:16:16Z</ns0:time>
    <ns0:name>LARRYS ROUTE 1</ns0:name>
    <ns0:sym>triangle</ns0:sym>
    <ns0:type>WPT</ns0:type>
    <ns0:extensions>
      <ns1:guid>22cf0000-8ce9-43c4-a6c0-a1b35a0dffff</ns1:guid>
      <ns1:viz_name>1</ns1:viz_name>
      <ns1:arrival_radius>0.050</ns1:arrival_radius>
      <ns1:waypoint_range_rings colour="#000000" number="-1" step="-1" units="-1" visible="false" />
      <ns1:scale_min_max ScaleMax="0" ScaleMin="2147483646" UseScale="false" />
    </ns0:extensions>
  </ns0:wpt>
'''
	corE = XMLHelper()
	corE.parse(file)
	print( "sample in --------------------")
	print( corSampel)
	print( "sample in END ----------------")
	print( "result -----------------------")
	print( corE.correctDumpXml(corSampel))
	print( "result END -------------------")
	print( "DONE")
	print( "----------------------------------\n"*3)
	
	print( "tests DONE ")