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
if(empty($_GET['email']) || empty($_GET['key'])){
    $action['result'] = 'error';
    $action['text'] = 'We are missing variables. Please double check your email.';          
}
         
if($action['result'] != 'error'){
 
    //cleanup the variables
    $email = mysql_real_escape_string($_GET['email']);
    $key = mysql_real_escape_string($_GET['key']);
     
    //check if the key is in the database
    $check_key = mysql_query("SELECT * FROM `confirm` WHERE `email` = '$email' AND `key` = '$key' LIMIT 1") or die(mysql_error());
     
    if(mysql_num_rows($check_key) != 0){
                 
        //get the confirm info
        $confirm_info = mysql_fetch_assoc($check_key);
         
        //confirm the email and update the users database
        $update_users = mysql_query("UPDATE `users` SET `active` = 1 WHERE `id` = '$confirm_info[userid]' LIMIT 1") or die(mysql_error());
        //delete the confirm row
        $delete = mysql_query("DELETE FROM `confirm` WHERE `id` = '$confirm_info[id]' LIMIT 1") or die(mysql_error());
         
        if($update_users){
                         
            $action['result'] = 'success';
            $action['text'] = 'User has been confirmed. Thank-You!';
         
        }else{
 
            $action['result'] = 'error';
            $action['text'] = 'The user could not be updated Reason: '.mysql_error();;
         
        }
     
    }else{
     
        $action['result'] = 'error';
        $action['text'] = 'The key and email is not in our database.';
     
    }
 echo($action['text']);
}
?>