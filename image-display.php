<?php
/*
image-display.php
Read an image from the database and render it in PNG format

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

$id = $_GET['id'];

$mysql_host=""; // Fill in with database host
$mysql_user=""; // Fill in with database username
$mysql_password=""; // Fill in with database password

$link = mysql_connect($mysql_host,$mysql_user,$mysql_password);
if (!$link)
	die('Could not connect: ' . mysql_error());
$db_selected = mysql_select_db('piet', $link);
$result = mysql_query("DELETE FROM saved WHERE created < NOW() - 300");
if (!$result)
	die('Invalid query: ' . mysql_error());
$result = mysql_query("SELECT data FROM saved WHERE id='" . addslashes($id) . "'");
if (!$result)
	die('Invalid query: ' . mysql_error());
if($row=mysql_fetch_array($result))
{
	$code = $row[0];
}
else
{
	die('Image not available');
}
mysql_close($link);

$tok = strtok($code, " \n\t");
$width = $tok;
$tok = strtok(" \n\t");
$height = $tok;
$tok = strtok(" \n\t");
$codelsize = $tok;


$im = imagecreate($width * $codelsize, $height * $codelsize);
//	or die('Cannot Initialize new GD image stream');

// Create our colors
$background_color = imagecolorallocate($im, 255, 0, 0);
$codel_color = array();
$codel_color[0]  = imagecolorallocate($im,   0,   0,   0);
$codel_color[11] = imagecolorallocate($im, 255, 192, 192);
$codel_color[12] = imagecolorallocate($im, 255, 0, 0);
$codel_color[13] = imagecolorallocate($im, 192, 0, 0);
$codel_color[21] = imagecolorallocate($im, 255, 255, 192);
$codel_color[22] = imagecolorallocate($im, 255, 255, 0);
$codel_color[23] = imagecolorallocate($im, 192, 192, 0);
$codel_color[31] = imagecolorallocate($im, 192, 255, 192);
$codel_color[32] = imagecolorallocate($im, 0, 255, 0);
$codel_color[33] = imagecolorallocate($im, 0, 192, 0);
$codel_color[41] = imagecolorallocate($im, 192, 255, 255);
$codel_color[42] = imagecolorallocate($im, 0, 255, 255);
$codel_color[43] = imagecolorallocate($im, 0, 192, 192);
$codel_color[51] = imagecolorallocate($im, 192, 192, 255);
$codel_color[52] = imagecolorallocate($im, 0, 0, 255);
$codel_color[53] = imagecolorallocate($im, 0, 0, 192);
$codel_color[61] = imagecolorallocate($im, 255, 192, 255);
$codel_color[62] = imagecolorallocate($im, 255, 0, 255);
$codel_color[63] = imagecolorallocate($im, 192, 0, 192);
$codel_color[99] = imagecolorallocate($im, 255, 255, 255);

header("Content-type: image/png");

// Write the pixels...
for($y = 0; $y < $height; $y++)
{
	$y1 = $y * $codelsize;
	$y2 = $y1 + $codelsize;
	for($x = 0; $x < $width; $x++)
	{
		$tok = strtok(" \n\t");
		$x1 = $x * $codelsize;
		$x2 = $x1 + $codelsize;
		imagefilledrectangle($im, $x1, $y1, $x2, $y2, $codel_color[$tok]);
	}
}

imagepng($im);
imagedestroy($im);
?>