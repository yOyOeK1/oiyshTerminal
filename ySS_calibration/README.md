![Welcome in oiyshTerminal - Logo](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/images/otWorld1.png?raw=true)

**yss** Set of helping functions and mechanisms to get web browser page with menu, shaders, colors invert, red-black, rotation, ... Also provide a remote Screens Managment functionality.


# What is in it ?

It give you access to librarys: three.js, jquery, jquery mobile, d3.js, svg.js, websocket, rapheal, ml5, .....

![yss menu open](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/screenShots/ilooNav_withJQMobile.png?raw=true)



# yss panel Prototype
Most basic page is ./s_blankPage.js

```
class s_blankPage{

  get getName(){
    return "blank page";
  }

  getHtml(){
    return 'blank page';
  }

  getHtmlAfterLoad(){
    console.log("s_blankPage getHtmlAfterLoad()");
  }

  get svgDyno(){
    return s_fitscreen;
  }

  svgDynoAfterLoad(){}

  onMessageCallBack( r ){
    console.log("s_blankPage got msg ");
  }

}
```
You need to add your stuff in sections.


# On top off .svg files

examples: ./s_testFunctsPage.js or ./s_basicSailPage.js

![yss basic sail page](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/screenShots/basicSailing_newMenu.png?raw=true)

This is a s_basicSailPage.js as a .svg page example.



# On top off Three.js

examples: ./s_illoNav3D.js or ./s_3dCompass1.js

![yss iloo nav 3d page](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/screenShots/ilooNav3D_ver0.1.png?raw=true)

This is a s_basicSailPage.js as a .svg page example.


Main Atraction is handled by instance in "t4y"

###Function / methodes:

```
t4y.getHtml(); 
```
Return getHtml data needet in getHtml() of your page

```
t4y.getHtmlAfterLoad( ott,  's_ilooNav3D.glb',
  {
    'camPos': [0.028763731041237167, 103.44550962401865, -93.74328394639551],
    'camRot': [-1.909218085730232, -0.0015954765259057495, -0.0],
    'controls': false,
    'lightPos': [0,100,-190],
    'camDeb': false
  });
```
To getHtmlAfterLoad in page building step. To get working 3d model from file, 's_ilooNav3D.glb' - file name to load in page. And set some attributes.

```
t4y.doAni( t4y.otsce.getObjectByName("Empty"), { 
	'rotateY': 10
});
```
Will find object Empty and rotate by Y axis to angle deg 10. Do animation setup.

```
t4y.putText( "heel: 11",{
    name :"HeelText",
    color: 0x000000,
    size: 6,
    replace: "HeelText",
    handle: 'cb',
    x:15,
    y: -5,
    z: -52,
    rx:90,
    extrude: .5
});
```
Replace text in current scean. Will look for HeelText to replace it with this one with name HeelText. handle: [cb|lb|lt].




***
