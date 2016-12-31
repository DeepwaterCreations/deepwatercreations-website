<?php
/* GitHub's webhook will call this script. This script will parse the response and write the important data */
/* to a file with a JSON object. The sidebar will read from that file.*/ 
$MAX_SIDEBAR_COMMITS = 5;
$NAMES_THAT_ARE_ME = ["DeepwaterCreations"];
$TARGET_FILE = "commitfile";

//Put all the commits together in an array.
$commits = json_decode(file_get_contents($TARGET_FILE), true);
$postcontents = json_decode(file_get_contents('php://input'), true);
for($i =0; $i < count($postcontents["commits"]); $i++){
    $c = $postcontents["commits"][$i];

    //Throw out any commits that weren't made by me.
    //TODO: I'm more interested in commits made by me than in commits into my repos. Can I get that
    //as a webhook?
    if(!in_array($c["author"]["username"], $NAMES_THAT_ARE_ME)){
        continue;
    }

    $timestamp = $c["timestamp"];
    //I don't expect duplicate timestamps to happen very often, but they're conceivably possible.
    while(array_key_exists($timestamp, $commits)){
        $timestamp .= "x";    
    }
    $commits[$timestamp] = $c;    
}

//Sort the array by datetime and truncate to the n most recent
krsort($commits);
$short_commits = array_slice($commits, 0, $MAX_SIDEBAR_COMMITS);

//Write the array in json format to the target file
$commit_file = fopen($TARGET_FILE, 'w');
fwrite($commit_file, json_encode($short_commits, JSON_PRETTY_PRINT));
?>
