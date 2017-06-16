<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

$action = array();
$action['result'] = null;

$userId = $_POST['userId'];
$eventId = $_POST['eventId'];

$password = md5($password);

mysql_query('SET NAMES UTF8');

$key = $userId . $eventId . date('mY');
$key = md5($key);

$add = mysql_query("INSERT INTO `pending` (`user_id`, `event_id`, `key`) VALUES ('$userId', '$eventId', '$key')");


         
if ($add) {
    $user = mysql_query("SELECT * FROM users WHERE id = '$userId'");
    $user = mysql_fetch_assoc($user);
    $additionalInfo = mysql_query("SELECT * FROM users_additional_info WHERE user_id = '$userId'");
    $additionalInfo = mysql_fetch_assoc($additionalInfo);
    $trainerId = $additionalInfo['trainer_id'];
    $trainer = mysql_query("SELECT * FROM users WHERE id = '$trainerId'");
    $trainer = mysql_fetch_assoc($trainer);
    $event = mysql_query("SELECT * FROM events WHERE id = '$eventId'");
    $event = mysql_fetch_assoc($event);

    $info = array(
    'username' => $trainer['firstName'] . ' ' . $trainer['lastName'],
    'targetUser' => $user['firstName'] . ' ' . $user['lastName'],
    'email' => $trainer['email'],
    'key' => $key,
    'olymp' => $event['name']
    );
    send_email($info);
    $action['result'] = 'success';
    array_push($action,'Thanks for signing up. Please check your email for confirmation!');          
} 

function send_email ($info) {
    $server_name = $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
    $link = 'http://'.$server_name.'/php/olympRegistrationConfirm.php?key='.$info['key'];
    $to = $info['email'];
    $subject = 'Olymp Registration Confirmation';
    $message = $info['username'] . ', Ваш учень,'. $info['targetUser'] .', надіслав заявку на участь у олімпіаді '. $info['olymp'] .' . <br>';
    $message .= 'Для підтвердження реєстрації перейдіть за цим посиланням: <br>';
    $message .= '<br>';
    $message .= '<a href="'.$link.'">Підтвердити реєстрацію</a>';
    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: olymp.dp.ua@gmail.com\r\n";

    return mail($to, $subject, $message, $headers);
}

?>