<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');

$name = $_POST['name'];
$categoryId = $_POST['categoryId'];

mysql_query("INSERT INTO `pages` (`title`) VALUES ('')");
$pageId = mysql_insert_id();
mysql_query("INSERT INTO `subcategories` (`id`, `parent_id`, `name`, `page_id`, `reserved`) VALUES (NULL, '$categoryId', '$name', '$pageId', 0x30)");

$action['result'] = 'success';
array_push($action,'User data updated.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($action);
?>