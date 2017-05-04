<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "for_diploma";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->query('SET NAMES utf8');

$query = "SELECT id, name, page_id FROM categories ORDER BY id ASC" ;                
$result = $conn->query($query) or die(mysql_error());


if ($result->num_rows > 0) {
    
   $parent = array();

   while($row = $result->fetch_assoc())
   {
      $query1 = "SELECT id, parent_id, Name, page_id FROM subcategories WHERE parent_id = '$row[id]' ORDER BY id ASC";
      $result1 = $conn->query($query1) or die(mysql_error());
      $parent1 = array();
      while($row1 = $result1->fetch_assoc())
      {
        $query2 = "SELECT id, parent_id, name, page_id FROM subcategory WHERE parent_id = '$row1[id]' ORDER BY id ASC";
        $result2 = $conn->query($query2) or die(mysql_error());
        $parent2 = array();
        while($row2 = $result2->fetch_assoc())
        {
            $parent2[] = array("id"=>$row2['id'],"parent_id"=>$row2['parent_id'],"name"=>$row2['name'], "page_id"=>$row['page_id'],);
        }
        $parent1[] = array("id"=>$row1['id'],"parent_id"=>$row1['parent_id'], "page_id"=>$row['page_id'],"name"=>$row1['Name'], "children"=>$parent2);
        $parent2 = array();
      }      
      $parent[]= array("id"=>$row['id'],"name"=>$row['name'], "page_id"=>$row['page_id'], "children"=>$parent1);
      $parent1 = array();
   }
     echo  json_encode($parent);
}


$conn->close();
?>