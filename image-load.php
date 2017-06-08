<html>
<body>
To load an image, please choose a PNG image file and its codel width.
<form method="POST" action="index.php" enctype="multipart/form-data">
	<input type="hidden" name="loaded" value="1">
	File: <input type="file" name="sourceFile"><br>
	Codel width: <input type="text" name="codelWidth"><br>
	<input type="submit">
</form>
</body>
</html>