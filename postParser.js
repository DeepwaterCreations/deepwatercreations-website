//In days of yore, I decided to implement my own psuedo-html
//tag to allow me to use a Livejournal-inspired "cut" feature,
//wherein arbitrary text can be turned into a "Read More" link.
//PostParser's job is to transform cut "tags" into actual html anchors,
//and any other similar markup-interpretation I may choose to implement.  

//I'm breaking with convention and capitalizing a non-constructor.
//I don't intend to use the 'new' statement anyway, so that convention is useless.
//Gonna try this functional approach instead.
var PostParser = function(){
    var returnFunc = function(){};
    //Private
    var current_id = -1;

    var replace_dict = {
        "<cut>": {
            blog_view: function(){
                return "<a href='" + /*??? + current_id +*/ "'>";
            },
            full_view: "<b>"
        },
        "</cut>(?:(.|[\r\n])*)": { //Matches the closing tag and everything after it.
            blog_view: "</a>", //On the blog view, we throw away all the text after the closing cut tag.
            full_view: "</b>$1" //On the full view, we put it back in. $1 is matching group 1 of the search text.
        }
    };

    
    //Public

    //"post" is a blog post object from my MySQL database.
    //"isSinglePage": true if we're looking at a single post on its own page,
    //which means f'rinstance that <cut> tags should make text bold
    //instead of linked.
    //Returns a modified version of the whole blog post object.
    var parse = function(post, isSinglePage){
        current_id = post.id;
        var viewtype = (isSinglePage ? "full_view" : "blog_view");

        //use the replace_dict defined above to replace text in the post.
        var parsedpost = post.entry;
        if(!parsedpost){
            console.log("Blog post with no text!");
            return post;
        }

        for(searchval in replace_dict){
            if(replace_dict.hasOwnProperty(searchval)){
                var globalsearchval = new  RegExp(searchval, 'g'); //Or else we'll only replace the first match.
                var replaceval = replace_dict[searchval][viewtype];
                parsedpost = parsedpost.replace(globalsearchval, replaceval);
            }
        }
        post.entry = parsedpost;

        return post;
    };
    returnFunc.parse = parse;

    return returnFunc;
}();

