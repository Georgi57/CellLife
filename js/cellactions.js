/*
Written by Georgi Olentsenko for CellLife project
Started 2020-07-29
*/

// Cell counts
var green_count = 0;
var yellow_count = 0;
var brown_count = 0;
var red_count = 0;
var dead_count = 0;

// Cell behaviour variables
var green_cell_chance_die_base = 300;
var green_cell_max_energy = 200;
var green_cell_reproduce_energy = 100;
var green_cell_frustration_energy = 190;

var yellow_cell_max_energy = 1000;
var yellow_cell_reproduce_energy = 500;
var yellow_cell_frustration_energy = 30;

var brown_cell_max_energy = 1000;
var brown_cell_reproduce_energy = 500;
var brown_cell_frustration_energy = 30;

var red_cell_reproduce_energy = 2000;
var red_cell_frustration_energy = 100;

var dead_cell_degrade_time = 3;
// There is not limit to energy stored in the dead

function cells_act()
{
	// One cycle increases world time
	world_time += 1;
	
	// Reset cell counts
	green_count = 0;
	yellow_count = 0;
	brown_count = 0;
	red_count = 0;
	dead_count = 0;
	
	// Placeholder for checks
	//check_world_cells_for_issues();
	
	// Go through all world locations
	for (x = 0; x < world_width; x++)
	{
		for (y = 0; y < world_height; y++)
		{
			// Check if the location is defined at all
			if (world_cells[y][x] == undefined) continue;
			
			// Go throguh cells placed in this location
			for (let i = 0; i < world_cells[y][x].length; i++)
			{
				// GREEN CELL ACTIONS
				// 1. The is a chance to die
				// 2. Grow by increasing energy
				// 3. Reproduce if the cell accumulated enough energy
				// 3.1. If there is space around reproduce as green
				// 3.2. If there is not enough space around give a chance to mutate to yellow or brown
				if (world_cells[y][x][i].type == 'g')
				{
					green_count += 1;
					
					// Chance to die
					let cell_turned_dead = cell_death_chance(y, x, i, green_cell_chance_die_base);
					// If cell died and energy transferred to an existing cell - move index
					if (cell_turned_dead[0] && !cell_turned_dead[1]) i -= 1;
					if (cell_turned_dead[0]) continue;
					
					// Increase energy
					if (world_cells[y][x][i].energy < green_cell_max_energy)
					{
						world_cells[y][x][i].energy += 1;
					}
					
					// Reproduce if there is enough energy
					if (world_cells[y][x][i].energy > green_cell_reproduce_energy)
					{
						// Search around for space without green cells
						new_cell_location = find_close_by(y, x, 'g', false);
						
						if (new_cell_location.length !== 0)
						{
							// This cell looses energy on reproduction
							world_cells[y][x][i].energy = Math.floor(world_cells[y][x][i].energy/3);
							
							// Cell parameters
							new_cell = {
								number: cell_total_number, 	// Cell number
								type: 'g',					// Type of cell
								energy: world_cells[y][x][i].energy,
								birth: world_time,
								last_action: world_time
							};
							cell_total_number += 1;
							
							world_cells[new_cell_location[0]][new_cell_location[1]].push(new_cell);
						}
						// Chance to mutate
						else if (world_cells[y][x][i].energy > green_cell_frustration_energy)
						{
							cell_mutation_chance(y, x, i, true, 1000000);
						}
					}
				}
				
				
				
				// YELLOW CELL ACTIONS
				// 1. Yellow cells get energy by eating green cells
				// 2. Chance to reproduce
				else if (world_cells[y][x][i].type == 'y' && world_cells[y][x][i].last_action !== world_time)
				{
					world_cells[y][x][i].last_action = world_time;
					yellow_count += 1;
					
					// Chance to die
					let cell_turned_dead = cell_death_chance(y, x, i, 100+world_cells[y][x][i].energy/10);
					// If cell died and energy transferred to an existing cell - move index
					if (cell_turned_dead[0] && !cell_turned_dead[1]) i -= 1;
					if (cell_turned_dead[0]) continue;

					// Chance to mutate when frustrated by the lack of food
					if (world_cells[y][x][i].energy < yellow_cell_frustration_energy)
					{
						cell_mutation_chance(y, x, i, false, 1000);
					}
					
					// Reproduce if there is enough energy
					if (world_cells[y][x][i].energy > yellow_cell_reproduce_energy)
					{
						// This cell looses energy on reproduction
						world_cells[y][x][i].energy -= 300;
						
						// Cell parameters
						new_cell = {
							number: cell_total_number,
							type: 'y',
							energy: 50,
							birth: world_time,
							last_action: world_time
						};
						cell_total_number += 1;
						
						world_cells[y][x].push(new_cell);
					}
					else
					{
						
						// Go throguh cells placed in this location to see if the cell can eat
						yellow_found_food = false;
						for (j = world_cells[y][x].length-1; j >= 0; j--)
						{
							if (world_cells[y][x][j].type == 'g')
							{
								// Chance to eat another cell
								var eat = Math.floor((Math.random() * 100));
								if (eat>=0 && eat<=49)
								{
									yellow_found_food = true;
									world_cells[y][x][i].energy += world_cells[y][x][j].energy;
									world_cells[y][x].splice(j,1);
								}
								break;
							}
						}
						
						if (!yellow_found_food)
						{
							// Cell loses energy on movement
							world_cells[y][x][i].energy -= 1;
							
							var direction = Math.floor((Math.random() * 4));
							switch(direction){
								case 0:
									new_y = y + 1;
									if (new_y >= world_height) new_y -= world_height;
									new_x = x;
									break;
								case 1:
									new_x = x + 1;
									if (new_x >= world_width) new_x -= world_width;
									new_y = y;
									break;
								case 2:
									new_y = y - 1;
									if (new_y < 0) new_y += world_height;
									new_x = x;
									break;
								case 3:
									new_x = x - 1;
									if (new_x < 0) new_x += world_width;
									new_y = y;
									break;
							}
							
							// Add cell to the new location
							if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
							world_cells[new_y][new_x].push(world_cells[y][x][i]);
							// Remove cell from the current location
							world_cells[y][x].splice(i,1);
						}
					}
				}
				
				
				
				// BROWN CELL ACTIONS
				// 1. Brown cells get energy by eating black cells
				// 2. Chance to reproduce
				else if (world_cells[y][x][i].type == 'b' && world_cells[y][x][i].last_action !== world_time)
				{
					world_cells[y][x][i].last_action = world_time;
					brown_count += 1;
					
					// Chance to die
					let cell_turned_dead = cell_death_chance(y, x, i, 100+world_cells[y][x][i].energy/10);
					// If cell died and energy transferred to an existing cell - move index
					if (cell_turned_dead[0] && !cell_turned_dead[1]) i -= 1;
					if (cell_turned_dead[0]) continue;
					
					// Chance to mutate when frustrated by the lack of food
					if (world_cells[y][x][i].energy < brown_cell_frustration_energy)
					{
						cell_mutation_chance(y, x, i, false, 1000);
					}
					
					// Reproduce if there is enough energy
					if (world_cells[y][x][i].energy > brown_cell_reproduce_energy)
					{
						// This cell looses energy on reproduction
						world_cells[y][x][i].energy -= 300;
						
						// Cell parameters
						new_cell = {
							number: cell_total_number,
							type: 'b',
							energy: 50,
							birth: world_time,
							last_action: world_time
						};
						cell_total_number += 1;
						
						world_cells[y][x].push(new_cell);
					}
					else
					{
						
						// Go throguh cells placed in this location to see if the cell can eat
						brown_found_food = false;
						for (j = world_cells[y][x].length-1; j >= 0; j--)
						{
							if (world_cells[y][x][j].type == 'd')
							{
								// Chance to eat another cell
								var eat = Math.floor((Math.random() * 100));
								if (eat>=0 && eat<=49)
								{
									brown_found_food = true;
									world_cells[y][x][i].energy += world_cells[y][x][j].energy;
									world_cells[y][x].splice(j,1);
								}
								break;
							}
						}
						
						if (!brown_found_food)
						{
							// Cell loses energy on movement
							world_cells[y][x][i].energy -= 1;
							
							var direction = Math.floor((Math.random() * 4));
							switch(direction){
								case 0:
									new_y = y + 1;
									if (new_y >= world_height) new_y -= world_height;
									new_x = x;
									break;
								case 1:
									new_x = x + 1;
									if (new_x >= world_width) new_x -= world_width;
									new_y = y;
									break;
								case 2:
									new_y = y - 1;
									if (new_y < 0) new_y += world_height;
									new_x = x;
									break;
								case 3:
									new_x = x - 1;
									if (new_x < 0) new_x += world_width;
									new_y = y;
									break;
							}
							
							// Add cell to the new location
							if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
							world_cells[new_y][new_x].push(world_cells[y][x][i]);
							// Remove cell from the current location
							world_cells[y][x].splice(i,1);
						}
					}
				}
				
				
				
				// RED CELL ACTIONS
				// 1. Chance for red cell to eat a yellow or brown cell
				// 2. Chance to reproduce
				else if (world_cells[y][x][i].type == 'r' && world_cells[y][x][i].last_action !== world_time)
				{
					world_cells[y][x][i].last_action = world_time;
					red_count += 1;
					
					// Chance to die
					let cell_turned_dead = cell_death_chance(y, x, i, 100+world_cells[y][x][i].energy/10);
					// If cell died and energy transferred to an existing cell - move index
					if (cell_turned_dead[0] && !cell_turned_dead[1]) i -= 1;
					if (cell_turned_dead[0]) continue;
					
					// Chance to mutate when frustrated by the lack of food
					if (world_cells[y][x][i].energy < red_cell_frustration_energy)
					{
						cell_mutation_chance(y, x, i, false, 1000);
					}
					
					// Reproduce if there is enough energy
					if (world_cells[y][x][i].energy > red_cell_reproduce_energy)
					{
						// This cell looses energy on reproduction
						world_cells[y][x][i].energy -= 300;
						
						// Cell parameters
						new_cell = {
							number: cell_total_number,
							type: 'r',
							energy: 50,
							birth: world_time,
							last_action: world_time
						};
						cell_total_number += 1;
						
						world_cells[y][x].push(new_cell);
					}
					else
					{
						
						// Go throguh cells placed in this location to see if the cell can eat
						red_found_food = false;
						for (j = world_cells[y][x].length-1; j >= 0; j--)
						{
							if (world_cells[y][x][j].type == 'y' || world_cells[y][x][j].type == 'b')
							{
								// Chance to eat another cell
								var eat = Math.floor((Math.random() * 100));
								if (eat>=0 && eat<=19)
								{
									red_found_food = true;
									world_cells[y][x][i].energy += world_cells[y][x][j].energy;
									world_cells[y][x].splice(j,1);
								}
								break;
							}
						}
						
						if (!red_found_food)
						{
							// Cell loses energy on movement
							world_cells[y][x][i].energy -= 1;
							
							var direction = Math.floor((Math.random() * 4));
							switch(direction){
								case 0:
									new_y = y + 1;
									if (new_y >= world_height) new_y -= world_height;
									new_x = x;
									break;
								case 1:
									new_x = x + 1;
									if (new_x >= world_width) new_x -= world_width;
									new_y = y;
									break;
								case 2:
									new_y = y - 1;
									if (new_y < 0) new_y += world_height;
									new_x = x;
									break;
								case 3:
									new_x = x - 1;
									if (new_x < 0) new_x += world_width;
									new_y = y;
									break;
							}
							
							// Add cell to the new location
							if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
							world_cells[new_y][new_x].push(world_cells[y][x][i]);
							// Remove cell from the current location
							world_cells[y][x].splice(i,1);
						}
					}
				}
				
				
				
				// DEAD CELL ACTIONS
				// 1. Degrade over time
				// 2. If no energy left - remove
				else if (world_cells[y][x][i].type == 'd')
				{
					dead_count += 1;
					
					// Decrease cell energy over longer time than green cells grow
					if (world_time - world_cells[y][x][i].last_action > dead_cell_degrade_time)
					{
						world_cells[y][x][i].energy -= 1;
						world_cells[y][x][i].last_action = world_time;
					}
					
					// If no energy left, remove the cell
					if (world_cells[y][x][i].energy <= 0)
					{
						world_cells[y][x].splice(i,1);
					}
				}
			}
		}
	}
}



