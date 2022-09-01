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
		energy: 100
	};
	world_cells[1][1] = [];
	world_cells[1][1].push(new_cell);
	
	var new_cell = {
		number: 1, 	// Cell number
		type: 'g',	// type of cell
		x: 51,		// location x
		y: 50,		// location y
		energy: 100
	};
	world_cells[51][50] = [];
	world_cells[51][50].push(new_cell);
	
	var new_cell = {
		number: 2, 	// Cell number
		type: 'g',	// type of cell
		energy: 100
	};
	world_cells[world_height-2][world_width-2] = [];
	world_cells[world_height-2][world_width-2].push(new_cell);
	
	cell_total_number = 3;
}


// Function to look for anything out of place
function check_world_cells_for_issues()
{
	for (x = 0; x < world_width; x++)
	{
		for (y = 0; y < world_height; y++)
		{
			// Check if the location is defined at all
			if (world_cells[y][x] == undefined) continue;
			
			number_of_green_cells_in_this_location = 0;
			number_of_black_cells_in_this_location = 0;
			
			// Go throguh cells placed in this location
			for (i = world_cells[y][x].length-1; i >= 0; i--)
			{
				// Check for multiple green cells in one location
				if (world_cells[y][x][i].type == 'g')
				{
					number_of_green_cells_in_this_location += 1;
					if (number_of_green_cells_in_this_location > 1)
					{
						console.log("More than one green cells at", x, y, number_of_green_cells_in_this_location);
					}
				}
				
				// Check for multiple green cells in one location
				if (world_cells[y][x][i].type == 'd')
				{
					number_of_black_cells_in_this_location += 1;
					if (number_of_black_cells_in_this_location > 1)
					{
						console.log("More than one black cells at", x, y, number_of_black_cells_in_this_location);
					}
				}
			}
		}
	}
}