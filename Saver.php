<?php

$HEADERS = apache_request_headers();
$path = "calendar/" . $HEADERS["URL"];

if($HEADERS["CONTENT"] == "[]"){
  unlink($path);
  echo "[]";
}
else{
  $mylist = fopen($path,"w");
  fwrite($mylist, $HEADERS["CONTENT"]);
  fclose($mylist);

  $mylist = fopen($path,"r");
  $response = fread($mylist,filesize($path));
  echo $response;
  fclose($mylist);
}


?>
