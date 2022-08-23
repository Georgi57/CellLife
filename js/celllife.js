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
var world_time = 0;
var celllife_delay = 10;
var cell_total_number = 0;

var celllife_created = false;

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
		
		if (!celllife_created)
		{
			// Create new world
			create_new_world();
			create_life();
			//create_test_cells();
			celllife_created = true;
		}
		live();
	}
}

function reset_world()
{
	// Recreate the world and cells
	create_new_world();
	create_life();
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
		new_cell = {
			number: cell_total_number, 	// Cell number
			type: 'g',	// type of cell
			energy: 10,
			last_action: world_time
		};
		
		cell_total_number += 1;
		new_x = Math.floor((Math.random() * world_width));
		new_y = Math.floor((Math.random() * world_height));
		
		// Only green cells are created
		world_cells[new_y][new_x] = [];
		world_cells[new_y][new_x].push(new_cell);
	}
}

function live()
{
	var i;
	var world_location;
	
	// Display current state in the order of visibility of cells
	
	// Go through all world locations
	for (x = 0; x < world_width; x++)
	{
		for (y = 0; y < world_height; y++)
		{
			found_green = false;
			found_yellow = false;
			found_orange = false;
			found_red = false;
			found_brown = false;
			found_dead = false;
			
			// Check if the location is defined at all
			if (world_cells[y][x] == undefined) continue;
			
			// Go throguh cells placed in this location and check for cell types
			for (i = world_cells[y][x].length-1; i >= 0; i--)
			{
				if (world_cells[y][x][i].type == 'g') found_green = true;
				else if (world_cells[y][x][i].type == 'y') found_yellow = true;
				else if (world_cells[y][x][i].type == 'o') found_orange = true;
				else if (world_cells[y][x][i].type == 'r') found_red = true;
				else if (world_cells[y][x][i].type == 'b') found_brown = true;
				else if (world_cells[y][x][i].type == 'd') found_dead = true;
			}
			
			// Visualize the cells according to priority
			if (found_red)
			{
				world_location = (y*world_width + x)*4;
				world.data[world_location+0]=150;
				world.data[world_location+1]=0;
				world.data[world_location+2]=0;
			}
			else if (found_yellow)
			{
				world_location = (y*world_width + x)*4;
				world.data[world_location+0]=200;
				world.data[world_location+1]=200;
				world.data[world_location+2]=0;
			}
			else if (found_green)
			{
				world_location = (y*world_width + x)*4;
				world.data[world_location+0]=0;
				world.data[world_location+1]=150;
				world.data[world_location+2]=0;
			}
			else if (found_dead)
			{
				world_location = (y*world_width + x)*4;
				world.data[world_location+0]=0;
				world.data[world_location+1]=0;
				world.data[world_location+2]=0;
			}
		}
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
		" Green:"  + green_count + 
		" Yellow:" + yellow_count +
		" Orange:" + 0 +
		" Red:"    + 0 + 
		" Brown:"  + 0 +
		" Dead:"   + dead_count;
	world_view.putImageData(world,0,0);
	
	if (celllife_running)
	{
		setTimeout(live, celllife_delay);
	}
}