<?php

$HEADERS = apache_request_headers();

if(file_exists($HEADERS['URL'])){
  $mylist = fopen($HEADERS['URL'],"r");
  $response = fread($mylist,filesize($HEADERS['URL']));
  echo $response;
  fclose($mylist);
}
else{
  echo "[]";
}



?>
