<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');

$pageId = $_POST['pageId'];
$data = $_POST['data'];

mysql_query("INSERT INTO `posts` (`page_id`, `Value`, `Type`) VALUES ('$pageId', '$data', 'html')");
$postId = mysql_insert_id();

$action['result'] = 'success';
array_push($action,'Post added.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($postId);
?>