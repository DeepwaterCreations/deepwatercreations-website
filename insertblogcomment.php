<?php
require 'dbconnect.php';
$pdo = getConnection();

$params = json_decode(file_get_contents('php://input'), true);

if($params["comment"] != ""){
    $post_comment_query = 'INSERT INTO blogcomments
        VALUES(NULL, :postid, CURDATE(), :title, :name, :comment)';
    $post_comment_prepared_statement = $pdo->prepare($post_comment_query);

    try{
        $success = $post_comment_prepared_statement->execute(array(':postid'=>$params["postid"],
                                                        ':title'=>$params["title"],
                                                        ':name'=>($params["name"] == "") ? 'Outis' : $params["name"],
                                                        ':comment'=>$params["comment"]));
        $result = $post_comment_prepared_statement->fetchAll();
    } catch(Exception $fit){
        $pdo->rollBack();
        die("COULDN'T POST COMMENT: " . $fit->getMessage());
    }

    if($success){
        /* Got to tell the blog post that it has a new comment */
        $query = sprintf("UPDATE  blog  SET  comments  =  comments + 1 WHERE  id=" . $params["postid"]);    
        //TODO: protect the above query from SQL injection
        try{
            $pdo->beginTransaction();
            $result = $pdo->query($query);
            $pdo->commit();
        } catch(Exception $fit){
            $pdo->rollBack();
            die("COULDN'T UPDATE COMMENT COUNT: " . $fit->getMessage());
        }

        //This bit sends me an email notification.
        /* $mailSubj = "Comment on post: " . $title; */
        /* $mailBody = "http://deepwatercreations.com/blogpost.php?id=" . $postid . " " . $title . $name . $comment; */
        /* mail($MyEmail, $mailSubj, $mailBody); */
    }
}

?>
