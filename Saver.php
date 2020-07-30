<?php

$HEADERS = apache_request_headers();


$mylist = fopen("list.json","w");
fwrite($mylist, $HEADERS["CONTENT"]);
fclose($mylist);

$mylist = fopen("list.json","r");
$response = fread($mylist,filesize("list.json"));
echo $response;
fclose($mylist);


?>
