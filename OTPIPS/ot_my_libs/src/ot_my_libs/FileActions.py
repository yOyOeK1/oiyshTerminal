import os,hashlib
import pickle
import sys
import json

class FileActions:
    """
    File Actions and operations helper set
    """
    
    def getHomeDirectoryForApp(self, appName, platform = 'pc'):
        """
        To make home directory for your app fast on pc / python-for-android. It will look and if not exist `make directory` for your app.
        
        # Arguments
          **appName** _string_: name of your app 
          **values** _json_: look format multi ..
        
        # Returns 
          __string__ `path` to your app directory
          **or**
          None on error
        """
        if platform == 'android':
            dList = [
                "/storage/emulated/0",
                "/storage/self/primary",
                "/sdcard",
                "./"
                ]
            
            try:
                print("it's android. Trying plyer")
                from plyer import storagepath
                print(1)
                sp = str(storagepath.get_external_storage_dir())
                print(2)
                print("got:[",sp,']')
                if len(sp)>=1:
                    dList.append(sp)
            except:
                print("EE - no player or different error :/") 
            
                
        else:
            dList = ['~',"./"]
        
        dirIs = ""
        for dir in dList:
            print("chk home dir",dir)
            if self.isDir(dir):
                print("    dir is pressent")
                homePath = self.join(dir,appName)
                if self.isDir(homePath):
                    print('    and there is a home dir',homePath)
                else:
                    dr = self.mkDir(homePath)
                    print("II - making dir result",dr)
                return homePath
        
        print("EE - no correct home directory !!!")
        
        
        return None
        
    
    def pickleMake(self, obj,fileName, makeAsList = True):
        print("myPickle make file",fileName)
        f = open(fileName,'wb')
        if makeAsList:
            pickle.dump( list(obj), f )
        else:
            pickle.dump( obj, f )
         
            
        try:
            f.close()
        except:
            print("EE - error on close() file :(")
        print("    DONE")
        
    def pickleLoad(self, fileName, asList = True):
        print("myPickle load file",fileName)
        tr = pickle.load( open(fileName,'rb') )
        print("    DONE")
        return tr
    
    def loadFile(self, filePath):
        """
        # Arguments
          **filePath** _string_: path to file to load
                  
        # Returns 
          __array__ content of loaded file line by line
          **or**
          None on error
        """        
        try:
            f = open(self.t(filePath))
        except:
            return None
        
        fOrg = []
        line = ""
        
        while True:
            line = f.readline()
            if line:
               fOrg.append( ("%s"%line).replace("\n", "").replace("\r", "") )
            else:
                break
        #print( "loaded lines: %i from file [%s]" % (len(fOrg),filePath) )
        
        return fOrg
    
    def correctDir(self, path):
        print( "correctDir ", )
        b = os.path.basename(path)
        if b == '':
            print( '	trim end' )
            path = path[:-1]
        print( "	result ",path )
        return self.t(path)
    
    def join(self,adr0, adr1):
        """
        path join solvs `/` **or** `\` problem using os library
        
        # Arguments
          **adr0** _string_: more to root path 
          **adr1** _string_: deeper path
        
        # Returns 
          __string__ `path` joind
          **or**
          None on error
        """
        return self.t(os.path.join(adr0,adr1))
        
    def t(self,path):
        """is to convert `~/` to full path
        # Arguments
          **path** _string_: path to make safe
        
        # Returns 
          __string__ `safe` path
        """
        return os.path.expanduser(path)

    def md5str(self,s):
        return hashlib.md5(s).hexdigest()
    
    def md5sumFast(filename, blocksize=65536):
        hash = hashlib.md5()
        with open(filename, "rb") as f:
            for block in iter(lambda: f.read(blocksize), b""):
                hash.update(block)
        return hash.hexdigest()

    def md5file(self,path):
        path = self.t(path)
        return hashlib.md5("\n".join(self.loadFile(path))).hexdigest()

    def cp(self,srcPath,desPath):
        srcPath = self.t(srcPath)
        desPath = self.t(desPath)
        try:
            self.writeFile(desPath, "\n".join(self.loadFile(srcPath)))
            return 1
        except:
            return 0

    def getDirList(self, path):
        path = self.t(path)
        tr = []
        try:
            d = os.listdir(path)
        except:
            print( "Error FileAction.getDirList [%s] error permisions or no directory"%path )
            return []
        for f in d:
            if self.isDir( os.path.join(path,f) ):
                tr.append(f)
        return tr


    def getFileList(self, path, sortByName=False, filter=None):
        path = self.t(path)
        tr = []
        try:
            d = os.listdir(path)
        except:
            print( "Error FileAction.getDirList [%s] error permisions or no directory"%path )
            return []
        
        for f in d:
            #print("found",f)
            if self.isFile(os.path.join(path,f)):
                #print " file"
                if filter:
                    addIt = False
                    try:
                        abccc = f.index(filter)
                        addIt = True
                    except:
                        pass
                    if addIt:
                        tr.append(f)
                        
                else:
                    tr.append(f)
                
        
        if sortByName:
            tr = sorted(tr)
                
        return tr
        
        
    
    def getListRecursive(self,path, tr = [], files = False, dirs = False):
        path = self.t(path)
        try:
            ol = os.listdir(path)
            for i in ol:
                if self.isDir( self.join( path, i ) ):
                    print( "		in req isDir ",i )
                    if dirs:
                        tr.append(self.join(path,i))
                        print( "				adding" )
                    tr = self.getListRecursive( self.join( path, i ), tr, files, dirs )
                else:
                    if files:
                        tr.append( self.join(path, i) ) 
                
        except:
            print( "error in path ",path )
    
        return tr

    def writeFile(self, path, str):
        f = open(self.t(path),"w")
        f.write(str)
        f.close()

    def mkDir(self, path):
        path = self.t(path)
        try:
            print("mkdir",path)
            os.mkdir(path)
            return True
        except:
            print("FileActions.py - can't creat a directory ",path)
            return False

    def rm(self,filePath):
        os.remove(filePath)

    def mv(self,file,newFile):
        file = self.t(file)
        newFile = self.t(newFile)
        os.rename(file, newFile)

    def ln(self, file, newFile):
        os.symlink(file, newFile)

    def cpB(self, srcFile, desFile):
        srcFile = self.t(srcFile)
        desFile = self.t(desFile)
        fs = open(srcFile,"r")
        fd = open(desFile,"w")
        fd.write( fs.read() )
        fd.close()
        fs.close()


	  
    def getSize(self,path):
        return os.path.getsize(self.t(path))
        
    def getSizeNice(self,path):
        s = self.getSize(path)
        if s>1024000:
            return "%s MB" % round( (s/1024.0/1024.0), 2 )
        elif s>1024:
            return "%s KB" % (s/1024)
        else:
            return "%s bytes" % s
    
    def isFile(self, path):
        return os.path.isfile(self.t(path))

    def isDir(self, path):
        return os.path.isdir(self.t(path))

    
