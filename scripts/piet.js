/*
piet.js
Main PietDev IDE script in ECMASCript

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

var canvasWidth;
var canvasHeight;
var canvas;

var currentCodelX;
var currentCodelY;
var currentCodelZ;

var nextCodelX;
var nextCodelY;
var nextCodelZ;

var nextCodelUsedX;
var nextCodelUsedY;

var currentHue;
var currentDirection;

var debugDP; // 0 == right and incrementing clockwise
var debugCC; // 0 == left
var debugDH;
var debugDL;

var debugNextOp;
var debugBlacks;

var coordBoundLeft;
var coordBoundRight;
var coordBoundTop;
var coordBoundBottom;

var codelBoundX;
var codelBoundY;

var currentCodelArea;

var debugStack;

var stackTop;

var bufferInput;
var bufferOutput;

var timer;

var instructionPaused;
var isAnimating;
var hasWhiteArea;

function initDebugVars()
{
	currentCodelX = -10;
	currentCodelY = -10;
	nextCodelX = -10;
	nextCodelY = -10;
	currentHue = 0;
	currentDirection = 1;
	debugNextOp = 0;
	debugBlacks = 0;
	debugStack = new Array();
	stackTop = 0;
	isAnimating = false;
	bufferInput = document.getElementById("buffer-in").value;
	bufferOutput = "";
}

function getCodelColor(y,x)
{
	if(x==-1 || y==-1 || x==canvasWidth || y==canvasHeight)
		return 0;
	else
		return canvas[y][x];
}

function findNextCodel()
{
	hasWhiteArea = false;
	currentCodelArea = getArea(currentCodelY, currentCodelX);
	// By now, codelBoundX and codelBoundY already have values
	// Move to the next codel in the direction of debugDP, sliding through white sections
	do
	{
		switch(debugDP)
		{
			case 0:
				codelBoundX++;
				break;
			case 1:
				codelBoundY++;
				break;
			case 2:
				codelBoundX--;
				break;
			case 3:
				codelBoundY--;
				break;
		}
		if(getCodelColor(codelBoundY,codelBoundX) == 99)
			hasWhiteArea = true;
	} while(getCodelColor(codelBoundY,codelBoundX) == 99);
}

function debugRun()
{
	bufferInput = document.getElementById("buffer-in").value;
	instructionPaused = false;
	while(instructionPaused == false)
	{
		if(currentCodelX == -10 || currentCodelY == -10 || nextCodelX == -10 || nextCodelY == -10)
		{
			// We're just starting... Init all vars
			debugDP = 0;
			debugCC = 0;
			stackTop = 0;
			changeCodels(0,0,0,0,false);
			bufferOutput = "";
			debugBlacks = 0;
		}
		else
		{
			// Step through...
			applyOperation();
			if(instructionPaused == false)
			{
				if(currentCodelX == -10 || currentCodelY == -10 || nextCodelX == -10 || nextCodelY == -10)
					return;
				// Locate the pointer if we can do so..
				if(debugNextOp>0)
				{
					changeCodels(nextCodelY,nextCodelX,nextCodelY,nextCodelX,false);
				}
			}
		}
		if(instructionPaused == false)
		{
			findNextCodel();
			changeCodels(currentCodelY, currentCodelX, codelBoundY, codelBoundX,false);
			updateDeltas();
		}
		else
		{
			findNextCodel();
			changeCodels(currentCodelY, currentCodelX, codelBoundY, codelBoundX,true);
			updateDeltas();
			updateRegistersHints();
			updateStackHint();
			document.getElementById("buffer-in").value = bufferInput;
			document.getElementById("buffer-out").value = bufferOutput;
			if(isAnimating == false)
				animateCodels();
		}
	}
}

function debugStep()
{
	instructionPaused = false;
	bufferInput = document.getElementById("buffer-in").value;
	if(currentCodelX == -10 || currentCodelY == -10 || nextCodelX == -10 || nextCodelY == -10)
	{
		// We're just starting... Init all vars
		debugDP = 0;
		debugCC = 0;
		stackTop = 0;
		changeCodels(0,0,0,0,true);
		bufferOutput = "";
		debugBlacks = 0;
	}
	else
	{
		// Step through...
		applyOperation();
		if(instructionPaused == false)
		{
			if(currentCodelX == -10 || currentCodelY == -10 || nextCodelX == -10 || nextCodelY == -10)
				return;
			// Locate the pointer if we can do so..
			if(debugNextOp>0)
			{
				changeCodels(nextCodelY,nextCodelX,nextCodelY,nextCodelX,true);
			}
		}
	}
	if(instructionPaused == false)
	{
		findNextCodel();
		changeCodels(currentCodelY, currentCodelX, codelBoundY, codelBoundX,true);
		updateDeltas();
		updateRegistersHints();
		updateStackHint();
		document.getElementById("buffer-in").value = bufferInput;
		document.getElementById("buffer-out").value = bufferOutput;
	}
}

function debugReset()
{
	changeCodels(-10,-10,-10,-10,true);
	stackTop=0;
	debugDP = 0;
	debugCC = 0;
	stackTop = 0;
	debugNextOp = 0;
	debugBlacks = 0;
	instructionPaused = true;
	updateStackHint();
	document.getElementById("buffer-in").value = bufferInput;
	document.getElementById("buffer-out").value = bufferOutput;
	document.getElementById("debug-hint-dp").innerHTML = "";
	document.getElementById("debug-hint-cc").innerHTML = "";
	document.getElementById("debug-hint-dh").innerHTML = "";
	document.getElementById("debug-hint-dl").innerHTML = "";
	document.getElementById("debug-nextop").innerHTML = "";
	clearTimeout(timer);
	isAnimating = false;
}

function updateStackHint()
{
	var stackHintLeft = "";
	var stackHintRight = "";
	for(var i = stackTop-1; i >= 0 ; i--)
	{
		stackHintLeft += (debugStack[i] + "<br>");
		stackHintRight += "&#" + (debugStack[i] + ";<br>");
	}
	document.getElementById("stack-left").innerHTML = stackHintLeft;
	document.getElementById("stack-right").innerHTML = stackHintRight;
}

function updateDeltas()
{
	var cC = getCodelColor(currentCodelY,currentCodelX);
	var nC = getCodelColor(codelBoundY,codelBoundX);
	var cL, cH, nL, nH;
	if(nC == 0)
	{
		debugDH = "n/a";
		debugDL = "n/a";
	}
	else
	{
		nH = Math.round(nC / 10);
		cH = Math.round(cC / 10);
		nL = nC % 10;
		cL = cC % 10;
		debugDH = nH - cH >= 0 ? nH - cH : (nH - cH) + 6;
		debugDL = nL - cL >= 0 ? nL - cL : (nL - cL) + 3;
	}
	if(nC == 0)
	{
		debugBlacks--;
		debugNextOp = debugBlacks;
	}
	else
	{
		if(hasWhiteArea == true)
			debugNextOp = 18;
		else
			debugNextOp = (debugDH * 3) + debugDL;
		debugBlacks = 0;
	}
}

function updateRegistersHints()
{
	document.getElementById("debug-hint-dp").innerHTML = debugDP;
	document.getElementById("debug-hint-cc").innerHTML = debugCC;
	document.getElementById("debug-hint-dh").innerHTML = debugDH;
	document.getElementById("debug-hint-dl").innerHTML = debugDL;
	document.getElementById("debug-nextop").innerHTML = opcodeToText(debugNextOp);
}

function findUsedCodel()
{
		nextCodelUsedX = nextCodelX;
		nextCodelUsedY = nextCodelY;
		if(nextCodelX == -1)
		{
			nextCodelUsedX = 0;
		}
		if(nextCodelX == canvasWidth)
		{
			nextCodelUsedX = canvasWidth - 1;
		}
		if(nextCodelY == -1)
		{
			nextCodelUsedY = 0;
		}
		if(nextCodelY == canvasHeight)
		{
			nextCodelUsedY = canvasHeight - 1;
		}
}

function changeCodels(cY, cX, nY, nX, upd)
{
	if(cX == -10 || cY == -10 || nX == -10 || nY == -10)
	{
		if(upd == true)
		{
			document.getElementById("codel-" + currentCodelY + "-" + currentCodelX).style.zIndex = currentCodelZ;
			document.getElementById("codel-" + currentCodelY + "-" + currentCodelX).style.borderColor = "rgb(0,0,0)";
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.zIndex = nextCodelZ;
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.borderColor = "rgb(0,0,0)";
		}
		currentCodelX = -10;
		currentCodelY = -10;
		nextCodelX = -10;
		nextCodelY = -10;
	}
	else if(currentCodelX == -10 || currentCodelY == -10 || nextCodelX == -10 || nextCodelY == -10)
	{
		currentCodelX = cX;
		currentCodelY = cY;
		if(upd == true)
			currentCodelZ = document.getElementById("codel-" + currentCodelY + "-" + currentCodelX).style.zIndex;
		nextCodelX = nX;
		nextCodelY = nY;
		findUsedCodel();
		if(upd == true)
		{
			nextCodelZ = document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.zIndex;
			document.getElementById("codel-" + currentCodelY + "-" + currentCodelX).style.zIndex = 10000;
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.zIndex = 10000;
			animateCodels();
		}
	}
	else
	{
		if(upd == true)
		{
			document.getElementById("codel-" + currentCodelY + "-" + currentCodelX).style.zIndex = currentCodelZ;
			document.getElementById("codel-" + currentCodelY + "-" + currentCodelX).style.borderColor = "rgb(0,0,0)";
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.zIndex = nextCodelZ;
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.borderColor = "rgb(0,0,0)";
		}
		currentCodelX = cX;
		currentCodelY = cY;
		if(upd == true)
			currentCodelZ = document.getElementById("codel-" + currentCodelY + "-" + currentCodelX).style.zIndex;
		nextCodelX = nX;
		nextCodelY = nY;
		findUsedCodel();
		if(upd == true)
		{
			nextCodelZ = document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.zIndex;
			document.getElementById("codel-" + currentCodelY + "-" + currentCodelX).style.zIndex = 10000;
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.zIndex = 10000;
		}
	}
}

function animateCodels()
{
	var hue1;
	var hue2;
	if(currentCodelX == -10 || currentCodelY == -10 || nextCodelX == -10 || nextCodelY == -10)
	{
		currentCodelX = -10;
		currentCodelY = -10;
		nextCodelX = -10;
		nextCodelY = -10;
		clearTimeout(timer);
		isAnimating = false;
	}
	else
	{
		// Update the hue from -1 to 1 in 0.2 steps
		if(currentHue >= 1.0 || currentHue <= (-1.0))
		{
			currentDirection *= -1;
		}
		currentHue += (0.2 * currentDirection);
		if(currentHue>0)
		{
			hue1 = 255;
			hue2 = 255 * currentHue;
		}
		else
		{
			hue1 = 255 - (255 * (-currentHue));
			hue2 = 0;
		}
		textHueCurrent = "rgb(" + Math.round(hue1) + "," + Math.round(hue2) + "," + Math.round(hue2) + ")";
		textHueNext = "rgb(" + Math.round(hue2) + "," + Math.round(hue2) + "," + Math.round(hue1) + ")";
		document.getElementById("codel-" + currentCodelY + "-" + currentCodelX).style.borderColor = textHueCurrent;
		if(nextCodelX == -1) // Only animate a left border
		{
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.borderLeftColor = textHueNext;
		}
		else if(nextCodelX == canvasWidth) // Only animate a right border
		{
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.borderRightColor = textHueNext;
		}
		else if(nextCodelY == -1) // Only animate a top border
		{
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.borderTopColor = textHueNext;
		}
		else if(nextCodelY == canvasHeight) // Only animate a bottom border
		{
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.borderBottomColor = textHueNext;
		}
		else // Animate all borders
		{
			document.getElementById("codel-" + nextCodelUsedY + "-" + nextCodelUsedX).style.borderColor = textHueNext;
		}
		isAnimating = true;
		timer=setTimeout("animateCodels();",50);
	}
}

function applyOperation()
{
	var op1, op2;
	var tokens;
	var tmp;
	switch(debugNextOp)
	{
	case 0: // none
		break;
	case 1: // push
		debugStack[stackTop] = currentCodelArea;
		stackTop++;
		break;
	case 2: // pop
		if(stackTop > 0)
		{
			stackTop--;
		}
		break;
	case 3: // add
		if(stackTop >= 2) // Two operands are taken
		{
			op1=debugStack[stackTop-1];
			op2=debugStack[stackTop-2];
			debugStack[stackTop-2] = op2 - (-op1);
			stackTop--;
		}
		break;
	case 4: // sub
		if(stackTop >= 2) // Two operands are taken
		{
			op1=debugStack[stackTop-1];
			op2=debugStack[stackTop-2];
			debugStack[stackTop-2] = op2 - op1;
			stackTop--;
		}
		break;
	case 5: // mul
		if(stackTop >= 2) // Two operands are taken
		{
			op1=debugStack[stackTop-1];
			op2=debugStack[stackTop-2];
			debugStack[stackTop-2] = op2 * op1;
			stackTop--;
		}
		break;
	case 6: // div
		if(stackTop >= 2) // Two operands are taken
		{
			op1=debugStack[stackTop-1];
			op2=debugStack[stackTop-2];
			debugStack[stackTop-2] = op2 / op1;
			stackTop--;
		}
		break;
	case 7: // mod
		if(stackTop >= 2) // Two operands are taken
		{
			op1=debugStack[stackTop-1];
			op2=debugStack[stackTop-2];
			debugStack[stackTop-2] = op2 % op1;
			stackTop--;
		}
		break;
	case 8: // not
		if(stackTop >= 1)
		{
			if(debugStack[stackTop-1]==0)
				debugStack[stackTop-1]=1;
			else
				debugStack[stackTop-1]=0;
		}
		break;
	case 9: // greater
		if(stackTop >= 2) // Two operands are taken
		{
			op1=debugStack[stackTop-1];
			op2=debugStack[stackTop-2];
			debugStack[stackTop-2] = op2 > op1 ? 1 : 0;
			stackTop--;
		}
		break;
	case 10: // pointer
		if(stackTop >= 1)
		{
			debugDP-=(-debugStack[stackTop-1]);
			debugDP%=4;
			while(debugDP<0) // Handle negative values
				debugDP+=4;
			stackTop--;
		}
		break;
	case 11: // switch
		if(stackTop >= 1)
		{
/*			if(debugCC%2==1)
				debugCC = debugCC == 1 ? 0 : 1;
*/
			// Bugfix by coppro, thanks.
			debugCC = (debugCC + debugStack[stackTop-1])%2;
			stackTop--;
		}
		break;
	case 12: // dup
		if(stackTop > 0)
		{
			debugStack[stackTop] = debugStack[stackTop-1];
			stackTop++;
		}
		break;
	case 13: // roll
		if(stackTop >= 2) // Two operands are taken
		{
			op1=debugStack[stackTop-1]; // numRolls
			op2=debugStack[stackTop-2]; // depth
			stackTop-=2;
			if(stackTop >= op2)
			{
				while(op1<0)
				{
					op1+=op2;
				}
				for(var i=0;i<op1;i++)
				{
					tmp = debugStack[stackTop-1];
					for(var j=1;j<op2;j++)
					{
						debugStack[stackTop-j] = debugStack[stackTop-j-1];
					}
					debugStack[stackTop-j] = tmp;
				}
			}
		}
		break;
	case 14: // inNum
		tokens = bufferInput.tokenize();
		if(tokens.length < 1)
		{
			alert("Please enter a number in the input buffer");
			instructionPaused = true;
		}
		else
		{
			tmp = tokens[0];
			debugStack[stackTop] = Math.round(tmp);
			bufferInput = bufferInput.substring(tmp.length + bufferInput.search(tmp));
			stackTop++;		
		}
		break;
	case 15: // inChar
		if(bufferInput.length < 1)
		{
			alert("Please enter some text in the input buffer");
			instructionPaused = true;
		}
		else
		{
			debugStack[stackTop] = bufferInput.charCodeAt(0);
			bufferInput = bufferInput.substring(1);
			stackTop++;
		}
		break;
	case 16: // outNum
		if(stackTop > 0)
		{
			stackTop--;
			bufferOutput += (debugStack[stackTop] + " ");
		}
		break;
	case 17: // outChar
		if(stackTop > 0)
		{
			stackTop--;
			bufferOutput += String.fromCharCode(debugStack[stackTop]);
		}
		break;
	case 18: // noop
		break;
	case -8: // exit
		alert("Program has ended");
		debugReset();
		break;
	default: // wait
		if((-debugNextOp)%2==0) // Odd, move dp
		{
			debugDP++;
			debugDP%=4;
		}
		else // Even, switch cc
		{
			debugCC = debugCC == 1 ? 0 : 1;
		}
		break;
	}
}
