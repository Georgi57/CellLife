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
		live();
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
	for (i = 0; i < 50; i++) {
		
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

function cells_move_randomly()
{
	for (i = 0; i < cells.length; i++)
	{
		var direction = Math.floor((Math.random() * 4));
		switch(direction){
			case 0:
				cells[i].y += 1;
				if (cells[i].y >= world_height) cells[i].y -= world_height;
				break;
			case 1:
				cells[i].x += 1;
				if (cells[i].x >= world_width) cells[i].x -= world_width;
				break;
			case 2:
				cells[i].y -= 1;
				if (cells[i].y <= 0) cells[i].y += world_height;
				break;
			case 3:
				cells[i].x -= 1;
				if (cells[i].x <= 0) cells[i].x += world_width;
				break;
		}
	}
}

function live()
{
	var i;
	var world_location;
	
	// Make cells do something
	// -----------------------
	
	cells_move_randomly();
	
	// -----------------------
	
	// Display current state
	
	for (i = 0; i < cells.length; i++) {
		world_location = (cells[i].y*world_width + cells[i].x)*4;
		world.data[world_location+0]=0;
		world.data[world_location+1]=0;
		world.data[world_location+2]=0;
	}
	world_view.putImageData(world,0,0);
	
	if (celllife_running)
	{
		setTimeout(live, 100);
	}
}