<?php 
$data = array(); 
if(isset( $_GET['uploadfiles'])) {
    $error = false;
    $files = array();

    $uploaddir = './uploads/'; 
    if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );
 
    foreach( $_FILES as $file ){
        $_newname = $file['name'];
        if( move_uploaded_file( $file['tmp_name'], $uploaddir . basename($file['name']))){           
            $files[] = 'php/uploads/' . $_newname;
        }
        else{
            $error = true;
        }
    }
 
    $data = $error ? array('error' => 'Ошибка загрузки файлов.') : array('files' => $files ); 
    echo json_encode( $data );
}