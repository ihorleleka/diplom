<?php 
$files = $_POST['files'];
    foreach( $files as $file ) {
        $filePath =  realpath('../'. $file) ;
        if (file_exists($filePath)) {
             unlink ($filePath); 
        }
    }
 
    echo json_encode( 'success' );
?>