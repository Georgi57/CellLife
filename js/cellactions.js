/*
Written by Georgi Olentsenko for CellLife project
Started 2020-07-29
*/

function cells_act()
{
	
	// GREEN CELL ACTIONS
	// 1. Don't move
	// 2. Chance to reproduce
	// 3. Chance to mutate to yellow or red
	// 4. Chance to die
	for (i = 0; i < cells[0].length; i++)
	{
		var reproduction_chance = Math.floor((Math.random() * 100));
		if (reproduction_chance == 0)
		{
			var direction = Math.floor((Math.random() * 4));
			switch(direction){
				case 0:
					cells[0][i].y += 1;
					if (cells[0][i].y >= world_height) cells[0][i].y -= world_height;
					break;
				case 1:
					cells[0][i].x += 1;
					if (cells[0][i].x >= world_width) cells[0][i].x -= world_width;
					break;
				case 2:
					cells[0][i].y -= 1;
					if (cells[0][i].y <= 0) cells[0][i].y += world_height;
					break;
				case 3:
					cells[0][i].x -= 1;
					if (cells[0][i].x <= 0) cells[0][i].x += world_width;
					break;
			}
			
			// Cell parameters
			var new_cell = {
				number: cell_total_number, 	// Cell number
				x: cells[0][i].x,		// location x
				y: cells[0][i].y,		// location y
				energy: 100
			};
			
			// Mutation chance
			var type = Math.floor((Math.random() * 10000));
			if (type==0) cells[3].push(new_cell);
			else if (type==1 || type==2) cells[1].push(new_cell);
			else cells[0].push(new_cell);
			
			cell_total_number += 1;
		}
		
		// Chance to die
		var death_chance = Math.floor((Math.random() * 400));
		if (death_chance == 0)
		{
			cells[5].push(cells[0][i])
			cells[0].splice(i,1);
		}
	}
	
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
	}
	
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
	}
	
	// DEAD CELL ACTIONS
	// 1. Disolve over time
	for (i = 0; i < cells[5].length; i++)
	{
		cells[5][i].energy -= 1;
		if (cells[5][i].energy == 0)
		{	
			cells[5].splice(i,1);
		}
	}
}