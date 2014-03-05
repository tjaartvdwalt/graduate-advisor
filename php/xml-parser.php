<?php
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
