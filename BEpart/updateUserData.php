<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");


mysql_query('SET NAMES UTF8');

//get variables
$additionalInfoArray = $_POST['additionalInfo'];
$currentUserId = $_POST['id'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$fatherName = $_POST['fatherName'];
$email = $_POST['email'];
$newPassword = $_POST['newPassword'];

if($newPassword != '') {
    $newPassword = md5($newPassword);
}

$birthDate='';
$trainerId = '';
$studyPlace = '';
$additionalInfo = '';
$telephone = '';

if ($additionalInfoArray != 'false') {
    $birthDate = $additionalInfoArray['dateOfBirth'];
    $trainerId = $additionalInfoArray['trainer_id'];
    $studyPlace = $additionalInfoArray['studyPlace'];
    $additionalInfo = $additionalInfoArray['additionalInfo'];
    $telephone = $additionalInfoArray['telephone'];
}
if($newPassword == '') {
    mysql_query("UPDATE `users` SET `firstName` = '$firstName', `lastName` = '$lastName', `fatherName` = '$fatherName', `email` = '$email' WHERE `users`.`id` = $currentUserId");
} else {
    mysql_query("UPDATE `users` SET `password` = '$newPassword', `firstName` = '$firstName', `lastName` = '$lastName', `fatherName` = '$fatherName', `email` = '$email' WHERE `users`.`id` = $currentUserId");
}
if ($additionalInfoArray != 'false') {
    $result = mysql_query("SELECT * FROM users_additional_info WHERE user_id = '$currentUserId'");
    if(mysql_fetch_assoc($result))
    {
        mysql_query("UPDATE `users_additional_info` SET `user_id` = '$currentUserId',`telephone` = '$telephone', `dateOfBirth` = '$birthDate', `trainer_id` = '$trainerId', `studyPlace` = '$studyPlace', `additionalInfo` = '$additionalInfo' WHERE `users_additional_info`.`user_id` = $currentUserId");
    } else {
        mysql_query("INSERT INTO `users_additional_info` (`user_id`, `telephone`, `dateOfBirth`, `trainer_id`, `studyPlace`, `additionalInfo`) VALUES ('$currentUserId', '$telephone','$birthDate', '$trainerId', '$studyPlace', '$additionalInfo')");
    }
}
$action['result'] = 'success';
array_push($action,'User data updated.');
header('HTTP/1.1 200');
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($action);
?>