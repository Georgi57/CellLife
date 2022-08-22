/*
Written by Georgi Olentsenko for CellLife project
Started 2020-07-29
*/

// Cell counts
var green_count = 0;
var yellow_count = 0;
var dead_count = 0;

// Cell behaviour variables
var green_cell_max_energy = 200;
var green_cell_reproduce_energy = 100;

var yellow_cell_max_energy = 1000;
var yellow_cell_reproduce_energy = 500;

function cells_act()
{
	// One cycle increases world time
	world_time += 1;
	
	// Reset cell counts
	green_count = 0;
	yellow_count = 0;
	dead_count = 0;
	
	// Go through all world locations
	for (x = 0; x < world_width; x++)
	{
		for (y = 0; y < world_height; y++)
		{
			// Check if the location is defined at all
			if (world_cells[y][x] == undefined) continue;
			
			// Go throguh cells placed in this location
			for (i = world_cells[y][x].length-1; i >= 0; i--)
			{
				// Simplify cell addressing
				var this_cell = world_cells[y][x][i];
				
				
				
				// GREEN CELL ACTIONS
				// 1. Grow by increasing energy
				// 2. Reproduce if the cell accumulated enough energy
				// 2.1. If there is space around reproduce as green
				// 2.2. If there is not enough space around give a chance to mutate to yellow
				// 3. There is a chance to die
				if (this_cell.type == 'g')
				{
					green_count += 1;
					
					// Increase energy
					if (this_cell.energy < green_cell_max_energy)
					{
						this_cell.energy += 1;
					}
					
					// Reproduce if there is enough energy
					if (this_cell.energy > green_cell_reproduce_energy)
					{
						// Search around for space without green cells
						// Tries in all directions
						space_found = true;
						new_x = x+1;
						if (new_x > world_width-1) new_x = 0;
						new_y = y;
						if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
						for (n = 0; n < world_cells[new_y][new_x].length; n++)
						{
							if (world_cells[new_y][new_x][n].type == 'g')
							{
								space_found = false;
								break;
							}
						}
						if (!space_found)
						{
							space_found = true;
							new_x = x;
							new_y = y+1;
							if (new_y > world_height-1) new_y = 0;
							if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
							for (n = 0; n < world_cells[new_y][new_x].length; n++)
							{
								if (world_cells[new_y][new_x][n].type == 'g')
								{
									space_found = false;
									break;
								}
							}
						}
						if (!space_found)
						{
							space_found = true;
							new_x = x-1;
							if (new_x < 0) new_x = world_width-1;
							new_y = y;
							if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
							for (n = 0; n < world_cells[new_y][new_x].length; n++)
							{
								if (world_cells[new_y][new_x][n].type == 'g')
								{
									space_found = false;
									break;
								}
							}
						}
						if (!space_found)
						{
							space_found = true;
							new_x = x;
							new_y = y-1;
							if (new_y < 0) new_y = world_height-1;
							if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
							for (n = 0; n < world_cells[new_y][new_x].length; n++)
							{
								if (world_cells[y][new_x][n].type == 'g')
								{
									space_found = false;
									break;
								}
							}
						}
						
						if (space_found)
						{
							// This cell looses energy on reproduction
							this_cell.energy -= 60;
							
							// Cell parameters
							var new_cell = {
								number: cell_total_number, 	// Cell number
								type: 'g',					// Type of cell
								energy: 40,
								last_action: world_time
							};
							cell_total_number += 1;
							
							world_cells[new_y][new_x].push(new_cell);
						}
						// Chance to mutate
						else
						{
							mutate = Math.floor((Math.random() * 100000));
							
							if (mutate == 0)
							{
								console.log(mutate, "mutation!")
								// Cell parameters
								var new_y_cell = {
									number: cell_total_number, 	// Cell number
									type: 'y',				// type of cell
									energy: 40,
									last_action: world_time
								};
								cell_total_number += 1;
								
								world_cells[y][x].push(new_y_cell);
							}
						}
						
					}
					
					// Chance to die
					var death_chance = Math.floor((Math.random() * 150));
					if (death_chance == 0)
					{
						this_cell.type = 'd';
					}
				}
				
				
				
				// YELLOW CELL ACTIONS
				// 1. Yellow cells get energy by eating green cells
				// 2. Chance to reproduce
				if (this_cell.type == 'y' && this_cell.last_action !== world_time)
				{
					this_cell.last_action = world_time;
					yellow_count += 1;
					console.log(this_cell.number, x, y, this_cell.energy);
					
					// Go throguh cells placed in this location
					for (j = world_cells[y][x].length-1; j >= 0; j--)
					{
						if (world_cells[y][x][j].type == 'g')
						{
							// Chance to eat another cell
							var eat = Math.floor((Math.random() * 100));
							if (eat>=0 && eat<=49)
							{
								this_cell.energy += world_cells[y][x][j].energy;
								world_cells[y][x].splice(j,1);
							}
							break;
						}
					}
					
					// Reproduce if there is enough energy
					if (this_cell.energy > yellow_cell_reproduce_energy)
					{
						// This cell looses energy on reproduction
						this_cell.energy -= 300;
						
						// Cell parameters
						var new_cell = {
							number: cell_total_number,
							type: 'y',
							energy: 50,
							last_action: world_time
						};
						cell_total_number += 1;
						
						world_cells[y][x].push(new_cell);
					}
					else
					{
						
						// Cell loses energy on movement
						this_cell.energy -= 1;
						
						var direction = Math.floor((Math.random() * 4));
						switch(direction){
							case 0:
								new_y += 1;
								if (new_y >= world_height) new_y -= world_height;
								break;
							case 1:
								new_x += 1;
								if (new_x >= world_width) new_x -= world_width;
								break;
							case 2:
								new_y -= 1;
								if (new_y < 0) new_y += world_height;
								break;
							case 3:
								new_x -= 1;
								if (new_x < 0) new_x += world_width;
								break;
						}
						
						// Add cell to the new location
						if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
						world_cells[new_y][new_x].push(this_cell);
						// Remove cell from the current location
						world_cells[y][x].splice(i,1);
					}
					
					// Chance to die
					var death_chance = Math.floor((Math.random() * (100+this_cell.energy)));
					if (death_chance == 0)
					{
						this_cell.type = 'd';
					}
				}
				
				
				
				// DEAD CELL ACTIONS
				// 1. Disolve over time
				// 2. If no energy left - remove
				if (this_cell.type == 'd')
				{
					dead_count += 1;
					
					// Decrease Cell energy
					this_cell.energy -= 1;
					
					// If no energy left, remove the cell
					world_cells[y][x].splice(i,1);
				}
			}
		}
	}
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