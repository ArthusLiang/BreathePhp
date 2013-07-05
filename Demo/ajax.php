<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php
	require("commonlink.php");
?>
<script type="text/javascript">
	$(function(){
		$b.ajax('../handle/ajaxTest.php','',function(data){
			var _dataObj = $b.fromJson(data);
			setTimeout(function(){
				$('#la').html(_dataObj.data);
				},1000);	
		});
	});
</script>
<title>无标题文档</title>
</head>
<body>
	<div id="la"></div>
</body>
</html>