// Search close by
function find_close_by(y, x, searched_type, present){
	random_direction = Math.floor((Math.random() * 4));
	
	for (i=0; i<4;i++)
	{
		direction = i + random_direction;
		if (direction >= 4) direction - 4;
		cell_type_present = false;
		switch (direction)
		{
			case 0:
			// EAST
			new_x = x+1;
			if (new_x > world_width-1) new_x = 0;
			new_y = y;
			
			if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
			for (n = 0; n < world_cells[new_y][new_x].length; n++)
			{
				if (world_cells[new_y][new_x][n].type == searched_type)
				{
					if (present) return [new_y, new_x];
					else cell_type_present = true;
				}
			}
			if (!cell_type_present) return [new_y, new_x];
			break;
			case 1:
			// SOUTH
			new_x = x;
			new_y = y+1;
			if (new_y > world_height-1) new_y = 0;
			if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
			for (n = 0; n < world_cells[new_y][new_x].length; n++)
			{
				if (world_cells[new_y][new_x][n].type == searched_type)
				{
					if (present) return [new_y, new_x];
					else cell_type_present = true;
				}
			}
			if (!cell_type_present) return [new_y, new_x];
			break;
			case 2:
			// WEST
			new_x = x-1;
			if (new_x < 0) new_x = world_width-1;
			new_y = y;
			if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
			for (n = 0; n < world_cells[new_y][new_x].length; n++)
			{
				if (world_cells[new_y][new_x][n].type == searched_type)
				{
					if (present) return [new_y, new_x];
					else cell_type_present = true;
				}
			}
			if (!cell_type_present) return [new_y, new_x];
			break;
			default:
			// NORTH
			new_x = x;
			new_y = y-1;
			if (new_y < 0) new_y = world_height-1;
			if (world_cells[new_y][new_x] == undefined) world_cells[new_y][new_x]=[];
			for (n = 0; n < world_cells[new_y][new_x].length; n++)
			{
				if (world_cells[new_y][new_x][n].type == searched_type)
				{
					if (present) return [new_y, new_x];
					else cell_type_present = true;
				}
			}
			if (!cell_type_present) return [new_y, new_x];
		}
		
	}
	return [];
}



