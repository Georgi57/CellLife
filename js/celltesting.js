/*
Written by Georgi Olentsenko for CellLife project
Started 2022-08-21
*/

// Only used during testing. Some functions could hog the process.

// Function to create test cells
function create_test_cells()
{
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
	
	cell_total_number = 4;
}

// Function to check whether cell list and world cell locations content is consitent
function check_cell_consistency()
{
	var found_cell = false;
	
	// First check cell lists and see that the world still contains them
	for (i = 0; i < cells.length; i++)
	{
		for (j = 0; j < cells[i].length; j++)
		{
			found_cell = false;
			if (world_cells[cells[i][j].y][cells[i][j].x] !== undefined)
			{
				for (n = 0; n < world_cells[cells[i][j].y][cells[i][j].x].length; n++)
				{
					if (cells[i][j].number == world_cells[cells[i][j].y][cells[i][j].x][n].number)
					{
						found_cell = true;
						break;
					}
				}
			}
			
			if (!found_cell)
			{
				console.log(cells[i][j], "not found in world");
			}
		}
	}
	
	// Then check that the cell list still contains the cells found in the world
	for (i = 0; i < world_cells.length; i++)
	{
		for (j = 0; j < world_cells[i].length; j++)
		{
			if (world_cells[i][j] !== undefined)
			{
				for (n = 0; n < world_cells[i][j].length; n++)
				{
					this_cell = world_cells[i][j][n];
					found_cell = false;
					
					if (this_cell.type == 'g')
					{
						for (k = 0; k < cells[0].length; k++)
						{
							if (this_cell.number == cells[0][k].number)
							{
								found_cell = true;
								break;
							}
						}
					}
					
					if (this_cell.type == 'y')
					{
						for (k = 0; k < cells[1].length; k++)
						{
							if (this_cell.number == cells[1][k].number)
							{
								found_cell = true;
								break;
							}
						}
					}
					
					if (this_cell.type == 'd')
					{
						for (k = 0; k < cells[5].length; k++)
						{
							if (this_cell.number == cells[5][k].number)
							{
								found_cell = true;
								break;
							}
						}
					}
					
					if (!found_cell)
					{
						console.log(this_cell, "not found in the cells list");
					}
				}
			}
		}
	}
}