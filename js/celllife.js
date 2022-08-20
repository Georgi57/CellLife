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
var world_cells;
var cells = [[],[],[],[],[],[]];
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
		cells = [[],[],[],[],[],[]];
		
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
	world_cells = new Array(world_height);
	for (var i=0;i<world_height;i++)
	{
		world_cells[i] = new Array(world_width);
	}
	world_view.putImageData(world,0,0);
	console.log("Space for canvas:", world_width, world_height);
}

function create_life()
{
	// Random green cell allocation
	for (i = 0; i < 100; i++) {
		
		// Cell parameters
		var new_cell = {
			number: cell_total_number, 	// Cell number
			type: 'g',	// type of cell
			x: 0,		// location x
			y: 0,		// location y
			energy: 10
		};
		
		cell_total_number += 1;
		new_cell.x = Math.floor((Math.random() * world_width));
		new_cell.y = Math.floor((Math.random() * world_height));
		
		// Only green cells are created
		cells[0].push(new_cell);
		world_cells[new_cell.y][new_cell.x] = [];
		world_cells[new_cell.y][new_cell.x].push(new_cell);
	}
	
	/*
	// Some predefined cells for testing
	var new_cell = {
		number: 0, 	// Cell number
		type: 'g',	// type of cell
		x: 1,		// location x
		y: 1,		// location y
		energy: 100
	};
	cells[0].push(new_cell);
	world_cells[new_cell.y][new_cell.x] = [];
	world_cells[new_cell.y][new_cell.x].push(new_cell);
	
	var new_cell = {
		number: 1, 	// Cell number
		type: 'g',	// type of cell
		x: 51,		// location x
		y: 50,		// location y
		energy: 100
	};
	cells[0].push(new_cell);
	world_cells[new_cell.y][new_cell.x] = [];
	world_cells[new_cell.y][new_cell.x].push(new_cell);
	
	var new_cell = {
		number: 2, 	// Cell number
		type: 'g',	// type of cell
		x: world_width-2,		// location x
		y: world_height-2,		// location y
		energy: 100
	};
	cells[0].push(new_cell);
	world_cells[new_cell.y][new_cell.x] = [];
	world_cells[new_cell.y][new_cell.x].push(new_cell);
	
	cell_total_number = 4;*/
}

function live()
{
	var i;
	var world_location;
	
	// Display current state in the order of visibility of cells
	// DEAD CELLS
	for (i = 0; i < cells[5].length; i++)
	{
		world_location = (cells[5][i].y*world_width + cells[5][i].x)*4;
		world.data[world_location+0]=0;
		world.data[world_location+1]=0;
		world.data[world_location+2]=0;
	}
	
	// GREEN CELLS
	for (i = 0; i < cells[0].length; i++)
	{
		world_location = (cells[0][i].y*world_width + cells[0][i].x)*4;
		world.data[world_location+0]=0;
		world.data[world_location+1]=150;
		world.data[world_location+2]=0;
	}
	// YELLOW CELLS
	for (i = 0; i < cells[1].length; i++)
	{
		world_location = (cells[1][i].y*world_width + cells[1][i].x)*4;
		world.data[world_location+0]=200;
		world.data[world_location+1]=200;
		world.data[world_location+2]=0;
	}
	// ORANGE CELLS
		// TODO
		
	// RED CELLS
	for (i = 0; i < cells[3].length; i++)
	{
		world_location = (cells[3][i].y*world_width + cells[3][i].x)*4;
		world.data[world_location+0]=150;
		world.data[world_location+1]=0;
		world.data[world_location+2]=0;
	}
	// BROWN CELLS
		// TODO
	
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
		" Green:"  + cells[0].length.toString() + 
		" Yellow:" + cells[1].length.toString() + 
		" Orange:" + cells[2].length.toString() + 
		" Red:"    + cells[3].length.toString() + 
		" Brown:"  + cells[4].length.toString() + 
		" Dead:"   + cells[5].length.toString();
	world_view.putImageData(world,0,0);
	
	if (celllife_running)
	{
		setTimeout(live, 10);
	}
}