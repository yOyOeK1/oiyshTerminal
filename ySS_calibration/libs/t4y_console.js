/**
 * Three.js for yss - console.log infos
 * by hitting "h" on Three.js site it will responce as terminal in
 * console.
 * is accessable by t4y global object. It's a instance of it to use.
 */
class T4y_console{

  constructor( fromw ){
    cl("T4y_console constructor. fromw["+fromw+"]");
    return this;
  }

  con_printRender = false;
  con_printFps = true;
  con_lights = true;
  con_printCameraPos = false;

  consProcessKey( event ){
    cl("consProcessKey got event:");
    cl(event);
    switch ( event.key ) {
      case "R": // R
        t4y.con_printRender = !t4y.con_printRender;
        break;
      case "f":
        t4y.con_printFps = !t4y.con_printFps;
        break;
      case "l":
        t4y.con_lights = !t4y.con_lights;
        cl("have now lights: will go now "+t4y.con_lights);
        //cl(t4y.sceneLights);
        t4y.sceneLights.find(l => {
          l.castShadow = t4y.con_lights;
        });
        t4y.setDelaydRender("from key light rebuild.");
        break;
      case "c":
        t4y.con_printCameraPos = !t4y.con_printCameraPos;
        break;
      case "h"||"H"||"?":
        t4y.consHelp();
        break;
    };
  }


  consHelp(){
    cl(`Console help--------------------
Key                                 [Status]
h H ? - for help
R - console log Render pass info    [`+t4y.con_printRender+   `]
f - console log fps every sec       [`+t4y.con_printFps+      `]
l - on off lights on scene          [`+t4y.con_lights+        `]
c - console log camera position     [`+t4y.con_printCameraPos+`]


Console help -------------END`);
  }


};

export { T4y_console };
