<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

$action = array();
$action['result'] = null;
 
//quick/simple validation
if(empty($_GET['key'])){
    $action['result'] = 'error';
    $action['text'] = 'We are missing variables. Please double check your email.';          
}
         
if($action['result'] != 'error'){
 
    $key = mysql_real_escape_string($_GET['key']);
     
    //check if the key is in the database
    $check_key = mysql_query("SELECT * FROM `pending` WHERE `key` = '$key' LIMIT 1") or die(mysql_error());
     
    if(mysql_num_rows($check_key) != 0){
                 
        $confirm_info = mysql_fetch_assoc($check_key);
        $eventId = $confirm_info['event_id']; 
        $userId = $confirm_info['user_id'];

        $update_users = mysql_query("INSERT INTO `participants` (`user_id`, `event_id`) VALUES ('$userId', '$eventId')") or die(mysql_error());
        //delete the confirm row
        $delete = mysql_query("DELETE FROM `pending` WHERE `key` = '$key' LIMIT 1") or die(mysql_error());
         
        if($update_users){
                         
            $action['result'] = 'success';
            $action['text'] = 'Користувач зареєстрований для участі в олімпіаді. Дякуємо!';
         
        }else{
 
            $action['result'] = 'error';
            $action['text'] = 'Користувач не може бути зареєстрований. Reason: '.mysql_error();;
         
        }
     
    }else{
     
        $action['result'] = 'error';
        $action['text'] = 'Даний ключ не було знайдено у нашій базі даних.';
     
    }
 echo($action['text']);
}
?>