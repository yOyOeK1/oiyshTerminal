function MyJustGage( args ){
  cl('MyJustGage constructor .....');
  var argForJG = args;
  var idObj = args.id;
  var tObj = SVG("#"+idObj);
  var gWidth = tObj.width();
  var gHeight = tObj.height();
  var scale = args['subPix'] ? args['subPix'] : 3; //divide by
  var width = gWidth*scale;
  var height = gHeight*scale;

  argForJG.id = 'justGuageTmp';
  argForJG.height = height;
  argForJG.width = width;
  var tmp = new JustGage(argForJG);

  var g = $("#justGuageTmp");
  var defs = g.find("filter");
  var s = $("#svgDyno");
  var sDefs = s.find("defs").append(defs);
  var l1 = d3.select("#layer1")
    .append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("transform",
      "translate(" +(tObj.x())+ "," + (tObj.y()) + ")")
    .append("g")
    .attr("transform","scale("+(1/scale)+")")
    .attr("id","jg0000001"+idObj);

  var e = g.children().detach();
  $('#jg0000001'+idObj).append(e);
  //$('#jg0000001').html(g.children().html());
  g.html('');
  //$("#justGuageTmp").html('');

  tObj.hide();

  return tmp;
  cl('MyJustGage constructor .....DONE');

}
