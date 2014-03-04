<?php
// reads the file test.xml in the current dir
$file_content = file_get_contents ('test.xml');
// remove newlines, carriage returns and tabs
$file_content = str_replace(array("\n", "\r", "\t"), '', $file_content);
// converts the file to xml
$xml = simplexml_load_string($file_content);
// converts the xml to json
$json = json_encode($xml);

// embeds the json into the html
echo '<script id="data" type="application/json">';
echo "$json";
echo '</script>';
?>

