<!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8">
	<title>Smooth sortable</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1, minimum-scale=1.0">
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta http-equiv="imagetoolbar" content="false" />
	

	<link rel="alternate stylesheet" href="css/smoothie.css" title="Fancy Pants">
	<link rel="stylesheet" href="css/smoothie.css" title="ios">

  <script src="lib/jquery-1.7.2.min.js" type="text/javascript" charset="utf-8"></script>
  <script src="lib/jquery-ui-1.8.19.custom.min.js" type="text/javascript" charset="utf-8"></script>
  <script src="js/smoothie.js" type="text/javascript" charset="utf-8"></script>

</head>
<body>
	<div class="page">
		<h1><a href="https://bitbucket.org/sakamies/smooth-sortable"><span>Smooth</span> <span>sortable</span></a></h1>
		<ol class="smooth-sortable">
		  <li><input type="checkbox" id=""> <small>Use css transforms instead of position: relative! (Way too slow on an actual device.)</small></li>
		  <li><input type="checkbox" id=""> <small>Make this work on Mobile Safari.</small></li>
		  <li><input type="checkbox" id=""> <small>Delegated event handling, so you can add items to the list and the sortable will still work.</small></li>
		  <li><input type="checkbox" id=""> <small>Keyboard accessibility.</small></li>
		  <li><input type="checkbox" id=""> <small>Bug: Sorting therhold changes by one or two pixels when you go over it.</small></li>
      <li>Albert Einstein</li>
      <li>
        Abraham Lincoln
        <br>
        <small>Had a loooooooooong</small>
        <br>
        <small>Hat</small>
        <br>
        <small>Hat</small>
      </li>
      <li>Marylin Monroe</li>
      <li>
        Charlie Chaplin
        <br>
        <small>Maybe had two cats</small>
      </li>
      <li>Julius Caesar</li>
      <li>Sigmund Freud</li>
		</ol>
		<footer>
		  by
      <a href="http://twitter.com/sakamies">@sakamies</a>
			&amp;
			<a href="http://twitter.com/pasiaj">@pasiaj</a>
			<br>
			<br>
			See the <a href="#">github page</a> for details
		</footer>
	</div>
</body>
</html>