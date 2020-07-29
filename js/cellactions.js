/*
Written by Georgi Olentsenko for CellLife project
Started 2020-07-29
*/

function cells_act()
{
	cells_counts[0]=0;
	cells_counts[1]=0;
	cells_counts[2]=0;
	cells_counts[3]=0;
	
	for (i = 0; i < cells.length; i++)
	{
		// Cell count
		if (cells[i].type == 'g') cells_counts[0]++;
		else if (cells[i].type == 'r') cells_counts[1]++;
		else if (cells[i].type == 'y') cells_counts[2]++;
		else cells_counts[3]++;
		
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
				if (cells[i].x == cells[n].x && cells[i].y == cells[n].y && i!==n && cells[n].type=='d')
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
		
		if (cells[i].type !== 'd'){
			var move_randomly = 1;
			
			// Yellow search dead cells
			if (cells[i].type == 'y'){
				var target = search_around(cells[i].x, cells[i].y, 10);
				
				if (target[2]==1){
					if (target[0]>cells[i].x){
						cells[i].x += 1;
						if (cells[i].x >= world_width) cells[i].x -= world_width;
						move_randomly = 0;
					}
					else if (target[0]<cells[i].x){
						cells[i].x -= 1;
						if (cells[i].x <= 0) cells[i].x += world_width;
						move_randomly = 0;
					}
				}
			}
			
			if (move_randomly){
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
		}
	}
}