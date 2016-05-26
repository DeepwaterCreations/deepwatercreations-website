<?php
function getConnection(){
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

    return $pdo;
}
?>
