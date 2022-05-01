

function m_d3PlotInit( objName, settings ){
  cl("m_d3 init...");
  cl("  settings:"+settings);
  if( settings == undefined )
    var settings = {};
  var tObj = SVG("#"+objName);
  cl("tObj x, y:"+tObj.x()+" , "+tObj.y());
  cl("tObj width x height:"+tObj.width()+" , "+tObj.height());


  var gWidth = tObj.width();
  var gHeight = tObj.height();
    var scale = settings['plotSubPix'] ? settings['plotSubPix'] : 3; //divide by

  var dataIn = [
    {'x':0,'y':0},
    {'x':1,'y':1},
    {'x':2,'y':0},
    {'x':3,'y':2}
  ];
  // set the dimensions and margins of the graph
  var width = gWidth*scale;
  var height = gHeight*scale;

  // append the svg object to the body of the page

  SVG("#"+objName).hide();
  var svg = d3.select("#layer1")
  .append("g")
    .attr("id","d3Plot0000001"+objName)
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform",
          //"translate(" + margin.left + "," + margin.top + ")");
          "translate(" +(tObj.x())+ "," + (tObj.y()) + ")")
  .append("g")
    .attr("transform","scale("+(1/scale)+")");

  // Initialise a X axis:
  var x = d3.scaleLinear().range([0,width]);
  var xAxis = d3.axisBottom().scale(x);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class","myXaxis")

  // Initialize an Y axis
  var y = d3.scaleLinear().range([height, 0]);
  var yAxis = d3.axisLeft().scale(y);
  svg.append("g")
    .attr("class","myYaxis")

  // Create a function that takes a dataset as input and update the plot:
  function update(data, addInfo ) {

    if( addInfo != undefined){
      for( var key in addInfo ){
        cl("key: "+key);
        settings[key] = addInfo[key];
      }

    }

    if( data[0]['x'] ){
      var dx = 'x';
      var dxDiv = 1;
      var dy = 'y'
    }else{
      var dx = 't';
      var dy = 'v'
    }

    if( settings['direction']  == "upDown" ){
      var dTmp = dx;
      dx = dy;
      dy = dTmp;
    }

    // Create the X axis:
    x.domain([
      d3.min(data, function(d) { return d[dx] }),
      d3.max(data, function(d) { return d[dx] })
    ]);
    if( settings['direction'] == "upDown" && settings['fillToPoint']  != undefined ){
      var tXDomain = x.domain();
      x.domain([
        Math.min( tXDomain[0], settings['fillToPoint'] ),
        Math.max( tXDomain[1], settings['fillToPoint'] )
      ]);
    }

    if( settings['legendX'] == "no"){
    }else{
      svg.selectAll(".myXaxis")
        //.transition()
        .call(xAxis);
    }

    // create the Y axis
    y.domain([
      d3.min(data, function(d) { return d[dy]  }),
      d3.max(data, function(d) { return d[dy]  })
      ]);
    if( settings['direction'] != "upDown" && settings['fillToPoint'] != undefined ){
      var tYDomain = y.domain();
      y.domain([
        Math.min( tYDomain[0], settings['fillToPoint'] ),
        Math.max( tYDomain[1], settings['fillToPoint'] )
      ]);
    }



    if( settings['legendY'] == "no"){
    }else{
      svg.selectAll(".myYaxis")
        //.transition()
        .call(yAxis);
    }

    // Create a update selection: bind to the new data
    var u = svg.selectAll(".lineTest")
      .data([data], function(d){ return d[dx] });

    // Updata the line

    u
      .enter()
      .append("path")
      .attr("class","lineTest")
      .merge(u)
      //.transition()


    var dPlotType = null;
    if( !settings['plotType'] || settings['plotType'] == "line" ){
      u.attr("d",
        d3.line()
       .x(function(d) { return x(d[dx]); })
       .y(function(d) { return y(d[dy]); }));

    }else if( settings['plotType'] == "area"){

      if( settings['direction']  == "upDown"  ){
        u.attr("d", d3.area()
          .y(function(d) { return y(d[dy]); })
          .x0( x( settings['fillToPoint'] ? settings['fillToPoint'] : 0 ) )
          .x1(function(d) { return x(d[dx]); }));

      }else{
        u.attr("d", d3.area()
          .x(function(d) { return x(d[dx]); })
          .y0(y( settings['fillToPoint'] ? settings['fillToPoint'] : 0 ))
          .y1(function(d) { return y(d[dy]); }));

      }

      var mStyle = [
        "fill:"+shaderColor( settings['fillColor'] ? settings['fillColor'] : "#0f0f0f"),
        "stroke:"+shaderColor( settings['lineColor'] ? settings['lineColor'] : "#000000" ),
        "stroke-width:"+( settings['lineSize'] ? settings['lineSize'] : 5 )
        ];
      u
      .attr( "style", mStyle.join(";") );

      cl("  it's a area plot !! settings:"+settings['fillToPoint']+" addInfo:"+addInfo);
    }



  }

  // At the beginning, I run the update function on the first dataset:
  update(dataIn)


  cl("m_d3 init... DONE");
  return update;
}
