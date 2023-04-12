from datetime import datetime

def tn_nice():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def tn_unix():
    return datetime.now().strftime('%s')

def tn_unixNs():
    return datetime.now().strftime('%s%N')
