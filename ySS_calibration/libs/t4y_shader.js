


class T4y_shader {


  shaderStack = [];
  redEffect;
  invertEffect;
  redInvertEffect;

  constructor( fromw ){
    //super();
    cl("T4y_shader constructor. fromW["+fromw+"]");

  }


  shaderLocalClean(){
    cl(t4y.redEffect);
    if( t4y.redEffect == undefined )
    return 0;
    t4y.redEffect.enabled = false;
    t4y.redInvertEffect.enabled = false;
    t4y.invertEffect.enabled = false;

  }

  shaderAction( action ){
    if( t4y.otcom == null ){
      return 0;
    }

    t4y.shaderLocalClean();

    switch (action) {
      case "normal":
        t4y.shaderLocalClean();
        t4y.shaderStack = [];
      break;
      case "invert":
        if( t4y.shaderStack.indexOf('invert') != -1 ){
          t4y.removeElementFromArray( t4y.shaderStack, t4y.shaderStack.indexOf('invert') );
        }else{
          t4y.shaderStack.push('invert');
        }
      break;
      case "blackRed":
        if( t4y.shaderStack.indexOf('red') != -1 ){
          t4y.removeElementFromArray( t4y.shaderStack, t4y.shaderStack.indexOf('red') );
        }else{
          t4y.shaderStack.push('red');
        }
      break;
      default:
        cl(" no action");
    };

    var s = t4y.shaderStack;


    if(
      s.indexOf('invert') != -1 &&
      s.indexOf('red') == -1
    ){
      t4y.invertEffect.enabled = true;
    }else if(
      s.indexOf('invert') == -1 &&
      s.indexOf('red') != -1
    ){
      t4y.redEffect.enabled = true;
    }else if(
      s.indexOf('invert') != -1 &&
      s.indexOf('red') != -1
    ){
      t4y.redInvertEffect.enabled = true;
    }


    cl("---------t4y shaderStack is :");
    cl(t4y.shaderStack);
    cl("invert: "+t4y.invertEffect.enabled);
    cl("red: "+t4y.redEffect.enabled);
    cl("redInvert: "+t4y.redInvertEffect.enabled);
    //t4y.setDelaydRender("shader change.");
    pager.subTask( ()=>{ setTimeout( () => {
        cl("yyy shader")
        t4y.setDelaydRender("shader change.");
      },500 );
    });


  }






}


export { T4y_shader };
