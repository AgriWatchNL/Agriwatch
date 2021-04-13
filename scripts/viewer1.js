/*----------------------------------------------------------------
  Name:        viewer.js
  Date:        November 2019
  Description: Base code for the - Web Programming - exercise
               (data viewer page)
  Version:     2.0
----------------------------------------------------------------*/
 
var CountryName = "Netherlands";

function changeCountry(choice)
{
	CountryName = choice;
	
	var layerArray, len, layer;
	layerArray = navMap.getLayers().getArray(),
	len = layerArray.length;
	while (len > 0){
		layer = layerArray[len-1];
		navMap.removeLayer(layer);
		len = layerArray.length;
}
	
	
	var map_country = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: '../services/provinces.py?country_name='+ CountryName.value,
      format: new ol.format.GeoJSON({
        defaultDataProjection :'EPSG:4326',
        projection: 'EPSG:3857'
      })
    }),

    name: 'Selected country'
  });
  navMap.addLayer(map_country);


	
	
	
}


/*-- Draws a bar chart based on mean population deviation per province  */

function drawBarChart(){

  var margin = {top: 20, right: 20, bottom: 45, left: 50},
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
 
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  var y = d3.scaleLinear().rangeRound([height, 0]);
  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);
 
  var barChart = d3.select("#chart_container")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
 
  d3.json("../services/prov_population1.py?country_name="+CountryName, function(err, provinces){
    x.domain(provinces.map(function(p) { return p.prov_abbr; }));
    y.domain([
      d3.min(provinces, function(p) { return p.popdev - 0.1; }),
      d3.max(provinces, function(p) { return p.popdev + 0.1; })
    ]);
 
    barChart.selectAll(".bar")
        .data(provinces)
      .enter().append("rect")
        .attr("id", function(p) { return "bar_" + p.prov_abbr; })
        .attr("class", function(p) { if (p.popdev < 0) {return "bar negative"} else {return "bar positive"} })
        .attr("x", function(p) { return x(p.prov_abbr); })
        .attr("y", function(p) { return y(Math.max(0, p.popdev)); })
        .attr("width", x.bandwidth())
        .attr("height", function(p) { return Math.abs(y(p.popdev) - y(0)); });
 
   barChart.append("g")
        .attr("class", "x axis")
      .append("line")
        .attr("stroke", "#000")
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("x2", width);
 
    barChart.append("g")
        .attr("class", "x axis mean")
      .append("text")
        .attr("x", 5)
        .attr("y", y(0)-4)
        .style("text-anchor", "start")
        .text("Mean");
 
   barChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("x", width/2)
        .attr("y", 40)
        .attr("fill", "#000")
        .style("text-anchor", "middle")
        .text("Deviation per Province"
        );
 
    barChart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("x", 5)
        .attr("y", 3)
        .attr("fill", "#000")
        .style("text-anchor", "start")
        .text("Millions of Inhabitants");
 
  });
 
};
/*---*/
 
var navMap;
 
/*-- Initialization function --*/
function init() {

  //trigger bar charting function"
  drawBarChart();
 
  //define map object & link to placeholder div:
  navMap = new ol.Map({target: "map_container"});
  // define layer as tiled map:
  osmLayer = new ol.layer.Tile({
    // load OSM (a connector predefined in the API) as source:
    source: new ol.source.OSM()
  });
  // add layer to map:
  navMap.addLayer(osmLayer);
  // create a map view:
  navMap.setView(
    //center coords and zoom level:
    new ol.View({
      center: ol.proj.transform([5.53, 52.13], 'EPSG:4326', 'EPSG:3857'),
      zoom: 7
    })
  );
 
  navMap.addControl(new ol.control.Zoom());
  navMap.addControl(new ol.control.MousePosition({
      projection: 'EPSG:4326',
      coordinateFormat: ol.coordinate.createStringXY(4)
    })
  );
 

 

 
  var prov_style =  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'MediumPurple',
      // lineDash: [4],
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(147, 112, 219, 0.2)'
    })
  });
 
  var nl_provinces = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: '../services/provinces.py?country_name=netherlands',
      format: new ol.format.GeoJSON({
        defaultDataProjection :'EPSG:4326',
        projection: 'EPSG:3857'
      })
    }),
    style: prov_style,
    name: 'Dutch Provinces'
  });
  navMap.addLayer(nl_provinces);
 
}
/*---*/