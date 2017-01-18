<?php
require 'dbconnect.php';
$pdo = getConnection();

/* Get blog post data and output it as json */
/* If we have an ID, just get that one post.*/
/* Otherwise, get a number of posts (default all) starting at*/
/* the offset (default 0).*/
function getBlogPostsQuery(){
    $query = "SELECT * FROM blog";
    $id = isset($_GET['ID']) ? $_GET['ID'] : -1;
    $offset = isset($_GET['offset']) ? $_GET['offset'] : 0;
    $num_posts = isset($_GET['num_posts']) ? $_GET['num_posts'] : 'BLAAAH';
    if(ctype_digit($id) && $id > -1){
        $query = $query . " WHERE id = $id";
    }else if(ctype_digit($offset) && $offset > -1){
        $query = $query . " WHERE id >= $offset";
        if(ctype_digit($num_posts) && $num_posts > -1){
            $max_post = $offset + $num_posts;
            $query = $query . " AND id < $max_post";     
        }
    }
    $query = $query . " ORDER BY id DESC";
    return $query;
}

function getBlogCommentsQuery(){
    $query = "SELECT * FROM blogcomments";
    $post_id = $_GET['ID'];
    if(ctype_digit($post_id) && $post_id > -1){
        $query = $query . " WHERE post = $post_id ORDER BY id";
    }else{
        die("Eyyy, where's my ID? I need a post id, numbnuts!");
    }
    return $query;
}

switch(isset($_GET['querytype']) ? $_GET['querytype'] : ''){
    case 'blogcomments':
        $query = getBlogCommentsQuery();
        break;
    case 'blogposts':
        //Intentional fallthrough
    default:
        $query = getBlogPostsQuery();
        break;
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
