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