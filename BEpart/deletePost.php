<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');

$postId = $_POST['postId'];

mysql_query("DELETE FROM `posts` WHERE `id` = '$postId' LIMIT 1") or die(mysql_error());

$action['result'] = 'success';
array_push($action,'Post deleted.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($action);
?>