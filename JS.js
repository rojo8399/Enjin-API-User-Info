//Edit This

    //Key needs access to Tags.get, Tags.getTagTypes, Stats.get
//var api_key = "99aababa20fbae6f382a5dfe58f76627966c06f93cd796d2"; //DON'T USE MASTER KEY. MAKE A NEW ONE



//Stop Editing



var url = "/api/v1/api.php";

var userGet = {
    	"jsonrpc": "2.0",
    	"id": Math.floor(Math.random()*100),
    	"method": "User.get",
    	"params": {
    	}
    };

$(document).ready(function() {
    
    //Local Storage Pre-Load
    $(".profile.panel .name").html('<a href="/profile">' + localStorage.getItem('username') +'</a>');
    $(".profile.panel .picture img").attr("src", localStorage.getItem('avatar'));
    $(".level-bar .progress").css("width", localStorage.getItem('forum_progress'));
    $(".forum.panel .rank").html(localStorage.getItem('forum_rank'));
    $("#info-panel .rank.panel").html(localStorage.getItem('site_rank'));
    $(".forum.panel .stats").html('<div class="posts"><i class="fa fa-pencil"></i> ' + localStorage.getItem('forum_posts') + '</div><div class="likes"><i class="fa fa-thumbs-o-up"></i> ' + localStorage.getItem('forum_likes') + '</div>');
    //End Local Storage Pre-Load
    
    $.post(url, JSON.stringify(userGet), function(response) {
        if (response.result.logged_in === true) {
            
            avatar = $("#enjin-bar .right .mini-avatar .element_avatar a img").attr("src").replace("/tiny", "/avatar");
            var user_id = response.result.user_id;
            username = response.result.username;
            
            localStorage.setItem('username', response.result.username);
            localStorage.setItem('user_id', response.result.user_id);
            localStorage.setItem('avatar', avatar);
            
            var tagsGet = {
            	"jsonrpc": "2.0",
            	"id": Math.floor(Math.random()*100),
            	"method": "Tags.get",
            	"params": {
            	    "user_id":user_id,
            	    "api_key":api_key
            	}
            };
            
            $(".profile.panel .name").html('<a href="/profile">' + username + '</a>');
            $(".profile.panel .picture img").attr("src", avatar);
            
            //Get Awards List
            $(".m_awarddisplay .awards_container .awards:nth-child(2) .group_awards .award_block:not(.award_not_mine)").each(function() {
                var award_tooltip = $(this).attr("data-html-tooltip");
                var award_tooltip_stripped = $(award_tooltip).text().split('	');
                var award_name = award_tooltip_stripped[0];
                var award_description = award_tooltip_stripped[1];
                var award_image = $(this).find(".award_image img").attr("src");
                
                $("#info-panel .profile .awards").html('<div class="award"><img class="image" src="'+ award_image +'"><div class="tooltip"><span class="badge"><img src="'+ award_image +'"></span><span class="title">'+ award_name +'</span><span class="desc">'+ award_description +'</span></div></div>');
                
            });
            
            //Get Users Stats
            
            var statsGet = {
            	"jsonrpc": "2.0",
            	"id": Math.floor(Math.random()*100),
            	"method": "Stats.get",
            	"params": {
            	    "user_id":user_id,
            	    "api_key":api_key
            	}
            };
            
            $.post(url, JSON.stringify(statsGet), function(response) {
                
                var forum_posts = response.result.forum_posts
                var forum_likes = response.result.forum_likes
                
                if (forum_posts == "-") {
                    forum_posts = 0;
                }
                if (forum_likes == "-") {
                    forum_likes = 0;
                }
                
                $(".forum.panel .stats").html('<div class="posts"><i class="fa fa-pencil"></i> ' + forum_posts + '</div><div class="likes"><i class="fa fa-thumbs-o-up"></i> ' + forum_likes + '</div>');
                localStorage.setItem('forum_posts', forum_posts);
                localStorage.setItem('forum_likes', forum_likes);
                
                //Custom forum level system
                if (forum_likes > 0) {
                    if (forum_likes >= 10) {
                        if (forum_likes >= 20) {
                            
                        } else {
                            var width = forum_likes/20*100 + "%";
                            $(".forum.panel .rank").html('Expirienced <span>Level 2</span>');
                            $(".level-bar .progress").css("width", width);
                            localStorage.setItem('forum_rank', "Expirienced <span>Level 2</span>");
                            localStorage.setItem('forum_progress', width);
                        }
                    } else {
                        var width = forum_likes/10*100 + "%";
                        $(".forum.panel .rank").html('Just Started <span>Level 1</span>');
                        $(".level-bar .progress").css("width", width);
                        localStorage.setItem('forum_rank', "Just Started <span>Level 1</span>");
                        localStorage.setItem('forum_progress', width);
                    }
                } else {
                    var width = forum_likes/1*100 + "%";
                    $(".forum.panel .rank").html('What Are Forums <span>Level 0</span>');
                    $(".level-bar .progress").css("width", width);
                    localStorage.setItem('forum_rank', "What Are Forums <span>Level 0</span>");
                    localStorage.setItem('forum_progress', width);
                }
                
                
            }, "json");
            
            
            
            
            //Get user's tag
            
            $.post(url, JSON.stringify(tagsGet), function(response) {
                var result = response.result;
                var tags = JSON.stringify(result);
                var split_tags = tags.replace('{', '').replace('}', '').split(",");
                var split_names = split_tags[0].replace(/"/g, '').split(":");
                
                var tag_id = split_names[0];
                var tag_name = split_names[1];
                var tag_picture = "http://files.enjin.com.s3.amazonaws.com/1170812/site_user_tags/" + tag_id + ".png";
                
                var tagsGetTypes = {
                	"jsonrpc": "2.0",
                	"id": Math.floor(Math.random()*100),
                	"method": "Tags.getTagTypes",
                	"params": {
                	    "api_key":api_key
                	}
                };
                
                $.post(url, JSON.stringify(tagsGetTypes), function(response) {
                    
                    var numusers = response.result[tag_id].numusers;
                    var percentage = numusers/total_users*100 + "";
                    var percentage_formatted = percentage.split(".");
                    var percentage_final = percentage_formatted[0] + "%";
                    
                    $("#info-panel .rank.panel").html('<img src="http://files.enjin.com.s3.amazonaws.com/1170812/site_user_tags/' + tag_id +'.png"><span class="title">'+ tag_name +'</span><span class="desc">'+ percentage_final +' of users have this rank</span>');
                    localStorage.setItem('site_rank', '<img src="http://files.enjin.com.s3.amazonaws.com/1170812/site_user_tags/' + tag_id +'.png"><span class="title">'+ tag_name +'</span><span class="desc">'+ percentage_final +' of users have this rank</span>');
                }, "json");
                
            }, "json");
            
            
            
            
            
        }
    }, "json");
    
    

});
