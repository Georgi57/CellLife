/*
Written by Georgi Olentsenko for CellLife project
Started 2018-09-08
*/

var celllife_running = false;

// Window properties
var window_width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

var window_height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;

// World parameters
var world_height = 500;
var world_width = 500;
var world;
var world_view;
var cells = [];
var cells_counts = new Array(4);
var cell_total_number = 0;

var cells_to_delete = [];

function load_function()
{
	console.log("Space for canvas:",window_width, window_height);
	// Resize the canvas if needed
	var world_canvas = document.getElementById("world");
	if (window_width - 4 > world_width){
		world_width = window_width - 4
		world_canvas.width = world_width
	}
	if (window_height - 66 > world_height){
		world_height = window_height - 66
		world_canvas.height = world_height
	}
	console.log("World size:", world_width, world_height);
}

function button_start_pause()
{
	if (celllife_running)
	{
		celllife_running = false;
		document.getElementById("pause-button").innerHTML = "Live";
		document.getElementById("pause-button").id = "start-button";
		document.getElementById("active_loader").id = "not_active_loader";
	}
	else
	{
		celllife_running = true;
		document.getElementById("start-button").innerHTML = "Pause";
		document.getElementById("start-button").id = "pause-button";
		document.getElementById("not_active_loader").id = "active_loader";

		// Clear previous world data
		cells = [];
		
		// Create new world
		create_new_world();
		create_life();
		live();
	}
}

function create_new_world()
{
	var world_canvas = document.getElementById("world");
	world_view = world_canvas.getContext("2d");
	world = world_view.createImageData(world_width,world_height);
	for (var i=0;i<world.data.length;i+=4)
	{
		world.data[i+0]=50; // red
		world.data[i+1]=50; // green
		world.data[i+2]=255; // blue
		world.data[i+3]=200;
	}
	world_view.putImageData(world,0,0);
	console.log("Space for canvas:", world_width, world_height);
}

function create_life()
{
	var i;
	for (i = 0; i < 100; i++) {
		
		// Cell parameters
		var new_cell = {
			number: cell_total_number, 	// Cell number
			x: 0,		// location x
			y: 0,		// location y
			type: 'g'
		};
		
		cell_total_number += 1;
		new_cell.x = Math.floor((Math.random() * world_width));
		new_cell.y = Math.floor((Math.random() * world_height));
		
		cells.push(new_cell);
	}
}

function search_around(x, y, depth){
	var result = new Array(3);
	result[0]=x;
	result[1]=y;
	result[2]=0;
	
	// +X
	if (world.data[(x+1 + world_height*y)*4]==0 &&
		world.data[(x+1 + world_height*y)*4+1]==0 &&
		world.data[(x+1 + world_height*y)*4+2]==0){
		result[0]=x-1;
		result[1]=y;
		result[2]=1;
		return result;
	}
	else if (depth>0){
		result = search_around(x+1, y, depth-1);
	}
	if (result[2]==1) return result;
	
	// -X
	if (world.data[(x-1 + world_height*y)*4]==0 &&
		world.data[(x-1 + world_height*y)*4+1]==0 &&
		world.data[(x-1 + world_height*y)*4+2]==0){
		result[0]=x+1;
		result[1]=y;
		result[2]=1;
		return result;
	}
	else if (depth>0){
		result = search_around(x-1, y, depth-1);
	}
	return result;
}

function live()
{
	var i;
	var world_location;
	
	// Remove empty cells
	for (i = 0; i < cells_to_delete.length; i++)
	{
		cells.splice(cells_to_delete.pop(),1);
	}
	
	// Display current state
	for (i = 0; i < cells.length; i++) {
		world_location = (cells[i].y*world_width + cells[i].x)*4;
		
		if (cells[i].type=='r')
		{
			world.data[world_location+0]=150;
			world.data[world_location+1]=0;
			world.data[world_location+2]=0;
		}
		else if (cells[i].type=='d')
		{
			world.data[world_location+0]=0;
			world.data[world_location+1]=0;
			world.data[world_location+2]=0;
		}
		else if (cells[i].type=='y')
		{
			world.data[world_location+0]=200;
			world.data[world_location+1]=200;
			world.data[world_location+2]=0;
		}
		else
		{
			world.data[world_location+0]=0;
			world.data[world_location+1]=150;
			world.data[world_location+2]=0;
		}
		
		world.data[world_location+2]=0;
	}
	
	// Make cells do something
	// -----------------------
	
	cells_act();
	
	// -----------------------
	
	// Fade the traces of cells
	for (i = 0; i < world_height*world_width*4; i+=4)
	{
		if (world.data[i]>50) world.data[i]--;
		else if (world.data[i]<50) world.data[i]++;

		if (world.data[i+1]>50) world.data[i+1]--;
		else if (world.data[i+1]<50) world.data[i+1]++;
		
		if (world.data[i+2]>255) world.data[i+2]--;
		else if (world.data[i+2]<255) world.data[i+2]++;
	}
	
	//console.log(cells_counts);
	document.getElementById("status_bar").innerHTML = "Stats |" +
		" Green:"  + cells_counts[0].toString() + 
		" Yellow:" + cells_counts[1].toString() + 
		" Orange:" + cells_counts[2].toString() + 
		" Red:"    + cells_counts[3].toString() + 
		" Brown:"  + cells_counts[4].toString() + 
		" Dead:"   + cells_counts[5].toString();
	world_view.putImageData(world,0,0);
	
	if (celllife_running)
	{
		setTimeout(live, 10);
	}
}