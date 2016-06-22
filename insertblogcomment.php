<?php
require 'dbconnect.php';
$pdo = getConnection();

$params = json_decode(file_get_contents('php://input'), true);

if($params["comment"] != ""){
    $postid = $params["postid"];
    $title = $params["title"];
    $name = ($params["name"] == "") ? 'Outis' : $params["name"];
    $comment = $params["comment"];

    $post_comment_query = 'INSERT INTO blogcomments
        VALUES(NULL, :postid, CURDATE(), :title, :name, :comment)';
    $post_comment_prepared_statement = $pdo->prepare($post_comment_query);

    try{
        $success = $post_comment_prepared_statement->execute(array(':postid'=>$postid,
                                                        ':title'=>$title,
                                                        ':name'=>($name == "") ? 'Outis' : $name,
                                                        ':comment'=>$comment));
        $result = $post_comment_prepared_statement->fetchAll();
    } catch(Exception $fit){
        $pdo->rollBack();
        die("COULDN'T POST COMMENT: " . $fit->getMessage());
    }

    if($success){
        /* Got to tell the blog post that it has a new comment */
        $blog_comment_update_query = 'UPDATE blog SET comments = comments + 1 WHERE id = :postid';
        $blog_comment_update_prepared_statement = $pdo->prepare($blog_comment_update_query);
        try{
            $success = $blog_comment_update_prepared_statement->execute(array(':postid'=>$postid));
        } catch(Exception $fit){
            $pdo->rollBack();
            die("COULDN'T UPDATE COMMENT COUNT: " . $fit->getMessage());
        }

        //This bit sends me an email notification.
        $myEmail = "dylan.craine@deepwatercreations.com";
        $mailSubj = "Comment on post: " . $title;
        $mailBody = "http://deepwatercreations.com/blogpost.php?id=" . $postid . "\r\n" .
            "TITLE: " . $title . "\r\n" .
            "NAME: " . $name . "\r\n" . "\r\n" .
            $comment;
        //Word wrap because lines longer than 70 characters aren't allowed.
        $mailBody = wordwrap($mailBody, 70, "\r\n");
        mail($myEmail, $mailSubj, $mailBody);
    }
}

?>
