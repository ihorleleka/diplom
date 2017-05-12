<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

//get variables
$password = mysql_real_escape_string($_POST['password']);
$email = mysql_real_escape_string($_POST['email']);

$password = md5($password);

mysql_query('SET NAMES UTF8');

$result = mysql_query("SELECT * FROM users WHERE email = '$email' and password = '$password'");
$num_rows = mysql_num_rows($result);

if($num_rows < 1) {
    header('HTTP/1.1 500');
    header('Content-Type: text; charset=UTF-8');
    die('Введено невірний логін/пароль, або даний користувач не зареєстрований');
}

$action = array();
$action['result'] = null;

$info = mysql_fetch_assoc($result);

if ($info['active'] == 1)
{
     $action['result'] = 'success';
     array_push($action,'Thanks for signing up.');
     header('HTTP/1.1 200');
     header('Content-Type: application/json; charset=UTF-8');
     echo json_encode(array('firstName' => $info['firstName'], 'lastName' => $info['lastName'], 'fatherName'=> $info['fatherName']));
} else {
    header('HTTP/1.1 500');
    header('Content-Type: text; charset=UTF-8');
    die('Вам необхідно підтвердити Вашу почтову адресу. Будь ласка перевірте пошту.'.$result['active']);
}
?>