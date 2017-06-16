<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');
$data = array();

$result = mysql_query("SELECT * FROM `events`");
while($event = mysql_fetch_assoc($result)) {

    $eventId = $event['id'];    
    $participantsRow = mysql_query("SELECT * FROM `participants` WHERE event_id = '$eventId'");
    $participants = array();
    while($participant = mysql_fetch_assoc($participantsRow)) {
        $participants[] = $participant;
    }

    $users = array();
    foreach($participants as $participant) {
        $userId = $participant['user_id'];
        $userInfo = mysql_query("SELECT * FROM `users` WHERE id = '$userId'");
        $users[] = mysql_fetch_assoc($userInfo);
    }

    $event['participants'] = $users;
    $data[] = $event;

}

$action['result'] = 'success';
array_push($action,'All events.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($data);
?>