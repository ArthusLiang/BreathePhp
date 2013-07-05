<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php
	require("commonlink.php");
?>
<script type="text/javascript">
$(function(){
	 $b.require([{src:"../js/private/js1.js",charset:"utf-8"},
					[{src:"../js/private/js2.js",charset:"utf-8"},
					{src:"../js/private/js3.js",charset:"utf-8"},
					{src:"../js/private/js4.js",charset:"utf-8"}],
					{src:"../js/private/js5.js",charset:"utf-8"}],function(){
							var _sign  = document.createElement("P");
							_sign.innerHTML="All loaded!";
							document.getElementsByTagName("BODY")[0].appendChild(_sign);			
					});
});

</script>
<title>无标题文档</title>
</head>
<body>
	<h1>Require</h1>
</body>
</html>