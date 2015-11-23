var dayOfWeekChart = dc.rowChart('#chart-day-of-week');
var hitslineChart  = dc.lineChart('#chart-line-hitsperday'); 
var fluctuationChart = dc.barChart('#chart-volume-month');
var rowChart = dc.rowChart("#chart-row");

var data = [
		{date: "12/27/2012", http_404: 2, http_200: 190, http_302: 100},
		{date: "12/28/2012", http_404: 2, http_200: 10, http_302: 100},
		{date: "12/29/2012", http_404: 1, http_200: 300, http_302: 200},
		{date: "12/30/2012", http_404: 2, http_200: 90, http_302: 0},
		{date: "12/31/2012", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/01/2013", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/02/2013", http_404: 1, http_200: 10, http_302: 1},
		{date: "01/03/2013", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/04/2013", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/05/2013", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/06/2013", http_404: 2, http_200: 200, http_302: 1},
		{date: "01/07/2013", http_404: 1, http_200: 200, http_302: 100},
		{date: "01/08/2013", http_404: 1, http_200: 200, http_302: 100}
		];
        
var parseDate = d3.time.format("%m/%d/%Y").parse;
data.forEach(function(d) {
	d.date = parseDate(d.date);
	d.total= d.http_404+d.http_200+d.http_302;
});

var ndx = crossfilter(data); 

var dateDim = ndx.dimension(function(d) {return d.date;});
var minDate = dateDim.bottom(1)[0].date;
var maxDate = dateDim.top(1)[0].date;

var dayOfWeekDimension = ndx.dimension(function (d) {
    var day = d.date.getDay();
    var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return day + '.' + name[day];
});


var all = ndx.groupAll();
var hits = dateDim.group().reduceSum(function(d) {return d.total;}); 
var dayOfWeekGroup = dayOfWeekDimension.group();




hitslineChart
  .yAxisLabel("Hits per day")
  .transitionDuration(1000)
  .renderArea(true)
	.width(500).height(200)
	.dimension(dateDim)
	.group(hits)
	.x(d3.time.scale().domain([minDate,maxDate])); 

dayOfWeekChart
	.width(500)
	.height(200)
	.margins({top: 20, left: 10, right: 10, bottom: 20})
	.group(dayOfWeekGroup)
	.dimension(dayOfWeekDimension)
	.label(function (d) {
	    return d.key.split('.')[1];
	}) 
	.title(function (d) {
	    return d.value;
	})
  .turnOnControls(true)
	.elasticX(true)
	.xAxis().ticks(4);


fluctuationChart
  .width(420)
  .height(180)
  .margins({top: 10, right: 100, bottom: 30, left: 100})
  .dimension(dateDim)
  .group(hits)
  .elasticY(true)
  .centerBar(true)
  .gap(0)
  .round(d3.time.month.round)
  .x(d3.time.scale().domain([minDate,maxDate]))
  .xUnits(d3.time.days)
  .renderHorizontalGridLines(true);

rowChart
  .width(420)
  .height(400)
  .margins({top: 10, right: 100, bottom: 30, left: 100})
  .dimension(dateDim)
  .group(hits)
  .gap(0);


dc.renderAll(); 

