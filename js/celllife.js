/*
Written by Georgi Olentsenko for CellLife project
Started 2018-09-08
*/

var celllife_running = false;

// World parameters
var world_height = 500;
var world_width = 500;
var world;
var world_view;
var cells = [];
var cell_total_number = 0;

function button_click()
{
	if (celllife_running)
	{
		celllife_running = false;
		document.getElementById("buttontext").innerHTML = "Start ";
		document.getElementById("button").className = "startbutton";
	}
	else
	{
		celllife_running = true;
		document.getElementById("buttontext").innerHTML = "Stop ";
		document.getElementById("button").className = "stopbutton";
		
		// Clear previous world data
		cells = [];
		
		// Create new world
		create_new_world();
		create_life();
		leave_life_alone();
	}
}

function create_new_world()
{
	var world_canvas = document.getElementById("world");
	world_view = world_canvas.getContext("2d");
	world = world_view.createImageData(world_height,world_width);
	for (var i=0;i<world.data.length;i+=4)
	{
		world.data[i+0]=239;
		world.data[i+1]=224;
		world.data[i+2]=199;
		world.data[i+3]=255;
	}
	world_view.putImageData(world,0,0);
}

function create_life()
{
	var i;
	for (i = 0; i < 10; i++) {
		
		// Cell parameters
		var new_cell = {
			number: cell_total_number, 	// Cell number
			x: 0,		// location x
			y: 0		// location y
		};
		
		cell_total_number += 1;
		new_cell.x = Math.floor((Math.random() * world_width));
		new_cell.y = Math.floor((Math.random() * world_height));
		cells.push(new_cell);
	}
}

function leave_life_alone()
{
	// Display current state
	var i;
	var world_location;
	for (i = 0; i < cells.length; i++) {
		world_location = (cells[i].y*world_width + cells[i].x)*4;
		world.data[world_location+0]=0;
		world.data[world_location+1]=0;
		world.data[world_location+2]=0;
	}
	
	// Make cells do something TODO
	
	world_view.putImageData(world,0,0);
	document.getElementById("buttontext").innerHTML = "Finished";
}