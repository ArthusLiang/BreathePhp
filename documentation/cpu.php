<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php
    $linkRoot='../';
	require($linkRoot.'master/link.php');
?>
<title>Breathe.js-CPU</title>
</head>
<body>
	<?php	    
		require($linkRoot.'master/header.php');
	?>
    <div class="main">
    	<section class="mainLeft">
        	<article>
            	<h1>CPU</h1>
                <p>You can get the CPU object according to the following</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				//$CPU=$b.CPU		
				var _cpu = $CPU;
				var _cpu1 = $b.CPU;
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>option</h1>
                <p>Set the option of the Cpu.</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				$CPU.option({
					Interval: 50,
					Time: 10,
					WorkRate: 1.5,
					SleepWait:60000,
					Mode:2 //1 interval  2 timeout
				});
			</script>');
						?>
                    </code> 
                </pre>
                 <p>Get the option of the Cpu.</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				var _option=$CPU.option();
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>start</h1>
                <p>Start rolling</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>		
				$CPU.start();
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>pause</h1>
                <p>Stop rolling</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				$CPU.pause();
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>stop</h1>
                <p>Stop rolling and clear the thread Pool</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				$CPU.stop();
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>create</h1>
                <p>Create a thread</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>		
				var t1 = $CPU.create();
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>kill</h1>
                <p>Kill a thread</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				var t1 = $CPU.create();	
				$CPU.kill(t1.Id);
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>getThreads</h1>
                <p>Get a thread or get the thread pool</p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				 var tID = $CPU.create().Id;
				 //get the thread by id
				 var _thread = $CPU.getThreads(tID);
				 //get the thread pool
				 var _pool = $CPU.getThreads();
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>smartSleep</h1>
                <p>Cpu mode will excute smartSleep $CPU.option.SleepWait millonseconds after the thread pool is empty. </p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				 //you can override this function
				 $CPU.smartSleep()=function(){
				 	......
				 }
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>log</h1>
                <p>Cpu mode will excute onInterval every threads firing </p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				 //you can override this function
				 $CPU.log()=function(){
				 	......
				 }
			</script>');
						?>
                    </code> 
                </pre>
            </article>
            <article>
            	<h1>onInterval</h1>
                <p>Cpu mode will excute onInterval every rolling. </p>
                <pre>
                	<code> 
                    	<?php
					    convertHtmlCode('<script>
				 //you can override this function
				 $CPU.onInterval()=function(){
				 	......
				 }
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