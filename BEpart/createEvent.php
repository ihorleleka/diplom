<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');

$name = $_POST['name'];
$description = $_POST['description'];
$reglament = $_POST['reglament'];

mysql_query("INSERT INTO `pages` (`id`) VALUES (NULL)");
$pageId = mysql_insert_id();

mysql_query("INSERT INTO `events` (`id`, `name`, `description`, `page_id`) VALUES (NULL, '$name', '$description', '$pageId')");
$eventId = mysql_insert_id();

mysql_query("INSERT INTO `posts` (`page_id`, `Value`, `Type`) VALUES ('$pageId', '$reglament', 'html')");
$postId = mysql_insert_id();

$listOfEvents = array();
$events = mysql_query("SELECT * FROM `events`");

while($event = mysql_fetch_assoc($events)) {
  $listOfEvents[] = $event;
}

$data = array();
$data['pageId'] = $pageId;
$data['postId'] = $postId;
$data['eventId'] = $eventId;
$data['events'] = $listOfEvents;

$action['result'] = 'success';
array_push($action,'Event added.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($data);
?>