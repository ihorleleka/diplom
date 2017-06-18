<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');
$action = array();
$action['result'] = '';
$action['text'] = '';
if(empty($_GET['email']) || empty($_GET['key'])){
    $action['result'] = 'error';
    $action['text'] = 'Помилка. Будь ласка перевірте посилання.';          
}
         
if($action['result'] != 'error'){
    $email = mysql_real_escape_string($_GET['email']);
    $key = mysql_real_escape_string($_GET['key']);

    $user = mysql_query("SELECT * FROM users WHERE email = '$email'");
    $user=mysql_fetch_assoc($user);
    $firstName = $user['firstName'];
    $lastName = $user['lastName'];
    $currentPass = $user['password'];

    $checkKey = md5($firstName . $lastName);
    if ($checkKey == $key) {
        $password = md5($currentPass . $firstName . $lastName);
        $password = substr($password, 1, 8);
        $pass = md5($password);
        mysql_query("UPDATE `users` SET `password` = '$pass' WHERE email = '$email'") or die(mysql_error());
        $info = array(
        'username' => $firstName . ' ' . $lastName,
        'email' => $email,
        'password' => $password
        );

if (send_email($info)) {      
    $action['result'] = 'success';
    $action['text'] = 'Новий пароль було надіслано на Вашу поштову адресу!';                        
} else {                            
    $action['result'] = 'error';
    die('Помилка. Система не змогла відправити пароль на Вашу поштову адресу. Будь ласка спробуйте ще.');                     
}     
    } else {
         $action['result'] = 'error';
    $action['text'] = 'Не вірний ключ.';
    }
}

echo($action['text']); 


function send_email ($info) {
    $server_name = $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
    $to = $info['email'];
    $subject = 'Reset Password Success';
    $message = $info['username'] . ', Вам було згенеровано новий пароль. Будь ласка змініть його в відповідному розділі особистого кабінету. <br>';
    $message .= 'Пароль:<br>';
    $message .= '<br>';
    $message .= $info['password'];
    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: olymp.dp.ua@gmail.com\r\n";

    return mail($to, $subject, $message, $headers);
}

?>