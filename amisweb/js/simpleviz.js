//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ D3 functions! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//This function plots a histogram. canvasHeight and canvasWidth are the dimensions of the SVG element that will contain
//the histogram. innerHeight and innerWidth are the dimensions of where the histogram will be rendered inside the canvas,
//this is for aesthetic purposes. barPadding is the separation between bars in the histogram and should be a value
//between 0 and 1. xLabel and yLabel are the axis labels, to ideantify what each axis means. data is the data to be
//plotted, this function will plot objects only so use wither orderStringArray or orderNumberArray to convert an array
//into somethng this functions understands. 

function plotHistogram( barPadding, xLabel, yLabel, data, bins ) {
	
	d3.select("svg").remove();

	//if(isNaN(data[0]/data[1]))
	if (typeof data[0] == "string")
	{
		data = orderStringArray(data);
		//console.log(data);
	}
	else
	{
		data = orderNumberArray(data, bins, false);
	}
	
	////////////////////////// SETUP /////////////////////////
	var margin = { top: 100, bottom: 100, left: 100, right: 100};
	
	var innerWidth  = window.innerWidth -  (margin.left + margin.right),
		innerHeight = window.innerHeight - (margin.top + margin.bottom);
	
	var svg = d3.select("div.vizContainer").append("svg") // change the argument in the "select" method to append the graph somewhere specific in the HTML. Use CSS selectors.
				.attr("width" , window.innerWidth )
				.attr("height", window.innerHeight);
				
	svg.append("rect")
		.attr("width", innerWidth)
		.attr("height", innerHeight)
		.attr("fill", "rgba(100,100,100,0.4)")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("class", "backgroundColor");
	
	var g = svg.append("g")
			   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var xAxG = g.append("g")
				.attr("transform", "translate(0, " + innerHeight + ")")
				.attr("class", "xaxis"),
		yAxG = g.append("g")
				.attr("transform", "translate(0, 0)")
				.attr("class", "yaxis");
	
	var xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding),
		yScale = d3.scale.linear().range([innerHeight, 0]),
		colourScale = d3.scale.category20();
		
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom"),						
	
		xAxisLabel = xAxG.append("text")
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + (innerWidth / 2) + "," + 48 + ")")
		.attr("class", "label")
		.text(xLabel);
		
	var	yAxis = d3.svg.axis().scale(yScale).orient( "left" ),
	
		yAxisLabel = yAxG.append("text")
		.style("text-anchor", "middle")
		.attr("transform", "translate(-" + 60 + "," + (innerHeight / 2) + ") rotate(-90)")
		.attr("class", "label")
		.text(yLabel);
	
	var invisibleBars = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("class", "invisiBars");
	
	//////////////////// RENDER HISTOGRAM ////////////////////
	xScale.domain(       data.map( function (d){ return d.value; })); // "array".map will compute the function for every element and what gets returned is put into a new array
	yScale.domain([0, d3.max(data, function (d){ return d.frequency; })]);

	xAxG.call(xAxis);
	yAxG.call(yAxis);
	
	/* Bind */
	var bars = g.selectAll("rect").data(data),
		invisibars = invisibleBars.selectAll("rect").data(data);

	/* Enter */
	bars.enter().append("rect")
		.attr("width", xScale.rangeBand()) // uses info from xScale's domain and range band to compute how wide each bar should be
		.attr("fill",  function (d){ return colourScale(d.value); })
		.attr("stroke", function (d){ return colourScale(d.value); })
		.attr("class", "bars");
	invisibars.enter().append("rect")
		.attr("width", xScale.rangeBand()) // uses info from xScale's domain and range band to compute how wide each bar should be
		.attr("fill",  "rgba(0,0,0,0)" )
		.attr("class", "areas");
	/* Update */
	bars
	.attr("x",      function (d){ return               xScale(d.value); })
	.attr("y",      function (d){ return               yScale(d.frequency); })
	.attr("height", function (d){ return innerHeight - yScale(d.frequency); });
	invisibars
	.attr("x",      function (d){ return               xScale(d.value); })
	.attr("y",      function (d){ return               				 0; })
	.attr("height", function (d){ return 				   innerHeight; });
	/* Exit */
	bars.exit().remove();
	invisibars.exit().remove();

	$('.xaxis g.tick text').each(function(index){
		$(this).on('myCustomEvent1', function(e, i){
			//console.log(e);
			$('.xaxis g.tick text').eq(i).css({
				"fill": "rgba(0,0,0,1)"
			});
		});
		$(this).on('myCustomEvent2', function(e, i){
			//console.log(e);
			$('.xaxis g.tick text').eq(i).css({
				"fill":"rgba(0,0,0,0.1)"
			});
		});
	});
	
	$('rect.areas').each(function(index){
		//console.log( index + ": " + $( this ) );
		$(this).on('mouseover', index, function(){
			$('.xaxis g.tick text').trigger('myCustomEvent1', [index]);
		});
		$(this).on('mouseout', index, function(){
			$('.xaxis g.tick text').trigger('myCustomEvent2', [index]);
		});
		if(!+$('rect.bars').eq(index).attr('height')) console.log(index+": "+"empty rectangle");
	});
	
	renderGrid( innerWidth, 0 );	// renders the grid, but only draws horizontal lines
}

