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
$firstName = mysql_real_escape_string($_POST['firstName']);
$lastName = mysql_real_escape_string($_POST['lastName']);
$fatherName = mysql_real_escape_string($_POST['fatherName']);

$password = md5($password);

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
        'username' => $firstName + $lastName,
        'email' => $email,
        'key' => $key
        );
        if (send_email($info)) {      
            //email sent
            $action['result'] = 'success';
            array_push($text,'Thanks for signing up. Please check your email for confirmation!');                        
        } else {                            
            $action['result'] = 'error';
            array_push($text,'Could not send confirm email');                        
        }      
    } else {
        $action['result'] = 'error';
        array_push($text,'Confirm row was not added to the database. Reason: ' . mysql_error());                        
    }             
} else {         
    $action['result'] = 'error';
    array_push($text,'User could not be added to the database. Reason: ' . mysql_error());
}

function send_email ($info) {         
    //format each email
    $body =  "";
    $body_plain_txt = "";
 
    //setup the mailer
    $transport = Swift_MailTransport::newInstance();
    $mailer = Swift_Mailer::newInstance($transport);
    $message = Swift_Message::newInstance();
    $message ->setSubject('Welcome to Site Name');
    $message ->setFrom(array('noreply@sitename.com' => 'Site Name'));
    $message ->setTo(array($info['email'] => $info['username']));
     
    $message ->setBody($body_plain_txt);
    $message ->addPart($body, 'text/html');
             
    $result = $mailer->send($message);
     
    return $result;     
}

?>