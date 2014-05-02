<?php
 try {
	//Attempt to read the files from the remote server
	$res = @file_get_contents("http://comp.umsl.edu/~xml_data/Courses.xml");
	if($res === FALSE) throw new Exception();
	@file_put_contents("xml/Courses.xml", $res);
	$res = @file_get_contents("http://comp.umsl.edu/~xml_data/Rotation.xml");
	if($res === FALSE) throw new Exception();
	@file_put_contents("xml/Rotation.xml", $res);
	$res = @file_get_contents("http://comp.umsl.edu/~xml_data/Schedule.xml");
	if($res === FALSE) throw new Exception();
	@file_put_contents("xml/Schedule.xml", $res);	
} catch (Exception $e) {
	//We don't actually do anything here
}
//This is our new "Finally" block - php 5.3 does not support "Finally"
	$xml_array = array(
    		"courses" => "xml/Courses.xml",
    		"rotation" => "xml/Rotation.xml",
    		"schedule" => "xml/Schedule.xml",
	);

	foreach ($xml_array as $i => $value) {
		// reads the given xml files and converts them to json
    		$file_content = file_get_contents ("$value");
		// remove newlines, carriage returns and tabs
    		$file_content = str_replace(array("\n", "\r", "\t"), '', $file_content);
		// converts the file to xml
    		$xml = simplexml_load_string($file_content);
		// converts the xml to json
    		$json = json_encode($xml);
    
		// embeds the json into the html
    		echo "<script id=\"$i\" type=\"application/json\">";
    		echo "$json";
    		echo "</script>\n";
	}
?>
