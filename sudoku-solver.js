function isLegal(grid, position, value) {
	//find row number
	var puzzelSize = 81;
	var gridSize = 9;
	
	var rowNumber = Math.floor(position/gridSize);
	
	//search row
	var startRow = rowNumber * gridSize;
	for(var a = startRow; a < startRow + 9; a++) {
		if (value == grid[a]) {
			return false;
		}
	}
	
	//search column
	var startCol = position - (rowNumber * 9);
	for(var a = startCol; a < puzzelSize; a += 9) {
		if(value == grid[a]) {
			return false;
		}
	}
	
	//search remaining boxes in square
	startRow = Math.floor( rowNumber / 3);
	startCol = Math.floor( startCol/ 3);
	var startSquare = (startRow * 27) + (startCol * 3);
	for(var a = startSquare; a < startSquare + 21 ; a +=9) {
		for(var b = 0; b < 3; b++) {
			if(value == grid[a + b]) {
				return false;
			}
		}
	}
	return true;
}

function solve(grid, position)
{
	if( position > 80 ) {
		// Solution found
		updateDisplay(grid);
		logPrint(grid);
	    return
	}
	// If the cell is not empty, continue with the next cell
	if( grid[position] != 0)
	   solve(grid,position + 1) ;
	else
	{
	   // Find a valid number for the empty cell
	   for( var num = 1; num < 10; num++ )
	   {
		  if( isLegal(grid, position, num))
		  {
			 grid[position] = num;
			 //printf ("position = %d = %d\n",position,num);

			 // Delegate work on the next cell to a recursive call
			 solve(grid,position + 1);
		  }
	   }
	   // No valid number was found, clean up and return to caller
	   grid[position ] = 0;
	}
}

function makeArray() {
	var grid = new Array;
	for(var i = 1; i <= 81; ++i)
	{
		if($('#' + i).html() == "<br>" || $('#' + i).html() == "")
		{
			grid[i - 1] = 0;
		}else
		{
			grid[i - 1] = parseInt($('#' + i).html());
		}
	}
	return grid;
}

function logPrint(grid) {
	var output;
	for(var a = 0; a < 9;a++){
		output = "";
		for(var b = 0;b < 9; b++) 
		{
			output += grid[(a * 9) + b];
			output += ",";
		}
		console.log(output);
		//co << "\n";
		if(a == 27 || a == 54) {
			console.log("-----------------\n");
		}
	}
}

function updateDisplay(grid) {
	for(var i = 1; i <= 81; i++) {
		$('#' + i).html(grid[i - 1])
	}
}

$(function() {
	$('#solveit').click(function() {
		console.log('start');	
		var grid = makeArray();
		console.log('made array');
		logPrint(grid);
		solve(grid, 0);
		console.log('finished');
	});//end click
	
});//end ready
