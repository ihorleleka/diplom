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
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$fatherName = $_POST['fatherName'];

$password = md5($password);

mysql_query('SET NAMES UTF8');

$test = mysql_query("SELECT * FROM `users` WHERE email = $email");

if(!$test) {
    header('HTTP/1.1 500');
    header('Content-Type: text; charset=UTF-8');
    die('Користувач з таким email вже існує!');
}

$add = mysql_query("INSERT INTO `users` VALUES(NULL,'$email','$password','$firstName','$lastName','$fatherName',0)");

$action = array();
$action['result'] = null;
         
if ($add) {//the user was added to the database
    //get the new user id
    $userid = mysql_insert_id();
                
    //create a random key
    $key = $firstName . $email . date('mY');
    $key = md5($key);
                
    //add confirm row
    $confirm = mysql_query("INSERT INTO `confirm` VALUES(NULL,'$userid','$key','$email')"); 
                
    if ($confirm) {                    
        $info = array(
        'username' => $firstName . ' ' . $lastName,
        'email' => $email,
        'key' => $key
        );
        if (send_email($info)) {      
            $action['result'] = 'success';
            array_push($action,'Thanks for signing up. Please check your email for confirmation!');                        
        } else {                            
            $action['result'] = 'error';
            array_push($action,'Could not send confirm email');   
            header('HTTP/1.1 500');
            header('Content-Type: text; charset=UTF-8');
            die('Could not send confirm email');                     
        }      
    } else {
        $action['result'] = 'error';
        array_push($action,'Confirm row was not added to the database. Reason: ' . mysql_error());                        
    }             
} else {         
    $action['result'] = 'error';
    array_push($action,'User could not be added to the database. Reason: ' . mysql_error());
}

function send_email ($info) {
    $server_name = $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
    $link = 'http://'.$server_name.'/confirm.php?email='.$info['email'].'&key='.$info['key'];
    $to = $info['email'];
    $subject = 'Registration Confirmation';
    $message = $info['username'] . ', Вам необхідно підтвердити реєстрацію. <br>';
    $message .= 'Для підтвердження реєстрації перейдіть за цим посиланням: <br>';
    $message .= '<br>';
    $message .= '<a href="'.$link.'">Підтвердити реєстрацію</a>';
    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: olymp.dp.ua@gmail.com\r\n";

    return mail($to, $subject, $message, $headers);
}

?>