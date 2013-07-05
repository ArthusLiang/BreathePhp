<?php
	header('Content-type: text/javascript'); 
	$data = '"hello json"';
	$response= '$b.JsonPDic["'.$_GET["Key"].'"]='.$data.';';
	echo $response; 
?>