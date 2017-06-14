<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

// Create connection
mysql_connect($servername, $username, $password) or die("I couldn't connect to your database, please make sure your info is correct!");
mysql_select_db($dbname) or die("I couldn't find the database table make sure it's spelt right!");

mysql_query('SET NAMES UTF8');

             
$result = mysql_query("SELECT id, name, page_id, reserved FROM categories ORDER BY id ASC");

$parent = array();

while($row = mysql_fetch_assoc($result))
{
    $result1 = mysql_query("SELECT id, parent_id, name, page_id, reserved FROM subcategories WHERE parent_id = '$row[id]' ORDER BY id ASC");
    $parent1 = array();
    while($row1 = mysql_fetch_assoc($result1))
    {
    $result2 = mysql_query("SELECT id, parent_id, name, page_id, reserved FROM subcategory WHERE parent_id = '$row1[id]' ORDER BY id ASC");
    $parent2 = array();
    while($row2 = mysql_fetch_assoc($result2))
    {
        $parent2[] = array("id"=>$row2['id'],"parent_id"=>$row2['parent_id'],"name"=>$row2['name'], "reserved"=>$row2['reserved'], "page_id"=>$row2['page_id']);
    }
    $parent1[] = array("id"=>$row1['id'],"parent_id"=>$row1['parent_id'], "page_id"=>$row1['page_id'], "reserved"=>$row1['reserved'],"name"=>$row1['name'], "children"=>$parent2);
    $parent2 = array();
    }      
    $parent[]= array("id"=>$row['id'],"name"=>$row['name'], "page_id"=>$row['page_id'], "reserved"=>$row['reserved'], "children"=>$parent1);
    $parent1 = array();
}
$result = mysql_query("SELECT * FROM posts");
$postArray = array();
$response = array();
while($data = mysql_fetch_assoc($result))
{
    $postArray[] = $data;
}
$response["posts"] = $postArray;
$response["categories"] = $parent;
echo  json_encode($response);
?>