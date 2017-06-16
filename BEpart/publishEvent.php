<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');

$pageId = $_POST['pageId'];
$eventId = $_POST['eventId'];

mysql_query("UPDATE `events` SET `published` = 1 WHERE `events`.`id` = $eventId");
$event = mysql_query("SELECT * FROM `events` WHERE id = '$eventId'");
$event = mysql_fetch_assoc($event);

$html = '<div item_id="' . $event['id'] . '" class="publishedEvent row">
        <div class="col-xs-12 event-info">
          <h4>' . $event['name'] . '</h4>
          <span>' . $event['description'] . '</span>
          <a dest="' . $event['page_id'] . '">Перейти до сторінки олімпіади</a>
        </div>
</div>';
mysql_query("INSERT INTO `posts` (`page_id`, `Value`, `Type`, `event_id`) VALUES ('$pageId', '$html', 'event', '$eventId')");


$action['result'] = 'success';
array_push($action,'Event published.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($action);
?>