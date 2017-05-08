<?php
require 'dbconnect.php';
$pdo = getConnection();

/* Get blog post data and output it as json */
/* Use the page number and page size to */
/* return a subset of all the posts, where page 0 includes */
/* the post with the highest ID, and the page with the post */
/* that has id=0 will change based on the total number of posts.*/
function getBlogPostsQuery(){
    $page_num = isset($_GET['page_num']) ? $_GET['page_num'] : 0;
    $page_size = isset($_GET['page_size']) ? $_GET['page_size'] : 0;
    if(ctype_digit($page_size) && ($page_size > 0) && ctype_digit($page_num)){
        $max_id_offset = $page_num * $page_size;
        $query = "SELECT * FROM blog";
        $query = $query . " WHERE id <= ((SELECT MAX(id) FROM blog) - $max_id_offset)";
        $query = $query . " ORDER BY id DESC";
        $query = $query . " LIMIT $page_size";
        return $query;
    } else {
        die("Improper Arguments");
    }
}

/* Return a single blog post by ID as JSON */
function getSingleBlogPostQuery(){
    $id = isset($_GET['ID']) ? $_GET['ID'] : -1;
    if(ctype_digit($id) && $id > -1){
        $query = "SELECT * FROM blog WHERE id = $id";
        return $query;
    } else {
        die("Improper Arguments");
    }

}

function getPostCountQuery(){
    $query = "SELECT COUNT(id) FROM blog";
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

/* TODO: This is dumb. Do it the right way. */
switch(isset($_GET['querytype']) ? $_GET['querytype'] : ''){
    case 'blogcomments':
        $query = getBlogCommentsQuery();
        break;
    case 'singlepost':
        $query = getSingleBlogPostQuery();
        break;
    case 'postcount':
        $query = getPostCountQuery();
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
    echo "Database No Worky: " . $fit->getMessage() . " Query: " . $query;
}


?>
