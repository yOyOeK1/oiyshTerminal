import matplotlib.pyplot as plt
import matplotlib.animation as animation
from matplotlib import style
import random
import _thread
import time
from io import BytesIO
from kivy.lang.builder import Builder
from kivy.uix.widget import Widget
from kivy.graphics.texture import Texture
from kivy.uix.image import Image
from kivy.uix.floatlayout import FloatLayout
from kivy.graphics import Color, Rectangle
from kivy.core.image import Image as CoreImage
from kivy.clock import Clock

class myFastPlotWidget(FloatLayout):
    imgTexture = Texture.create(size=(512, 512), colorfmt='RGB',
bufferfmt='ubyte')
    
    def __init__(self, **ka):
        super(myFastPlotWidget,self).__init__(*ka)
        self.pos = [0,0]
        self.size = [512,512]
    
        self.canvas.add(Rectangle(
            texture=self.imgTexture,
            size=(512,512),
            pos=(0,0)
            ))
    
   
class myFastPlot:
    def __init__(self,
        callBacksForData = [], # need to return x,y
        interval = 1000,
        inBuffer = False
        ):
        
        self.cbfd = callBacksForData
        self.interval = interval
        
        if inBuffer:
            self.fig = None
            self.ax1 = None
    
    def initGui(self,gui):
        print("layoutMyFastPlot...")
        Builder.load_file('layoutMyFastPlot.kv')
        
        
    def getWidgetInstance(self):
        self.w = myFastPlotWidget()
        return self.w
    
    def iterOnData(self,i):
        #print("myFastPlot iterOnData",i)
        self.ax1.clear()
        for c in self.cbfd:
            #print("c type ->",type(c))
            self.ax1.plot( *c(), label=str(c.__name__) )
            
        self.ax1.legend()
      
      
    def runBuffMode(self,obj):
        self.objToActOn = obj        
        Clock.schedule_once(self.on_makeBuffIter,self.interval/1000.0)
      
    def on_makeBuffIter(self, a=0):
        self.makeBuffAction(self.objToActOn)
        Clock.schedule_once(self.on_makeBuffIter,self.interval/1000.0)

      
    def makeBuffAction(self,obj):
        obj.clear_widgets()
        buf = self.getBytesBuffer()
        ic = CoreImage(buf, ext="png", filename=("%simage.png"%random.random()))
        img = Image(
            #size_hint = [None,None],
            texture=ic.texture,
            #size = ic.size,
            pos=[0,0],
            keep_ratio = True
            )
        obj.add_widget(img)
    
        
    def getBytesBuffer(self):
        if self.fig == None:
            self.fig = plt.figure()
            self.ax1 = self.fig.add_subplot(1,1,1)
            
        
        self.iterOnData(-1)
        buf = BytesIO()
        plt.savefig(buf, format='png')
        #print("from file 2",buf.__sizeof__(),buf.closed)
        buf.seek(0)
        #plt.savefig('/tmp/figg.png',format='png')
        return buf
        
    def run(self):
        _thread.start_new_thread( self.runIt, () )
        
    
    def runIt(self):    
        self.fig = plt.figure()
        self.ax1 = self.fig.add_subplot(1,1,1)
        self.ani = animation.FuncAnimation(self.fig,self.iterOnData,interval=self.interval)
        plt.show()
    


def anim():
    xs1 = []
    ys1 = []
    for d in range(10):
        xs1.append(d)
        ys1.append(random.randrange(0,10))
        ys1[0] = 0.0
    return xs1,ys1

def anim2():
    xs1 = []
    ys1 = []
    for d in range(10):
        xs1.append(d-20)
        ys1.append(random.randrange(0,10))
        ys1[0] = 0.0
    return xs1,ys1
 
if __name__ == "__main__":
    print("run as test instance")
    g = myFastPlot( [anim,anim2] )
    g.run()
    print("myFastPlot DONE")
    
    while 1:
        time.sleep(1)

 