<?php
/*
index.php
PietDev entry page

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
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Piet IDE</title>
	<script type="text/javascript" src="scripts/tokenizer.js"></script>
	<script type="text/javascript" src="scripts/piet.js"></script>
	<script type="text/javascript">
<?php

function RGBToColor($r, $g, $b)
{
	if     ($r ==   0 && $g ==   0 && $b ==   0) return 0;
	else if($r == 255 && $g == 192 && $b == 192) return 11;
	else if($r == 255 && $g ==   0 && $b ==   0) return 12;
	else if($r == 192 && $g ==   0 && $b ==   0) return 13;
	else if($r == 255 && $g == 255 && $b == 192) return 21;
	else if($r == 255 && $g == 255 && $b ==   0) return 22;
	else if($r == 192 && $g == 192 && $b ==   0) return 23;
	else if($r == 192 && $g == 255 && $b == 192) return 31;
	else if($r ==   0 && $g == 255 && $b ==   0) return 32;
	else if($r ==   0 && $g == 192 && $b ==   0) return 33;
	else if($r == 192 && $g == 255 && $b == 255) return 41;
	else if($r ==   0 && $g == 255 && $b == 255) return 42;
	else if($r ==   0 && $g == 192 && $b == 192) return 43;
	else if($r == 192 && $g == 192 && $b == 255) return 51;
	else if($r ==   0 && $g ==   0 && $b == 255) return 52;
	else if($r ==   0 && $g ==   0 && $b == 192) return 53;
	else if($r == 255 && $g == 192 && $b == 255) return 61;
	else if($r == 255 && $g ==   0 && $b == 255) return 62;
	else if($r == 192 && $g ==   0 && $b == 192) return 63;
	else return 99;
}

if($_POST['loaded'] == 1)
{
	$im = imagecreatefrompng($_FILES['sourceFile']['tmp_name']);
	$codelWidth = $_POST['codelWidth'];
	$imageWidth = imagesx($im) / $codelWidth;
	$imageHeight = imagesy($im) / $codelWidth;
	echo("function initializeCanvas()\n");
	echo("{\n");
	echo("\tcanvasWidth=" . $imageWidth . ";\n");
	echo("\tcanvasHeight=" . $imageHeight . ";\n");
	echo("\tcodelSize=" . $codelWidth . ";\n");
	echo("\tupdateCanvasSize();\n");
	for($y = 0; $y < $imageHeight; $y++)
	{
		for($x = 0; $x < $imageWidth; $x++)
		{
			$index = ImageColorAt($im, $x * $codelWidth, $y * $codelWidth);
			$rgb = ImageColorsForIndex($im, $index);
			$r = $rgb['red'];
			$g = $rgb['green'];
			$b = $rgb['blue'];
			echo("\tcanvas[" . $y . "][" . $x . "] = " . RGBToColor($r, $g, $b) . ";\n");
			echo("\tupdateCodel(" . $y . ", " . $x . ");\n");
		}
	}
	echo("}\n");
}
else
{
	echo("function initializeCanvas()\n");
	echo("{\n");
	echo("\tupdateCanvasSize();\n");
	echo("}\n");
}
?>
	</script>
	<script type="text/javascript" src="scripts/support.js"></script>
	<script type="text/javascript" src="scripts/scripts.js"></script>
	<link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body onload="onLoad();">
	<div id="toolbar-color" class="toolbar">
		<div class="toolbar-title">
			Colors
		</div>
		<div class="toolbar-body">
			<div class="coloritem" style="background-color: #ffc0c0; left:   3px; top:   3px;" onclick="setFrontColor(11);"></div>
			<div class="coloritem" style="background-color: #ff0000; left:  23px; top:   3px;" onclick="setFrontColor(12);"></div>
			<div class="coloritem" style="background-color: #c00000; left:  43px; top:   3px;" onclick="setFrontColor(13);"></div>
			
			<div class="coloritem" style="background-color: #ffffc0; left:   3px; top:  23px;" onclick="setFrontColor(21);"></div>
			<div class="coloritem" style="background-color: #ffff00; left:  23px; top:  23px;" onclick="setFrontColor(22);"></div>
			<div class="coloritem" style="background-color: #c0c000; left:  43px; top:  23px;" onclick="setFrontColor(23);"></div>
			
			<div class="coloritem" style="background-color: #c0ffc0; left:   3px; top:  43px;" onclick="setFrontColor(31);"></div>
			<div class="coloritem" style="background-color: #00ff00; left:  23px; top:  43px;" onclick="setFrontColor(32);"></div>
			<div class="coloritem" style="background-color: #00c000; left:  43px; top:  43px;" onclick="setFrontColor(33);"></div>
			
			<div class="coloritem" style="background-color: #c0ffff; left:   3px; top:  63px;" onclick="setFrontColor(41);"></div>
			<div class="coloritem" style="background-color: #00ffff; left:  23px; top:  63px;" onclick="setFrontColor(42);"></div>
			<div class="coloritem" style="background-color: #00c0c0; left:  43px; top:  63px;" onclick="setFrontColor(43);"></div>
			
			<div class="coloritem" style="background-color: #c0c0ff; left:   3px; top:  83px;" onclick="setFrontColor(51);"></div>
			<div class="coloritem" style="background-color: #0000ff; left:  23px; top:  83px;" onclick="setFrontColor(52);"></div>
			<div class="coloritem" style="background-color: #0000c0; left:  43px; top:  83px;" onclick="setFrontColor(53);"></div>
			
			<div class="coloritem" style="background-color: #ffc0ff; left:   3px; top: 103px;" onclick="setFrontColor(61);"></div>
			<div class="coloritem" style="background-color: #ff00ff; left:  23px; top: 103px;" onclick="setFrontColor(62);"></div>
			<div class="coloritem" style="background-color: #c000c0; left:  43px; top: 103px;" onclick="setFrontColor(63);"></div>
			
			<div class="coloritemwide" style="background-color: #ffffff; left:   3px; top: 123px;" onclick="setFrontColor(99);"></div>
			<div class="coloritemwide" style="background-color: #000000; left:  33px; top: 123px;" onclick="setFrontColor(0);"></div>
			
			<img src="images/flip.gif" class="image-flip" alt="Flip colors" onclick="swapColors();" ondblclick="swapColors();">
			
			<div id="box-colorback" class="colorbox" style="background-color: #000000; left:  3px; top: 143px;"></div>
			<div id="box-colorfront" class="colorbox" style="background-color: #ffffff; left: 25px; top: 165px;"></div>
		</div>
	</div>
	<div id="toolbar-file" class="toolbar">
		<div id="toolbar-file-title" class="toolbar-title">
			File
		</div>
		<div id="toolbar-file-body" class="toolbar-body">
			<div class="file-command" onclick="fileNew();">New</div>
			<div class="file-command" onclick="fileOpen();">Open</div>
			<div class="file-command" onclick="fileSave();">Save</div>
		</div>
	</div>
	<div id="toolbar-canvas" class="toolbar">
		<div id="toolbar-canvas-title" class="toolbar-title">
			Canvas
		</div>
		<div id="toolbar-canvas-body" class="toolbar-body">
		</div>
	</div>
	<div id="toolbar-tools" class="toolbar">
		<div id="toolbar-tools-title" class="toolbar-title">
			Tools
		</div>
		<div id="toolbar-tools-body" class="toolbar-body">
			<div id="tool-1" class="tool-button" style="left:   3px; top:   3px;" onClick="changeTool(1);"> <img src="images/pencil.gif" alt="Pencil"> </div>
			<div id="tool-2" class="tool-button" style="left:  23px; top:   3px;" onClick="changeTool(2);"> <img src="images/bucket.gif" alt="Bucket"> </div>
			<div id="tool-3" class="tool-button" style="left:  43px; top:   3px;" onClick="changeTool(3);"> <img src="images/picker.gif" alt="Color picker"> </div>
			<div class="subtoolbar" style="top: 33px; height: 58px;">
				<div class="subtoolbar-title">canvas</div>
				<div class="subtoolbar-body" style="height: 42px;">
					<div class="minitext" style="top:  3px;">W:</div><input id="canvas-width" type="text" class="miniinput" style="top: 3px;" onchange="changedCanvasSize();">
					<div class="minitext" style="top: 15px;">H:</div><input id="canvas-height" type="text" class="miniinput" style="top: 15px;" onchange="changedCanvasSize();">
					<div class="minitext" style="top: 27px;">cS:</div><input id="canvas-codel" type="text" class="miniinput" style="top: 27px;" onchange="changedCanvasSize();">
				</div>
			</div>
			<div class="subtoolbar" style="top: 99px; height: 70px;">
				<div class="subtoolbar-title">cursor</div>
				<div class="subtoolbar-body" style="height: 54px;">
					<div class="minitext" style="top:  3px;">x:</div><div id="hint-x" class="minitext-right" style="top:  3px;"></div>
					<div class="minitext" style="top: 15px;">y:</div><div id="hint-y" class="minitext-right" style="top: 15px;"></div>
					<div class="minitext" style="top: 27px;">C:</div><div id="hint-c" class="minitext-right" style="top: 27px;"></div>
					<div class="minitext" style="top: 39px;">A:</div><div id="hint-a" class="minitext-right" style="top: 39px;"></div>
				</div>
			</div>
		</div>
	</div>
	<div id="toolbar-debug" class="toolbar">
		<div id="toolbar-debug-title" class="toolbar-title">
			Debug
		</div>
		<div id="toolbar-debug-body" class="toolbar-body">
			<div id="debug-1" class="tool-button" style="left:   3px; top:   3px;" onClick="debugRun();"> <img src="images/run.gif" alt="Run"> </div>
			<div id="debug-2" class="tool-button" style="left:  23px; top:   3px;" onClick="debugStep();"> <img src="images/step.gif" alt="Step by step"> </div>
			<div id="debug-3" class="tool-button" style="left:  43px; top:   3px;" onClick="debugReset();"> <img src="images/stop.gif" alt="Stop debugging"> </div>
			<div class="subtoolbar" style="top: 30px; height: 70px;">
				<div class="subtoolbar-title">registers</div>
				<div class="subtoolbar-body" style="height: 54px;">
					<div class="minitext" style="top:  3px;">dp:</div><div id="debug-hint-dp" class="minitext-right" style="top:  3px;"></div>
					<div class="minitext" style="top: 15px;">cc:</div><div id="debug-hint-cc" class="minitext-right" style="top: 15px;"></div>
					<div class="minitext" style="top: 27px;">&#916;h:</div><div id="debug-hint-dh" class="minitext-right" style="top: 27px;"></div>
					<div class="minitext" style="top: 39px;">&#916;l:</div><div id="debug-hint-dl" class="minitext-right" style="top: 39px;"></div>
				</div>
			</div>
			<div class="subtoolbar" style="top: 103px; height: 34px;">
				<div class="subtoolbar-title">next op</div>
				<div class="subtoolbar-body" style="height: 18px;">
					<div id="debug-nextop" class="minitext-info" style="top:  3px;"></div>
				</div>
			</div>
			<div class="subtoolbar" style="top: 140px; height: 170px;">
				<div class="subtoolbar-title">stack</div>
				<div class="subtoolbar-body" style="height: 154px;">
					<div id="stack-left" class="stack"></div><!-- Numbers go here -->
					<div id="stack-right" class="stack"></div><!-- UNICODE interpretations go here -->
				</div>
			</div>
		</div>
	</div>
	<div id="toolbar-buffers" class="toolbar">
		<div id="toolbar-buffers-title" class="toolbar-title">
			Buffers
		</div>
		<div id="toolbar-buffers-body" class="toolbar-body">
			<div class="minitext2" style="top: 3px;">Input:</div>
			<input id="buffer-in" type="text" class="buffer-in">
			<div class="minitext2" style="top: 20px;">Output:</div>
			<textarea rows="1" cols="5" readonly id="buffer-out" class="buffer-out"></textarea>
		</div>
	</div>
</body>
</html>
