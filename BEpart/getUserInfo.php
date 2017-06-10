<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

$id = mysql_real_escape_string($_POST['id']);

mysql_query('SET NAMES UTF8');

$result = mysql_query("SELECT * FROM users WHERE id = '$id'");

$rolesResult = mysql_query("SELECT * FROM user_roles WHERE user_id = '$id'");

$additionalInfo = mysql_query("SELECT * FROM users_additional_info WHERE user_id = '$id'");

$action = array();
$action['result'] = null;

$info = mysql_fetch_assoc($result);
$rolesInfo = array();
while($roleInfo = mysql_fetch_assoc($rolesResult)) 
{
    $rolesInfo[] = $roleInfo;
}
$info['roles'] = $rolesInfo;
$info['additionalInfo'] = mysql_fetch_assoc($additionalInfo);
$action['result'] = 'success';
array_push($action,'Thanks for signing up.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($info);
?>