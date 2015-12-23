var dayOfWeekChart = dc.rowChart('#chart-day-of-week');
//var hitslineChart  = dc.lineChart('#chart-line-hitsperday'); 
var moveChart = dc.barChart('#chart-volume-month');
//var rowChart = dc.rowChart("#chart-row");


var searchValue = "uber";
var host = "https://onemonarch.herokuapp.com";
var url = host + "/api/data/" + searchValue + "/200";
var xmlhttp;
var response;
var happy;
var noise;
var sad;
var followers;
var words;

xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    response = xmlhttp.response;
		happy = response.sentiment.happytweets;
		noise = response.sentiment.noiseTweets;
		sad = response.sentiment.sadTweets;
		followers = response.followers;
		words = response.words;

		// console.log(response.length);
  //   console.log(happy.length);
  //   console.log(noise.length);
  //   console.log(sad.length);
  //   console.log(followers.length);
  //   console.log(words.length);


		var data = $.map(sad, function(value, index) {
		 return [value];
		});

		var parseDate = d3.time.format("%a %b %d %X %Z %Y").parse;
    var numberFormat = d3.format('.2f');

		data.forEach(function(d) {
			d.date = parseDate(d.created_at);
			d.dateOnly = d3.time.day(d.date);
			d.hour = d3.time.hour(d.date);
			d.month = d3.time.month(d.date); 
			d.monthYear = (d.date.getMonth() + " " + d.date.getFullYear());
			d.total= 1;
		});

		var ndx = crossfilter(data); 
		var dayOfWeekDimension = ndx.dimension(function (d) {
		    var day = d.date.getDay();
		    var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		    return day + '.' + name[day];
		});
		var dayOfWeekGroup = dayOfWeekDimension.group();

		var dateDim = ndx.dimension(function(d) {return d.date;});
		console.log(dateDim.bottom(1)[0]);
		var minDate = parseDate(dateDim.bottom(1)[0].created_at);
		var maxDate = parseDate(dateDim.top(1)[0].created_at);
		var minDateBuffer = d3.time.day.offset(minDate, -1);
		var maxDateBuffer = d3.time.day.offset(maxDate, 1);

		console.log(minDateBuffer);
		console.log(maxDateBuffer);

		var tweets = dateDim.group();

		var monthYearDim = ndx.dimension(function(d) {return d.monthYear;});
		var minMonthYear = monthYearDim.bottom(1)[0].monthYear;
		var maxMonthYear = monthYearDim.top(1)[0].monthYear;
		var tweetsByMonthYear = monthYearDim.group().reduceSum(function(d) {return d.total;});


	  var moveDays = ndx.dimension(function(d) {
	  	return d.hour;
	  });

    var volumeByDayGroup = moveDays.group().reduceSum(function (d) {
      return d.total;
    });


		var all = ndx.groupAll();




		dayOfWeekChart
			.width(900)
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
			.renderTitle(true)
		  .turnOnControls(true)
			.elasticX(true);
//			.xAxis().ticks(2);


		// hitslineChart
		//   .yAxisLabel("Tweet volume")
		//   .transitionDuration(1000)
		//   .renderArea(true)
		// 	.width(900).height(200)
		// 	.dimension(dateDim)
		// 	.group(tweets)
		// 	.x(d3.time.scale().domain([minDate,maxDate]))
		// 	.round(d3.time.day.round)
		// 	.xUnits(d3.time.days)
		// 	.xAxis().tickFormat(d3.time.format('%b %d'));


    moveChart
        .width(990) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
        .height(400)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .dimension(moveDays)
        .group(volumeByDayGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([minDateBuffer, maxDateBuffer]))
        .xUnits(d3.time.hours)
        .round(d3.time.hour.round)
        .yAxis().tickFormat(d3.format("d")).tickSubdivide(0);
        //.xAxis().ticks(d3.time.hours, 1).tickFormat(d3.time.format('%b %d'))

		// fluctuationChart
		//   .width(900)
		//   .height(180)
		//   .margins({top: 10, right: 100, bottom: 30, left: 100})
		//   .dimension(dateDim)
		//   .group(tweets)
		//   .elasticY(true)
		//   .centerBar(true)
		//   .gap(0)
		//   .round(d3.time.month.round)
		//   .x(d3.time.scale().domain([minDate,maxDate]))
		//   .xUnits(d3.time.days)
		//   .renderHorizontalGridLines(true);

		// rowChart
		//   .width(900)
		//   .height(400)
		//   .margins({top: 10, right: 100, bottom: 30, left: 100})
		//   .dimension(dateDim)
		//   .group(tweets)
		//   .gap(0); //units in whole numbers 


		dc.renderAll(); 









  }
}
xmlhttp.open("GET", url, true);
xmlhttp.responseType = 'json';
xmlhttp.send();
