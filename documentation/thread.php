<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php
    $linkRoot='../';
	require($linkRoot.'master/link.php');
?>
<title>Breathe.js-Thread</title>
</head>
<body>
	<?php	    
		require($linkRoot.'master/header.php');
	?>
    <div class="main">
    	<section class="mainLeft">
            <article>
            	<h1>Thread</h1>
                <p>The class of Thread</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				 //You needn`t use it in most condition
				 var t1 = new $CPU Thread();
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>add</h1>
                <p>Add Event to thread</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				 var t1 = new $CPU Thread(),
				 	 event1 =$e(function(){});
				 t1.add(event1);
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>remove</h1>
                <p>Remove Event from thread</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				 var t1 = new $CPU Thread(),
				 	 event1 =$e(function(){});
				 t1.add(event1);
				 t1.remove(event1);
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>fire</h1>
                <p>Excute the current events on the top of stack.</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				 var t1 = new $CPU Thread(),
				 	 event1 =$e(function(){},$level.High),
					 event2 =$e(function(){},$level.High),
					 event3 =$e(function(){},$level.Low);
				 t1.add(event1);
				 t1.add(event2);
				 t1.add(event3);
				 t1.fire();//event1 and event2 will be excuted
			</script>');
						?>
                    </code> 
                </pre>
            </article>
        </section>
		<?php
			require($linkRoot.'master/aside.php');
		?>
    </div>
    <?php
		require($linkRoot.'master/footer.php');
	?>
</body>
</html>