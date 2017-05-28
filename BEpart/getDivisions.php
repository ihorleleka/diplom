<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");


mysql_query('SET NAMES UTF8');

$result = mysql_query("SELECT * FROM categories WHERE name = 'Олімпіади'");

$olympCategory = mysql_fetch_assoc($result);
$olympCategoryId = $olympCategory['id'];
$subCategories = mysql_query("SELECT * FROM subcategories WHERE parent_id = '$olympCategoryId'");
$result = array();
while($info = mysql_fetch_assoc($subCategories))
{
    $result[] = $info;
}

$action = array();
$action['result'] = 'success';

array_push($action,'Success.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($result);
?>