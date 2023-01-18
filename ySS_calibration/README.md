**yss** Is a set of helping functions and mechanisms to get a web browser page with menu, shaders, colors invert, red-black, rotation, ... It also provides a remote Screens Managment functionality (in action: https://www.youtube.com/watch?v=fz_WaZtpGYo).

# What is in it ?

It gives you access to librarys: three.js, jquery, jquery mobile, d3.js, svg.js, websocket, rapheal, ml5, ..... It will be a base to start with your site for your need. It's now comming with some examples. But nothing is obligatory :) You can fill free to edit any section of the project and if you create something cool share with all of as! 

![yss menu open](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/screenShots/ilooNav_withJQMobile.png?raw=true)



# Table of Contents

* [intrudaction](#intrudaction)

* [yss panel site Prototype](#yss-panel-prototype)

* [.svg - site](#on-top-off-svg-files)

* [three.js - site](#on-top-off-threejs)
  
  * [functions / methodes](#function-/-methodes-of-t4y:)

* [currently on TODO](#todo)

* [changelog](#changelog)



---



# Intrudaction

**!! It's in progress !!** current version of yss in in a process of big transformation.

It is a part of a oiyshTerminal ecosystem. As a solution to have a alterative to node-dashboard ore other custom build web page this is providing you with set of helpers to make your page live fast !



---



# yss panel Prototype

Most basic page is ./s_blankPage.js

```javascript
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

You need to add your stuff in adequate sections. In future there will be a prototype to enheret from but for now it's like it's. Those are the functions / methodes as a minimum on site of your thing to make site working. 



---



# On top off .svg files

**examples:** ./s_testFunctsPage.js or ./s_basicSailPage.js

![yss basic sail page](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/screenShots/basicSailing_newMenu.png?raw=true)

This is a s_basicSailPage.js it is a .svg page example.



---



# On top off Three.js

**examples:** ./s_illoNav3D.js or ./s_3dCompass1.js

![yss iloo nav 3d page](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/screenShots/ilooNav3D_ver0.1.png?raw=true)

This is a s_threeTestPage.js it is a Three.js page example.

Main Atraction is handled by instance in "t4y" variable.



## Functions / methodes of t4y:

```javascript
t4y.getHtml();
```

Returns string getHtml data needed in getHtml() of your page.

```javascript
t4y.getHtmlAfterLoad( 's_ilooNav3D.glb',
  {
    'camPos': [0.028763731041237167, 103.44550962401865, -93.74328394639551],
    'camRot': [-1.909218085730232, -0.0015954765259057495, -0.0],
    'controls': false,
    'lightPos': [0,100,-190],
    'camDeb': false
  });
```

To getHtmlAfterLoad in page building step. To get working 3d model from file, 's_ilooNav3D.glb' and set some attributes.

```javascript
t4y.doAni( t4y.otsce.getObjectByName("Empty"), {
    'rotateY': 10
});
```

Will find object Empty and rotate by Y axis to angle deg 10. Do animation setup.

```javascript
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

Replace text in current scean. Will look for HeelText to replace it with this one with name HeelText. handle: [cb|lb|lt|rt|rb] aligning.



---



# TODO

* 3d compass is super hi load on ecosia.
* three.js don't scale down frame when it's not in aspect. When it's to narrow it's bed.
* t4y need sequence loader to unify variables for async actions :/ or some callback system that it's ready after t4y.getHtmlAfterLoad();
* otdm-tools integration to make query about what is possible to use now.

# NOTES

* interesting stuff:
* three.js ray example to check intersection with objects. for selections?
  https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
* three.js physics example nice
  https://threejs.org/examples/?q=ammo#physics_ammo_cloth
* three.js TWEEN easing options and annimations improvment options
  https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263

# CHANGELOG

230117

- mkShader from yss on the wallpaper / fixing it. Still some elements are not going over shader :/ iloonav and guages

yoyoek1

230116

- screen manager buttons finger size.
- shader buttons in side menu same size as screen manager magic character >>[‎ ]<< you can't see it but it's not a space :)
- menu shader icons visible what is on / off.
- yss svg shader same as three.js ...... red, invert is reacting same way as three.js so red invert work as toogle. but it revile pure implementation of svg shader :(

yoyoek1

230115

- there is now a console in canvas listining for keys. For now h or ? will show help. It can do some stuff.
- renderIt and myAnimation got some cainda a collecting system for requests if someone wants something to render or animate. Requests are put in setTimeout reseting old one in delay of ms to next render time. so max.
- fix orbital control. wow! WoW
- three.js update model light folows camera. Illusion of flash light. Autorotation of orbitalControl. :)
- fixed no animation render an animation after standby
- ml5.js disable by default.
- renderIt clears timeout.
- fixing missing files

yoyoek1

230114

- torking scrues on anti multi render request. to many renders !
- new fps limiter only on animation.
- three4jss now is only adding light if there is no light in scene file or you requestet for it. other way its no light.
- osd performance left me only with a task to fix mixers.

yoyoek1

230113

- osd performance tweaks, animations tweaks.
- fix glitching on resize
- I build a small benchmark flow to run 90 messages over instruments it's 2Hz update. It starts firefox run test, then spits out sys and user time :) So for Reference I'm addin benchTable
- degToHdg( deg ) Returns nice 000 format heading str.
- osd some optimalization for not rebuilding same value, camera position update.

yoyoek1

230112

- t4y.putText - osd in progress.. O it can do also :P fov of camera detection nice aligning cb|lt|rt|lb|rb ciach :) 19:03 :P
- t4y.getHtmlAfterLoad no more ott arg.
- Fixing subPixel section to update on resize screen. >600: 4; > 500: 2
- Fixing camera swaping system. When glb have "Camera" t4y is trying to swap to it. All is loaded async so there is a problem what is current in use. Shader done.
- spliting three4yss.js for more files. DONE: T4y_putText, T4y_shadersDefs, T4y_shader, T4y_ani

yoyoek1

2301111450

- Moving to directory per site structure.
- Adding libs directory to hold all libs not in main dir.
- Fixing new paths. Flow of ySS update to new paths :) system
- in t4y on load glb it check if there is no "Camera" coming from glb file. If is there should getting position from it. It's doing it but shader and orbit stopt work :(

yoyoek1

# BENCHTABLE

* 2301151128  3d com ani 1    0 0m3.966s    0m9.143s    0m44.140s
  
                         0    0 0m2.102s    0m6.042s    0m44.164s
              three.js   1    0 0m4.342s    0m9.397s    0m44.178s
                         0    0 0m2.262s    0m5.803s    0m44.187s

* 2301151049  3d com ani 1    0 0m4.360s    0m10.830s    0m44.126s
  
                         0    0 0m2.250s    0m6.249s    0m44.150s
              three.js   1    0 0m4.453s    0m9.410s    0m44.152s
                         0    0 0m2.693s    0m6.347s    0m44.225s

* 2301150926  3d com ani 1    0 0m4.307s    0m8.728s    0m44.099s
  
                         0    0 0m4.164s    0m8.421s    0m44.142s
              three.js   1    0 0m4.574s    0m9.476s    0m44.123s
                         0    0 0m4.746s    0m9.310s    0m44.200s
              3d com ani 0    0 0m2.484s  0m6.702s
                         1    0 0m4.234s  0m9.181s
              three.js   0    0 0m2.728s  0m6.678s
                         1    0 0m4.882s  0m9.353s

* 2301142005  fps limit 18 -------------------------
  
              3d com ani 5 aa 0 0m10.407s  0m18.143s
                         0    0 0m1.902s  0m5.375s
              three.js   5    0 0m4.385s  0m16.266s
                         0    0 0m2.102s  0m5.723s

* 2301141232  3d com ani 5 aa 0 0m11.106s 0m18.397s
  
                     ani 0.7  0 0m10.531s 0m17.760s
                     ani 0    0 0m2.560s  0m6.746s
              three.js   0    0 0m2.398s  0m6.094s
                        0.7   0 0m5.137s  0m16.192s
                        5     0 0m4.270s  0m15.443s  

* 2301141057  3d com ani 0 aa 0 0m2.449s  0m5.957s
  
                                0m2.405s  0m6.038s
              three.js 0 0      0m2.267s  0m5.909s
              three.js 0.7 0    0m5.320s  0m16.776s
              3d com   0.7 0    0m5.320s  0m16.776s

* 2301140839  3d com ani 1 aa 0 0m4.476s  0m12.612s
  
                ani 0 aa 0      0m1.879s  0m5.274s

* 2301140813  3d com ani 0 aa 0 0m2.029s  0m5.890s <-- asyncs

* 2301131458  3d com alias off  0m2.726s  0m7.320s
  
                ani 0.3         0m2.796s  0m6.380s
                ani 0.1         0m2.464s  0m6.477s
                                0m2.558s  0m5.983s
                ani 0.9         0m3.427s  0m7.781s
                                0m2.584s  0m8.143s

* 2301131427  3d com 0.7 animat 0m4.552s  0m9.448s

* 2301131425  3d com 0.1 animat 0m2.663s  0m6.311s

* 2301131423  3d compass -      0m4.298s  0m9.047s

* 2301131421  basic sail -      0m2.014s  0m6.044s

* 2301131419  three.js test -   0m4.468s  0m9.979s <-- nice total cpu throttling :)

* 2301131308  three.js test -   0m2.200s  0m5.601s

* 2301131213  3d compass -      0m2.276s  0m5.388s

* 2301131218  three.js test -   0m2.291s  0m5.826s

* 2301131221  basic sail -      0m1.768s  0m5.246s

***
