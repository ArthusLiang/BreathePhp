<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php
    $masteRoot='/master/';
?>
<title>Breathe.js</title>
<link href="css/demo.css" rel="stylesheet" type="text/javascript"/>
<script type="text/javascript" src="js/frame/jquery-2.0.1.js"></script>
<script type="text/javascript" src="js/frame/BreatheRich.js"></script>
<script type="text/javascript">
$(function(){
	$("#addPlus").bind('click',function(){
		$b.addJs('js/private/plug.js');
	});
});	
</script>
</head>
<body>
	<?php	    
		require($masteRoot.'header.php');
	?>
    <div class="main">
    	<section class="mainLeft">
        	<article>
            	<h1>What's Breathe.js?</h1>
                <p>Brethe.js is a javascript framework which is Function-oriented. You can run your function based on cpu usage. Javascript run as you breathing.</p>
                <pre>
                	<code> 
                    	<?php
							convertHtmlCode('<div id="hear"></div>');
						?>
                    </code> 
                </pre>
                <input type="button" id="addPlus" value="show the cpu" />
            </article>
        </section>
		<?php
			require($masteRoot.'aside.php');
		?>
    </div>
    <?php
		require($masteRoot.'footer.php');
	?>
</body>
</html>