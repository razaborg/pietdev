<?php
/*
image-save.php
Save an image into the database for later retrieval

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

$mysql_host=""; // Fill in with database host
$mysql_user=""; // Fill in with database username
$mysql_password=""; // Fill in with database password

if(strlen($_POST['imagecode'])<1)
{
	echo "error";
}
else
{
	$link = mysql_connect($mysql_host,$mysql_user,$mysql_password);
	if (!$link)
		die('Could not connect: ' . mysql_error());
	$db_selected = mysql_select_db('piet', $link);
	$result = mysql_query("INSERT INTO saved(created,data) VALUES(NOW(), '" . addslashes($_POST['imagecode']) . "')");
	if (!$result)
		die('Invalid query 1: ' . mysql_error());
	$result = mysql_query("SELECT id FROM saved WHERE data='" . addslashes($_POST['imagecode']) . "'");
	if (!$result)
		die('Invalid query 2: ' . mysql_error());
	if($row=mysql_fetch_array($result))
	{
		echo $row[0];
	}
	mysql_close($link);
}
?>