function renderGrid( x1, y1 ){
	if(y1){
		d3.selectAll(".xaxis g.tick line")
			.attr("y1", y1);
	}
	else if(x1){
		d3.selectAll(".yaxis g.tick line")
			.attr("x1", x1);
	}
}

//This function will count how many times a unique string appears in an ARRAY OF STRINGS.
function orderStringArray( dataArray ){

	var count = 1;
	var results = [];
	dataArray.sort();
	
	for(i = 0; i<dataArray.length; i++) {
	
		if(dataArray[i] === dataArray[i+1]){
			count++;
		}
		else{
			results.push({ value: dataArray[i], frequency: count });
			count = 1;
		}
	
	}
	//console.log(dataArray);
	//console.log(results);
	
	return results;
}

//This function will take an ARRAY OF NUMBERS and sort the numbers in an ascending order. Then it will
//compute a range where those numbers fall into; this is done with the "bins" parameter. The maximum
//value in the array will be divided into the number of bins the user wants to render for a plot. If
//one would wish to display all the numbers in the array without dividing them up in a range, one can
//pass the maximum value in the array as the "bins" parameter. The functions will then count how many
//times a number in the data array appears in the array, then it will create an array of objects that
//contain the range of values (or a single value) as a string called "value", and the number of times
//it appears in the data array as a property called "frequency".
function orderNumberArray( dataArray, bins, bool_floor ){
	
	var count = 0;
	var results = [];
	var i, j = 0;
	dataArray.sort(function(a,b){
	return a-b;
	});
	
	if(!bins)
	{
		var range = d3.range(d3.min(dataArray), d3.max(dataArray), d3.max(dataArray)/10);
	}
	else
	{
		var range = d3.range(d3.min(dataArray), d3.max(dataArray), d3.max(dataArray)/bins);
	}
	
 	if(bool_floor){
		for( i = 0; i<range.length; i++){
		
			range[i] = Math.floor(range[i]);
		
		}
	}
	
	//console.log(range);			
	
	for(i = 0; i<range.length; i++) {

		while((dataArray[j] >=  range[i]) && (dataArray[j] < range[i+1] || range[i+1] === undefined)){
		
			count++;
			j++;
		
		}
		if(range[i+1] != undefined){
			results.push({ value: "|" + ""+ range[i].toFixed(2) +"" + "-" + ""+ range[i+1].toFixed(2) +"" + "|", frequency: count });
		}
		else{
			results.push({ value: "|" + ""+ range[i].toFixed(2) +"" + "-" + ""+ d3.max(dataArray).toFixed(2) +"" + "|", frequency: count });
		}
		count = 0;
	}
	
	//console.log(dataArray);
	//console.log(results);
	
	return results;
	
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//