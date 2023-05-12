
import math
import copy
#from GPoint import *

class SPoint:
    def __init__(self,x=None,y=None,z=None):
        #print("type:[{}]".format(type(x)))
        if type(x) == type(list()):
            self.x = x[0]
            self.y = x[1]
            self.z = x[2]
        else: 
            self.x = x
            self.y = y
            self.z = z

class MyCalculate:
    
    def get3dDistance(self,p0,p1):
        pass
    
    def d3distance(self,v0, v1):  
        x1,y1,z1 = v0
        x2,y2,z2 = v1
        d = math.sqrt(math.pow(x2 - x1, 2) +
                 math.pow(y2 - y1, 2) +
                 math.pow(z2 - z1, 2)* 1.0) 
        print("Distance is ") 
        print(d)
        return d
    
    def getVectorAngles(self, p):
        #print("getVectorAngles p:",p)
        #print("xyz: {},{},{}".format(p.x,p.y,p.z))
        p0 = SPoint([.0,.0,.0])
        py10 = SPoint([.0,10.0,.0])
        
        
        x = self.angle(
            SPoint(p.y,p.z), 
            p0) 
        
        y = self.angle(
            SPoint(p.x,p.z), 
            p0)  
        
        z = self.angle(
            SPoint(p.x,p.y), 
            p0) 
        
        return [x,y,z] 
    
    
    def findIntersection(self, x1, y1, x2, y2, x3, y3, x4, y4 ):
        px= ( (x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4) ) / ( (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4) ) 
        py= ( (x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4) ) / ( (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4) )
        return [px, py]
    
    def distance(self, p0, p1):
        if p0.x and p0.y and p1.x and p1.y:
            return math.sqrt((p1.x - p0.x)**2 + (p1.y - p0.y)**2)
        return None
    
    ''' calculate angle from point 0,1,2=None
     points need to be SPoint
    '''
    def angle( self, p0, p1, p2 = None):
        if p2==None:
            #print("do angle from:",p0.x," x ",p0.y,"    to    ",p1.x," x ",p1.y)
            deltax = p1.x- p0.x
            deltay = p1.y- p0.y
            a = math.atan2(deltay,deltax)
            return math.degrees(a)
            
        else:
            a0 = self.angle(p1, p2)
            a1 = self.angle( p1, p0)
            if a0>=a1:
                a =  a0 - a1
            else:
                a = a1 - a0 
            return a
    
    def newPoint(self, 
        pStart, pEnd, 
        dist, 
        addAngle=0.0,
        returnAngle = False
        ):
        
        
        ang = self.angle(pStart, pEnd)+addAngle
        xn = pStart.x + dist*math.cos( math.radians(ang) )
        yn = pStart.y + dist*math.sin( math.radians(ang))
        
        pc = copy.copy(pEnd)
        pc.x = xn
        pc.y = yn
        
        if returnAngle:
            print("ang",ang)
            return pc,ang
        else:
            return pc
        
    
    
    def scale(self, a, b):
        return a/b
    
    def scaleForOffset(self, xo, yo, scale, step, tpx, tpy ):
        w = tpx
        h = tpy
        
        xoff = ((xo-w)/scale)
        yoff = ((yo-h)/scale)
        
        scale*=step
        
        xo = (xoff * scale)+w
        yo = (yoff * scale)+h
    
        return [scale, xo, yo]
    
    def mRound(self, val, accu):
        return round(val,accu)
    
    
    def remap(self, outMin,outMax, inMin,inMax, val):
        #print("remap",outMin,outMax, inMin,inMax, val)
        o = outMax - outMin
        i = inMax - inMin
        v = val - inMin
        vS = v/i
        
        #print('o',o)
        #print('i',i)
        #print('vS',vS)
        return outMin + (o*vS)
        
    
    
        