<?php

//get variables
$email = mysql_real_escape_string($_POST['email']);
$firstName = $_POST['name'];
$comment = $_POST['comment'];

 $info = array(
        'username' => $firstName,
        'email' => $email,
        'comment' => $comment
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



function send_email ($info) {
    $to = 'olymp.dp.ua@gmail.com';
    $subject = 'Feedback';
    $message = 'Користувач ' . $info['username'] . "(" . $info['email'] . ")" . ', надіслав вам повідомлення: <br>';
    $message .= '<br>';
    $message .= $info['comment'];
    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: ". $info['email'] ."\r\n";

    return mail($to, $subject, $message, $headers);
}

?>