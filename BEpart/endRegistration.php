<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');

$eventId = $_POST['eventId'];
$data = array();
mysql_query("UPDATE `events` SET `registration` = 0 WHERE `events`.`id` = $eventId");

$events = mysql_query("SELECT * FROM `events`");

while($event = mysql_fetch_assoc($events)) {
  $data[] = $event;
}


$action['result'] = 'success';
array_push($action,'Registration started.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($data);
?>