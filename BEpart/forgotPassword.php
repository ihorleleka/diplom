<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

$email = mysql_real_escape_string($_POST['email']);

mysql_query('SET NAMES UTF8');

$user = mysql_query("SELECT * FROM users WHERE email = '$email'");
$user = mysql_fetch_assoc($user);

if(!$user) {
    header('HTTP/1.1 500');
    header('Content-Type: text; charset=UTF-8');
    die('Користувача з таким email не існує!');
}


$firstName = $user['firstName'];
$lastName = $user['lastName'];

$key = md5($firstName . $lastName);

$info = array(
        'username' => $firstName . ' ' . $lastName,
        'email' => $email,
        'key' => $key
        );

if (send_email($info)) {      
    $action['result'] = 'success';
    array_push($action,'Success!');                        
} else {                            
    $action['result'] = 'error';
    array_push($action,'Could not send confirm email');   
    header('HTTP/1.1 500');
    header('Content-Type: text; charset=UTF-8');
    die('Could not send confirm email');                     
}      


function send_email ($info) {
    $server_name = $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
    $link = 'http://'.$server_name.'/php/resetPassword.php?email='.$info['email'].'&key='.$info['key'];
    $to = $info['email'];
    $subject = 'Reset Password';
    $message = $info['username'] . ', Вам було надіслано посилання для зміни паролю. <br>';
    $message .= 'Для генерації нового паролю перейдіть за цим посиланням: <br>';
    $message .= '<br>';
    $message .= '<a href="'.$link.'">Сгенерувати новий пароль</a>';
    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: olymp.dp.ua@gmail.com\r\n";

    return mail($to, $subject, $message, $headers);
}

?>