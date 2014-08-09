var answer = [];
var quitPuzzle = false;

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
	if( position > 80 ) {// Solution found
		//copy array by value
		answer = grid.slice();
	    return
	}
	// If the cell is not empty, continue with the next cell
	if( grid[position] != 0)
	   solve(grid,position + 1) ;
	else
	{
	   var found = false;
	   // Find a valid number for the empty cell
	   for( var num = 1; num < 10; num++ )
	   {
		  if( isLegal(grid, position, num))
		  {
			 grid[position] = num;

			 // Delegate work on the next cell to a recursive call
			 solve(grid,position + 1);
		  }
	   }
	   // No valid number was found, clean up and return to caller
	  
		grid[position ] = 0;
	   
	}
}

function oneSolution(grid, position, count)
{
	if (count > 1) {
		return count;
	}

	if( position > 80 ) {// Solution found
		//copy array by value
	    return count + 1;
	}
	// If the cell is not empty, continue with the next cell
	if( grid[position] != 0) {
	   count = oneSolution(grid,position + 1, count);
	}
	else
	{
	   var found = false;
	   // Find a valid number for the empty cell
	   for( var num = 1; num < 10; ++num )
	   {
		  //console.log("position = " + position + " number " + num );
		  if( isLegal(grid, position, num))
		  {
			 //console.log("valid");
			 grid[position] = num;
			 // Delegate work on the next cell to a recursive call
			 
			 count = oneSolution(grid,position + 1, count);
		  }
	   }
	   // No valid number was found, clean up and return to caller
	  
		grid[position ] = 0;
		
	}
	return count;
}

function makeArray() {
	var grid = new Array;
	for(var i = 1; i <= 81; ++i)
	{
		//only 
		if($('#' + i).hasClass('changeable')) 
		{
			grid[i - 1] = 0;
		}else
		{
			grid[i - 1] = parseInt($('#' + i).html());
		}
	}
	return grid;
}

function resetBorderColor() {
	for(var i = 1; i <= 81; i++) {
		$('#' + i).removeClass("wrongAnswer");
	}
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
		if(a == 27 || a == 54) {
			console.log("-----------------\n");
		}
	}
}

function updateDisplay(grid) {
	for(var i = 1; i <= 81; i++) {
		if (grid[i - 1] == 0) {
			$('#' + i).html('&nbsp;');
		}else
		{ 
			$('#' + i).html(grid[i - 1]);
		}
	}
}

function clearDisplay() {
	for(var i = 1; i <= 81; i++) {
		$('#' + i).html('&nbsp;');
	}
}

function markWrongAnswers(grid) {
	for(var i = 1; i <= 81; i++) {
		if( parseInt($('#' + i).text()) != grid[i - 1] && $('#' + i).html() != "&nbsp;") {
			$('#' + i).addClass("wrongAnswer");
		}
	}
}

function puzzleComplete(grid) {
	for(var i = 1; i <= 81; i++) {
		if( parseInt($('#' + i).text()) != grid[i - 1] || $('#' + i).html() == "&nbsp;") {
			console.log('not finished or correct');
			return -1;
		}
	}
	return 1;
}

function loadPuzzle()
{
	var newPuzzle;
	$.get("http://archives.smoothwebs.co.uk/make-puzzle.php", function( data ) {
		console.log(data);
		newPuzzle = data.split('');
		for(var i = 1; i <= 81; i++) {
		if (newPuzzle[i - 1] == 0) {
			$('#' + i).html('&nbsp;');
			$('#' + i).removeClass('unchangeable');
			$('#' + i).addClass('changeable');
		}else
		{ 
			$('#' + i).html(newPuzzle[i - 1]);
			$('#' + i).removeClass('changeable');
			$('#' + i).addClass('unchangeable');
		}
	}	
	});
	
}

$(function() {
	$('#solveit').click(function() {
		resetBorderColor();
		var grid = makeArray();
		solve(grid, 0);
		updateDisplay(answer);
		quitPuzzle = true;
	});//end click
	
	$('.txtBox').click(function() {
		if ($(this).hasClass('changeable') || $('#inputPuzzle').hasClass('largeButton')) {
				
			
			if ($('.selected').html() == '&nbsp;') {
				$(this).html('&nbsp;');
				return
			}
			var num = parseInt($('.selected').text());
			$(this).text(num);
			if (answer.length <= 0) {
				var grid = makeArray();
				solve(grid, 0);
			}
			if (puzzleComplete(answer) > 0) {
				if (quitPuzzle) {
					alert("Finished, however you requested the solution during the game");
				}
				else {
					alert("Puzzle Correctly Finished!");
				}
			}
			
		}
	});//end click
	
	$('.num').click(function() {
		if ($(this).text() == $('.selected').text()) {
			return
		} else
		{
			$('.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	});// end click
	
	$('#check').click(function() {
		resetBorderColor();
		var grid = makeArray();
		solve(grid, 0);
		console.log('have answers, start checking')
		logPrint(answer);
		markWrongAnswers(answer);
	}); // end click
	
	$('#newPuzzle').click(function() {
		resetBorderColor();
		answer = [];
		quitPuzzle = false;
		loadPuzzle();
	}); //end click
	
	$('#inputPuzzle').click(function() {
		if ($('#inputPuzzle').hasClass('largeButton')) {
			//check for bad values
			$('.txtBox').each(function() {
				if(parseInt($(this).text())) {
					$(this).removeClass('changeable');
					$(this).addClass('unchangeable');
				}else
				{
					$(this).removeClass('unchangeable');
					$(this).addClass('changeable');
				}
			});// end each
			
			
			$('.button').removeClass('largeButton');
			$('#clear').addClass('hidden');
			$('#inputPuzzle').text('Input Puzzle')
			$('.button').each(function() {
				if ($(this).attr('id') != 'inputPuzzle' && $(this).attr('id') != 'clear') {
					$(this).show();
				}
			}); // end each
			
			return
		}
		resetBorderColor();
		$('#proNum').text("");
		console.log('else');
		$('#inputPuzzle').text('Finsh')
		$('.button').each(function() {
			if ($(this).attr('id') != 'inputPuzzle' && $(this).attr('id') != 'clear') {
				$(this).hide();
			}
			
		}); // end each
		$('#clear').removeClass('hidden');
		$('#inputPuzzle').addClass('largeButton');
	}); //end click
	
	$('#clear').click(function() {
		clearDisplay();
		
	}); // end click
	
});//end ready
	