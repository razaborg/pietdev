/*
scripts.js
Piet IDE support scripts

Copyright (c) 2006-2013, Oscar Rodriguez
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var colorFront;
var colorBack;
var codelSize;
var currentTool;
var objhttpSave;

function onLoad()
{
	colorFront=0;
	colorBack=99;
	canvasWidth=10;
	canvasHeight=10;
	codelSize=10;
	updateColorBoxes();
	initializeCanvas();
	currentTool=1;
	changeTool(1);
	updateSizeBoxes();
	initDebugVars();
}

function fileNew()
{
	if(confirm("Are you sure you want to create a new document?")==true)
	{
		updateCanvasSize();
		updateSizeBoxes();
	}
}

function fileOpen()
{
	if(confirm("Are you sure you want to open another file, losing unsaved changes?")==true)
	{
		window.location="image-load.php";
	}
}

function fileSave()
{
	// Encode the image
	imagecode = "imagecode=" + canvasWidth + " " + canvasHeight + " " + codelSize;
	for(i = 0; i < canvasHeight; i++)
	{
		for(j = 0; j < canvasWidth; j++)
		{
			imagecode += " ";
			imagecode += canvas[i][j];
		}
	}
	objhttpSave=GetXmlHttpObject(saveFinished);
	objhttpSave.open("POST", "image-save.php", true);
	objhttpSave.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
	objhttpSave.send(imagecode);
}

function saveFinished()
{
	if(objhttpSave.readyState==4 || objhttpSave.readyState=="complete")
	{
		window.open("image-display.php?id=" + objhttpSave.responseText)
	}
}

function updateColorBoxes()
{
	document.getElementById("box-colorback").style.backgroundColor = colorToRGB(colorBack);
	document.getElementById("box-colorfront").style.backgroundColor = colorToRGB(colorFront);
}

function updateSizeBoxes()
{
	document.getElementById("canvas-width").value = canvasWidth;
	document.getElementById("canvas-height").value = canvasHeight;
	document.getElementById("canvas-codel").value = codelSize;
}

function swapColors()
{
	var colorTemp=colorBack;
	colorBack=colorFront;
	colorFront=colorTemp;
	updateColorBoxes();
}

function setFrontColor(color)
{
	colorFront=color;
	updateColorBoxes();
}

function changedCanvasSize()
{
	if(confirm("The canvas will be reset to white. Do you wish to proceed?")==true)
	{
		canvasWidth = Math.ceil(document.getElementById("canvas-width").value);
		canvasHeight = Math.ceil(document.getElementById("canvas-height").value);
		codelSize = Math.ceil(document.getElementById("canvas-codel").value);
		updateCanvasSize();
	}
	updateSizeBoxes();
}

function updateCanvasSize()
{
	var newWidth;
	var newHeight;
	var codelMatrixCode;
	var currentLeft;
	var currentTop;
	var codelRealSize;
	newWidth = (codelSize * canvasWidth) + 6;
	newHeight = (codelSize * canvasHeight) + 6;
	document.getElementById("toolbar-canvas").style.width = (newWidth + 1) + "px";
	document.getElementById("toolbar-canvas").style.height = (newHeight + 18) + "px";
	// Create enough codels...
	codelRealSize = codelSize - 1;
	codelMatrixCode = "";
	currentTop = 3;
	for(i = 0; i < canvasHeight; i++)
	{
		currentLeft = 3;
		for(j = 0; j < canvasWidth; j++)
		{
			codelMatrixCode += "<div id=\"codel-" + i + "-" + j +"\" class=\"codel\" style=\"top: " + currentTop + "px; left: " + currentLeft + "px; width: " + codelRealSize + "px; height: " + codelRealSize + "px;\" onclick=\"eventCodelClick(\'" + i + " " + j +"\');\" onmouseover=\"eventCodelHover(\'" + i + " " + j +"\');\"></div>\n";
			currentLeft += codelSize;
		}
		currentTop += codelSize;
	}
	document.getElementById("toolbar-canvas-body").innerHTML = codelMatrixCode;
	canvas = new Array(canvasHeight);
	for(i = 0; i < canvasHeight; i++)
	{
		canvas[i] = new Array(canvasWidth);
		for(j = 0; j < canvasWidth; j++)
		{
			canvas[i][j] = 99;
			updateCodel(i,j);
		}
	}
}

function eventCodelClick(codel)
{
	var tokens;
	var row;
	var column;
	tokens = codel.tokenize();
	row = tokens[0];
	column = tokens[1];
	switch(currentTool)
	{
	default: // Pencil
	case 1:
		canvas[row][column] = colorFront;
		updateCodel(row, column);
		break;
	case 2: // Floodfill
		floodFill(row, column, canvas[row][column], colorFront, 0);
		break;
	case 3: // Picker
		setFrontColor(canvas[row][column]);
		break;
	}
}

function eventCodelHover(codel)
{
	var tokens;
	var row;
	var column;
	tokens = codel.tokenize();
	row = tokens[0];
	column = tokens[1];
	document.getElementById("hint-x").innerHTML = row;
	document.getElementById("hint-y").innerHTML = column;
	document.getElementById("hint-c").innerHTML = canvas[row][column];
	document.getElementById("hint-a").innerHTML = getArea(row, column);
}

function changeTool(newTool)
{
	document.getElementById("tool-" + currentTool).classList.remove("tool-selected");
	currentTool = newTool;
	document.getElementById("tool-" + currentTool).classList.add("tool-selected");
}

function floodFill(row, column, currentColor, newColor, floodType) // floodType: 0 for filling, 1 for checking bounds, 2 for locating boundary codel
{
	var stackRows = new Array(); // They don't have stacks :(
	var stackCols = new Array();
	var stackPointer = 0;
	var thisRow, thisCol;
	stackRows[0] = row;
	stackCols[0] = column;
	if(currentColor == newColor) return 0;
	if(floodType == 1)
	{
		coordBoundLeft = canvasWidth;
		coordBoundRight = -1;
		coordBoundTop = canvasHeight;
		coordBoundBottom = -1;
	}
	if(floodType == 2)
	{
		if(debugDP == 0) // Right, we'll only bother with verticality
			codelBoundX = coordBoundRight;
		if(debugDP == 1) // Bottom, we'll only bother with horizontality
			codelBoundY = coordBoundBottom;
		if(debugDP == 2) // Left, we'll only bother with verticality
			codelBoundX = coordBoundLeft;
		if(debugDP == 3) // Top, we'll only bother with horizontality
			codelBoundY = coordBoundTop;

		if((debugDP == 0 && debugCC == 0) || (debugDP == 2 && debugCC == 1)) // uppermost
			codelBoundY = canvasHeight;
		if((debugDP == 0 && debugCC == 1) || (debugDP == 2 && debugCC == 0)) // lowermost
			codelBoundY = -1;
		if((debugDP == 1 && debugCC == 0) || (debugDP == 3 && debugCC == 1)) // rightmost
			codelBoundX = -1;
		if((debugDP == 1 && debugCC == 1) || (debugDP == 3 && debugCC == 0)) // leftmost
			codelBoundX = canvasWidth;
	}
	while(stackPointer >= 0)
	{
		thisRow = stackRows[stackPointer];
		thisCol = stackCols[stackPointer];
		if(floodType == 1)
		{
			if(thisRow > coordBoundBottom) coordBoundBottom = thisRow;
			if(thisRow < coordBoundTop) coordBoundTop = thisRow;
			if(thisCol < coordBoundLeft) coordBoundLeft = thisCol;
			if(thisCol > coordBoundRight) coordBoundRight = thisCol;
		}
		else if(floodType == 2)
		{
			if((debugDP == 0 && debugCC == 0) || (debugDP == 2 && debugCC == 1)) // uppermost
				if(thisRow < codelBoundY && thisCol == codelBoundX) codelBoundY = thisRow;
			if((debugDP == 0 && debugCC == 1) || (debugDP == 2 && debugCC == 0)) // lowermost
				if(thisRow > codelBoundY && thisCol == codelBoundX) codelBoundY = thisRow;
			if((debugDP == 1 && debugCC == 0) || (debugDP == 3 && debugCC == 1)) // rightmost
				if(thisCol > codelBoundX && thisRow == codelBoundY) codelBoundX = thisCol;
			if((debugDP == 1 && debugCC == 1) || (debugDP == 3 && debugCC == 0)) // leftmost
				if(thisCol < codelBoundX && thisRow == codelBoundY) codelBoundX = thisCol;
		}
		stackPointer--;
		canvas[thisRow][thisCol] = newColor;
		if(floodType == 0)
			updateCodel(thisRow, thisCol);

		if(thisRow > 0)
		{
			if(canvas[thisRow - 1][thisCol] == currentColor)
			{
				stackPointer++;
				stackRows[stackPointer] = thisRow - 1;
				stackCols[stackPointer] = thisCol;
			}
		}

		if(thisCol > 0)
		{
			if(canvas[thisRow][thisCol - 1] == currentColor)
			{
				stackPointer++;
				stackRows[stackPointer] = thisRow;
				stackCols[stackPointer] = thisCol - 1;
			}
		}

		if(thisRow < canvasHeight - 1) // For some reason, using "+1" attempts to convert everything to strings.. Substraction by -1 doesn't have this problem
		{
			if(canvas[thisRow - (-1)][thisCol] == currentColor)
			{
				stackPointer++;
				stackRows[stackPointer] = thisRow - (-1);
				stackCols[stackPointer] = thisCol;
			}
		}

		if(thisCol < canvasWidth - 1)
		{
			if(canvas[thisRow][thisCol - (-1)] == currentColor)
			{
				stackPointer++;
				stackRows[stackPointer] = thisRow;
				stackCols[stackPointer] = thisCol - (-1);
			}
		}
	}
}

function getArea(row, column)
{
	var previousColor = canvas[row][column];
	var thisArea = 0;
	floodFill(row, column, previousColor, 100, 1);
	// Count codels
	for(i = 0; i < canvasHeight; i++)
	{
		for(j = 0; j < canvasWidth; j++)
		{
			if(canvas[i][j] == 100)
				thisArea++;
		}
	}
	floodFill(row, column, 100, previousColor, 2);
	return thisArea;
}

function updateCodel(row, column)
{
	document.getElementById("codel-" + row + "-" + column).style.backgroundColor = colorToRGB(canvas[row][column]);
}
