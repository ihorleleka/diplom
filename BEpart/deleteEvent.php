<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');

$pageId = $_POST['pageId'];
$id = $_POST['id'];

mysql_query("DELETE FROM `events` WHERE `id` = '$id' LIMIT 1") or die(mysql_error());
mysql_query("DELETE FROM `pages` WHERE `id` = '$pageId' LIMIT 1") or die(mysql_error());
mysql_query("DELETE FROM `posts` WHERE `event_id` = '$id' LIMIT 1") or die(mysql_error());

$action['result'] = 'success';
array_push($action,'Deleted.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($action);
?>