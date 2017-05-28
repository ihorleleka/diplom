<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");
mysql_query('SET NAMES UTF8');

$division = $_POST['division'];
$userId = $_POST['userId'];
$comment = $_POST['comment'];

 $info = array(
        'division' => $division,
        'userId' => $userId,
        'comment' => $comment
        );
$info['key'] = md5($info['comment']);
$userInfo = mysql_query("SELECT * FROM users WHERE id = '$userId'");
$userInfo = mysql_fetch_assoc($userInfo);

$coordinartorRequest = mysql_query("SELECT * FROM user_roles WHERE role_id = '2' and division_id = '$division'");
$adminRequest = mysql_query("SELECT * FROM user_roles WHERE role_id = '1'");

$coordinartor = mysql_fetch_assoc($coordinartorRequest);
$admin = mysql_fetch_assoc($adminRequest);
$targetUserId;
if($coordinartorRequest) {
    $targetUserId = $coordinartor['user_id'];
} else {
    $targetUserId = $admin['user_id'];
}

$targetUserInfo = mysql_query("SELECT * FROM users WHERE id = '$targetUserId'");
$targetUserInfo = mysql_fetch_assoc($targetUserInfo);

$key = $info['key'];

$res = mysql_query("INSERT INTO `trainer_confirm` VALUES(NULL, '$userId', '$division', '$key')");

if (send_email($info, $userInfo, $targetUserInfo)) {
    $action['result'] = 'success';
    array_push($action,'Thanks for signing up. Please check your email for confirmation!');                        
} else {                            
    $action['result'] = 'error';
    array_push($action,'Could not send confirm email');   
    header('HTTP/1.1 500');
    header('Content-Type: text; charset=UTF-8');
    die('Could not send confirm email');
}      



function send_email ($info, $userInfo, $targetUserInfo) {
    $server_name = $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
    $link = 'http://'.$server_name.'/confirmTrainer.php?id='.$info['userId'].'&division='.$info['division'].'&key='.$info['key'];
    $to = $targetUserInfo['email'];
    $subject = 'Підтвердження реєстрації тренера';
    $message = 'Користувач '. $userInfo['lastName']. ' ' . $userInfo['firstName'] . "(" . $userInfo['email'] . ")" . ', створив запит для отримання ролі тренера: <br>';
    $message .= '<br>';
    $message .= 'Коментар користувача: ' . $info['comment'];
    $message .= '<br>';
    $message .= '<br>';
    $message .= 'Для підтвердження перейдіть за цим посиланням: '.'<a href="'.$link.'">Підтвердити реєстрацію тренера</a>';
    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: ". $userInfo['email'] ."\r\n";

    return mail($to, $subject, $message, $headers);
}

?>