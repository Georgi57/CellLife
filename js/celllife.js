/*
Written by Georgi Olentsenko for CellLife project
Started 2018-09-08
*/

var celllife_running = false;

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
	}
}