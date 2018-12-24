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

var cells_to_delete = [];

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
		world.data[i+0]=50; // red
		world.data[i+1]=50; // green
		world.data[i+2]=255; // blue
		world.data[i+3]=200;
	}
	world_view.putImageData(world,0,0);
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

function cells_move_randomly()
{
	for (i = 0; i < cells.length; i++)
	{
		if (cells[i].type !== 'd'){
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
		
		// Chance for green cells to reproduce
		if (cells[i].type == 'g')
		{
			var reproduction_chance = Math.floor((Math.random() * 200));
			if (reproduction_chance == 0)
			{
				// Cell parameters
				var new_cell = {
					number: cell_total_number, 	// Cell number
					x: cells[i].x,		// location x
					y: cells[i].y,		// location y
					type: 'g'
				};
				
				var type = Math.floor((Math.random() * 100));
				if (type==0) new_cell.type = 'r';
				if (type==1) new_cell.type = 'y';
				
				cell_total_number += 1;
				cells.push(new_cell);
			}
		}
		
		// Chance for red cell to eat another cell and reproduce
		if (cells[i].type == 'r')
		{
			var n;
			for (n = 0; n < cells.length; n++)
			{
				if (cells[i].x == cells[n].x && cells[i].y == cells[n].y && i!==n && cells[i].type!=='d' && i!==n)
				{
					var type = Math.floor((Math.random() * 10));
					if (type==0) cells[n].type = 'r';
					else if (type==1) cells[n].type = 'y';
					else cells_to_delete.push(n);
					break;
				}
			}
		}
		
		// Yellow
		if (cells[i].type == 'y')
		{
			var n;
			for (n = 0; n < cells.length; n++)
			{
				if (cells[i].x == cells[n].x && cells[i].y == cells[n].y && i!==n && cells[i].type=='d')
				{
					var type = Math.floor((Math.random() * 10));
					if (type==0) cells[n].type = 'y';
					else if (type==1) cells[n].type = 'g';
					else cells_to_delete.push(n);
					break;
				}
			}
		}
		
		// Chance for any cell to die
		var death_chance = Math.floor((Math.random() * 250));
		if (death_chance == 0)
		{
			cells[i].type = 'd';
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
	
	world_view.putImageData(world,0,0);
	
	if (celllife_running)
	{
		setTimeout(live, 10);
	}
}