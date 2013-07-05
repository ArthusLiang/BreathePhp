<?php
	function convertHtmlCode($str){		
		echo str_replace('>','&gt',str_replace('<','&lt;',$str)); 
	}
?>
<header>
    <h1 class="siteName">Breathe.js</h1>
    <nav class="nav">
        <a>DownLoad</a><a>API Documentation</a><a>Demo</a>
    </nav>
</header>