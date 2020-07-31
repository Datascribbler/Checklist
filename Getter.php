<?php

$HEADERS = apache_request_headers();
$path = "calendar/" . $HEADERS['URL'];

if(file_exists($path)){
  $mylist = fopen($path,"r");
  $response = fread($mylist,filesize($path));
  echo $response;
  fclose($mylist);
}
else{
  echo "[]";
}



?>
