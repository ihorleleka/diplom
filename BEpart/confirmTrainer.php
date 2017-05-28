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
if(empty($_GET['id']) || empty($_GET['key']) || empty($_GET['division'])){
    $action['result'] = 'error';
    $action['text'] = 'We are missing variables. Please double check your email.'; 
}
         
if($action['result'] != 'error'){

    //cleanup the variables
    $userId = mysql_real_escape_string($_GET['id']);
    $key = mysql_real_escape_string($_GET['key']);
    $division = mysql_real_escape_string($_GET['division']);
     
    //check if the key is in the database
    $check_key = mysql_query("SELECT * FROM `trainer_confirm` WHERE `userId` = '$userId' AND `key` = '$key' LIMIT 1") or die(mysql_error());
     
    if(mysql_num_rows($check_key) != 0){
                 
        //get the confirm info
        $confirm_info = mysql_fetch_assoc($check_key);
         
        //confirm the email and update the users database
        $update_user_roles = mysql_query("INSERT INTO `user_roles` VALUES('3', '$userId', '$division')") or die(mysql_error());
        //delete the confirm row
        $delete = mysql_query("DELETE FROM `trainer_confirm` WHERE `id` = '$confirm_info[id]' LIMIT 1") or die(mysql_error());
         
        if($update_user_roles){
                         
            $action['result'] = 'success';
            $action['text'] = 'Успіх.';
         
        }else{
 
            $action['result'] = 'error';
            $action['text'] = 'Трапилась помилка: '.mysql_error();;
         
        }
     
    }else{
     
        $action['result'] = 'error';
        $action['text'] = 'Таких даних немає у нашій базі.';
     
    }
 echo($action['text']);
}
?>