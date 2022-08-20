/*
Written by Georgi Olentsenko for CellLife project
Started 2020-07-29
*/

// Cell behaviour variables
var green_cell_max_energy = 200;
var green_cell_reproduce_energy = 100;

function cells_act()
{
	// GREEN CELL ACTIONS
	// 1. Grow by increasing energy
	// 2. Reproduce if the cell accumulated enough energy
	// 2.1. If there is space around reproduce as green
	// 2.2. If there is not enough space around give a chance to mutate to yellow
	// 3. There is a chance to die
	for (i = 0; i < cells[0].length; i++)
	{
		// Increase energy
		// TODO extra energy if there is a dead cell in the same spot
		if (cells[0][i].energy < green_cell_max_energy)
		{
			cells[0][i].energy += 1;
		}
		
		// Reproduce if there is enough energy
		if (cells[0][i].energy > green_cell_reproduce_energy)
		{
			// Search around for space without green cells
			// Tries in all directions
			space_found = true;
			x = cells[0][i].x+1;
			if (x > world_width-1) x = 0;
			y = cells[0][i].y;
			if (world_cells[y][x] == undefined) world_cells[y][x]=[];
			for (n = 0; n < world_cells[y][x].length; n++)
			{
				if (world_cells[y][x][n].type == 'g')
				{
					space_found = false;
					break;
				}
			}
			if (!space_found)
			{
				space_found = true;
				x = cells[0][i].x;
				y = cells[0][i].y+1;
				if (y > world_height-1) y = 0;
				if (world_cells[y][x] == undefined) world_cells[y][x]=[];
				for (n = 0; n < world_cells[y][x].length; n++)
				{
					if (world_cells[y][x][n].type == 'g')
					{
						space_found = false;
						break;
					}
				}
			}
			if (!space_found)
			{
				space_found = true;
				x = cells[0][i].x-1;
				if (x < 0) x = world_width-1;
				y = cells[0][i].y;
				if (world_cells[y][x] == undefined) world_cells[y][x]=[];
				for (n = 0; n < world_cells[y][x].length; n++)
				{
					if (world_cells[y][x][n].type == 'g')
					{
						space_found = false;
						break;
					}
				}
			}
			if (!space_found)
			{
				space_found = true;
				x = cells[0][i].x;
				y = cells[0][i].y-1;
				if (y < 0) y = world_height-1;
				if (world_cells[y][x] == undefined) world_cells[y][x]=[];
				for (n = 0; n < world_cells[y][x].length; n++)
				{
					if (world_cells[y][x][n].type == 'g')
					{
						space_found = false;
						break;
					}
				}
			}
			
			if (space_found)
			{
				// This cell looses energy on reproduction
				cells[0][i].energy -= 60;
				
				// Cell parameters
				var new_cell = {
					number: cell_total_number, 	// Cell number
					type: 'g',				// type of cell
					x: x,					// location x
					y: y,					// location y
					energy: 40
				};
				cell_total_number += 1;
				
				cells[0].push(new_cell);
				world_cells[new_cell.y][new_cell.x].push(new_cell);
			}
			// Chance to mutate
			else
			{
				mutate = Math.floor((Math.random() * 10000));
				
				if (mutate == 0)
				{
					// Cell parameters
					var new_y_cell = {
						number: cell_total_number, 	// Cell number
						type: 'y',				// type of cell
						x: cells[0][i].x,			// location x
						y: cells[0][i].y,			// location y
						energy: 50
					};
					cell_total_number += 1;
					
					cells[0].push(new_y_cell);
					world_cells[new_y_cell.y][new_y_cell.x].push(new_y_cell);
				}
			}
			
		}
		
		// Chance to die
		var death_chance = Math.floor((Math.random() * 10000));
		if (death_chance == 0)
		{
			cells[0][i].type = 'd';
			cells[5].push(cells[0][i])
			cells[0].splice(i,1);
			for (n = 0; n < world_cells[cells[0][i].y][cells[0][i].x].length; n++)
			{
				if (cells[0][i].number == world_cells[cells[0][i].y][cells[0][i].x][n].number)
				{
					world_cells[cells[0][i].y][cells[0][i].x][n].type = 'd';
					break;
				}
			}
		}
	}
	/*
	// YELLOW CELL ACTIONS
	// 1. Chance for yellow cell to eat a green cell
	// 2. Chance to reproduce
	for (i = 0; i < cells[1].length; i++)
	{
		
		// Search for green cells to eat
		for (n = 0; n < cells[0].length; n++)
		{
			if (cells[1][i].x == cells[0][n].x && cells[1][i].y == cells[0][n].y && i!==n)
			{
				// Chance to eat another cell
				var type = Math.floor((Math.random() * 10));
				if (type==0 || type==1)
				{
					cells[0].splice(n,1);
					// Smaller chance to reproduce
					if (type==0)
					{
						// Cell parameters
						var new_cell = {
							number: cell_total_number, 	// Cell number
							type: 'y',				// type of cell
							x: cells[1][i].x,		// location x
							y: cells[1][i].y,		// location y
							energy: 10
						};
						cell_total_number += 1;
						cells[1].push(new_cell);
					}
				}
				break;
			}
		}
		
		// Move randomly
		move_randomly = 1
		if (move_randomly){
			var direction = Math.floor((Math.random() * 4));
			switch(direction){
				case 0:
					cells[1][i].y += 1;
					if (cells[1][i].y >= world_height) cells[1][i].y -= world_height;
					break;
				case 1:
					cells[1][i].x += 1;
					if (cells[1][i].x >= world_width) cells[1][i].x -= world_width;
					break;
				case 2:
					cells[1][i].y -= 1;
					if (cells[1][i].y <= 0) cells[1][i].y += world_height;
					break;
				case 3:
					cells[1][i].x -= 1;
					if (cells[1][i].x <= 0) cells[1][i].x += world_width;
					break;
			}
		}
		
		// Chance to die
		var death_chance = Math.floor((Math.random() * 250));
		if (death_chance == 0)
		{
			cells[5].push(cells[1][i])
			cells[1].splice(i,1);
		}
	}*/
	/*
	// RED CELL ACTIONS
	// 1. Chance for red cell to eat a yellow cell
	// 2. Chance to reproduce
	for (i = 0; i < cells[3].length; i++)
	{
		// Chance to die
		var death_chance = Math.floor((Math.random() * 250));
		if (death_chance == 0)
		{
			cells[1].splice(i,1);
		}
		
		for (n = 0; n < cells[1].length; n++)
		{
			if (cells[3][i].x == cells[1][n].x && cells[3][i].y == cells[1][n].y)
			{
				// Chance to eat another cell
				var type = Math.floor((Math.random() * 10));
				if (type==0 || type==1)
				{
					cells[1].splice(n,1);
					// Smaller chance to reproduce
					if (type==0)
					{
						// Cell parameters
						var new_cell = {
							number: cell_total_number, 	// Cell number
							x: cells[3][i].x,		// location x
							y: cells[3][i].y,		// location y
							energy: 10
						};
						cell_total_number += 1;
						cells[3].push(new_cell);
					}
				}
				break;
			}
		}
		
		move_randomly = 1
		if (move_randomly){
			var direction = Math.floor((Math.random() * 4));
			switch(direction){
				case 0:
					cells[3][i].y += 1;
					if (cells[3][i].y >= world_height) cells[3][i].y -= world_height;
					break;
				case 1:
					cells[3][i].x += 1;
					if (cells[3][i].x >= world_width) cells[3][i].x -= world_width;
					break;
				case 2:
					cells[3][i].y -= 1;
					if (cells[3][i].y <= 0) cells[3][i].y += world_height;
					break;
				case 3:
					cells[3][i].x -= 1;
					if (cells[3][i].x <= 0) cells[3][i].x += world_width;
					break;
			}
		}
		
		// Chance to die
		var death_chance = Math.floor((Math.random() * 250));
		if (death_chance == 0)
		{
			cells[5].push(cells[3][i])
			cells[3].splice(i,1);
		}
	}*/
	
	// DEAD CELL ACTIONS
	// 1. Disolve over time
	// 2. If no energy left - remove
	for (i = 0; i < cells[5].length; i++)
	{
		// Simpify cell addressing
		this_cell = cells[5][i];
		
		// Decrease Cell energy
		this_cell.energy -= 1;
		
		// If no energy left, remove the cell
		if (this_cell.energy == 0)
		{	
			cells[5].splice(i,1);
			for (n = 0; n < world_cells[this_cell.y][this_cell.x].length; n++)
			{
				if (this_cell.number == world_cells[this_cell.y][this_cell.x][n].number)
				{
					world_cells[this_cell.y][this_cell.x].splice(n,1);
					break;
				}
			}
		}
	}
}

// Search around the cell
function search_around(this_cell, x, y, searched_type, distance){
	var result = new Array(4);
	result[0]=x;
	result[1]=y;
	result[2]=distance;	// distance
	result[3]=0;		// success
	
	// Check the current spot
	for (n = 0; n < world_cells[y][x].length; n++)
	{
		if (this_cell.number !== world_cells[y][x][n].number &&
			searched_type == world_cells[y][x][n].type)
		{
			// found
			result[3]=1; 
			return result;
		}
	}
	
	// Consider the positions around recursively
	for (i = distance-1; i > 0; i++){
		result = search_around(this_cell, x+1, y, searched_type, i);
		if (result[3] == 1){
			return result;
		}
		result = search_around(this_cell, x, y+1, searched_type, i);
		if (result[3] == 1){
			return result;
		}
		result = search_around(this_cell, x-1, y, searched_type, i);
		if (result[3] == 1){
			return result;
		}
		result = search_around(this_cell, x, y-1, searched_type, i);
		if (result[3] == 1){
			return result;
		}
	}
	return result;
}