// A chance for a cell to die
// Returns whether cell died and whether body turned dead type
function cell_death_chance(y, x, i, chance)
{
	// Chance to die
	let death_chance = Math.floor((Math.random() * chance));
	if (death_chance == 0)
	{
		// Check if there is a dead cell already in this location
		let dead_cell_at_this_location_exists = false;
		for (let j = 0; j < world_cells[y][x].length; j++)
		{
			if (world_cells[y][x][j].type == 'd')
			{
				dead_cell_at_this_location_exists = true;
				world_cells[y][x][j].energy += world_cells[y][x][i].energy;
				world_cells[y][x].splice(i,1);
				return [true, false];
			}
		}
		// In case there is not dead cell, the green cell turns dead
		if (!dead_cell_at_this_location_exists)
		{
			world_cells[y][x][i].type = 'd';
			return [true, true];
		}
	}
	return [false, false];
}



// Chance to mutate from frustration
// One in a million chance of mutation
function cell_mutation_chance(y, x, i, create_new_cell, chance)
{
	// Check for mutation options - possible food around
	food_for_yellow = false;
	food_for_brown = false;
	food_for_red = false;
	for (let j = 0; j < world_cells[y][x].length; j++)
	{
		if 		(world_cells[y][x][j].type == 'g') food_for_yellow = true;
		else if (world_cells[y][x][j].type == 'y') food_for_red = true;
		else if (world_cells[y][x][j].type == 'b') food_for_red = true;
		else if (world_cells[y][x][j].type == 'r') food_for_red = true;
		else if (world_cells[y][x][j].type == 'd') food_for_brown = true;
	}
	
	// Only mutate if there is something around to eat
	if (food_for_yellow || food_for_brown || food_for_red)
	{
		// One in a million
		let mutate = Math.floor((Math.random() * chance));
		
		new_mutated_cell = {
				number: cell_total_number,
				type: 'n',
				energy: 0,
				birth: world_time,
				last_action: world_time
		};
		
		if (mutate == 0 && food_for_yellow)
		{
			new_mutated_cell.type = 'y';
		}
		else if (mutate == 1 && food_for_brown)
		{
			new_mutated_cell.type = 'b';
		}
		else if (mutate == 2 && food_for_red)
		{
			new_mutated_cell.type = 'r';
		}
		else return;
		
		// Create new cell
		if (create_new_cell)
		{
			world_cells[y][x][i].energy = Math.floor(world_cells[y][x][i].energy/3);
			new_mutated_cell.energy = world_cells[y][x][i].energy;
			cell_total_number += 1;
			world_cells[y][x].push(new_mutated_cell);
		}
		// Existing cell mutates to eat different food
		else
		{
			world_cells[y][x][i].type = new_mutated_cell.type;
		}
	}
}