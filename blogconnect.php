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
try{
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->beginTransaction();
    $result = $pdo->query("SELECT * FROM blog");
    $pdo->commit();
    echo json_encode($result->fetchAll());
} catch(Exception $fit){
    $pdo->rollBack();
    echo "Database No Worky: " . $fit->getMessage();
}


?>
