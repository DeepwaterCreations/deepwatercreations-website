<?php
/* Read database connection info from an external file */
$file = 'dbsettings.ini';
if(!$settings = parse_ini_file($file, TRUE)) 
    throw new exception("Couldn't make this whole " . $file . " thing work out, sorry.");
$dsn = $settings['database']['driver'] . 
    ':host=' . $settings['database']['host'] .
    (!empty($settings['database']['port']) ? (':' . $settings['database']['port']) : '') .
    ';dbname=' . $settings['database']['dbname'];
$username = $settings['database']['username'];
$password = $settings['database']['password'];

/* Set options and connect */
$options = array(
    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
);

try{
    $pdo = new PDO($dsn, $username, $password, $options);
} catch(Exception $tantrum) {
    die("DISMAL CONNECTION FAILURE: " . $tantrum->getMessage());
}

/* Get blog data and output it as json */
/* If we have an ID, just get that one post. Otherwise, get all posts. */
$query = "SELECT * FROM blog";
$id = $_GET['ID'];
if(ctype_digit($id) && $id > -1){
    $query = $query . " WHERE id = $id";
}else{
    $query = $query . " ORDER BY id DESC";
}

try{
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->beginTransaction();
    $result = $pdo->query($query);
    $pdo->commit();
    echo json_encode($result->fetchAll());
} catch(Exception $fit){
    $pdo->rollBack();
    echo "Database No Worky: " . $fit->getMessage();
}


?>
