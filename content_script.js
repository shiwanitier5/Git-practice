


const $ = jQuery = require('jquery');
// let port;
let processed_posts_count = 0;
let CFIngerval = null;

const comments_container_selector = '._333v._45kb';
const comment_selector = '._2a_i';
const page_selctor = document.getElementsByClassName("_54k8 _52jg _56bs _26vk _56bu");
const post_url = new URL(window.location);  //confusion
let diff = 10 * 1000;
let reply_btns = keywords = msg_reply = [];
let reply_btns_count = 0;
let group_ID;
// let card_description= "";
// let card_title= "";
// let groupid= "";
// let keywords= [];
let latest_post = "";
let min_time = 0;
// let msg_reply= [];
let no_latest_post = "";
// let post_url= "";
let random_delay = 0;
let reply_from_where = "";
let reply_from_which = "";
let x_minutes = 2 * 60 * 1000;
let x_replies = 10;
let active_status = false;
let scheduled_start = null;
let users;
let pages;
let groups = [];
let groupid;

let rep_btns = [];  //array of reply buttons when length of reply button becomes 0
let all_reply_btns = [];  //array of all reply buttons if all is true
var Total_reply_btns_count = 0;
var remembered_btn_count = 0;
var data = {};
let reply_btn_count = 0;
let remember_btn_count = 0;
let param_item;
let param_item_position;
let setting_item;
let param_reply_count = 0
let param_rem_count = 0;
let reply_count = 0;
let remember_count = 0;

let regexPages = {
    "facebook": /^(http|https):\/\/(www.)*(facebook)(\.com)/,
    "groups": /^(http|https):\/\/(www.)*(facebook)(\.com)\/groups/
};
let fbUserData = {};
const isEmptyObj = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

const port = chrome.runtime.connect({ name: "contentScriptConnect" });

// var x = document.getElementsByClassName("userContentWrapper")
// var elems = []
// for (let j = 0 ; j < x.length ; j++ ) {
//     let vars = x[j].querySelectorAll("._55pi,._2agf,._4o_4,._4jy0,._4jy3,._517h,._51sy,._59pe,._42ft>*[aria-haspopup='true']");
//     console.log(elems.length)
//     for(let i = 0 ; i < vars.length ; i ++) {
//         elems.push(vars[i])
//     }
// }

// let reply_as_btn=document.getElementsByClassName("userContentWrapper")[0]
// .querySelectorAll("._55pi,._2agf,._4o_4,._4jy0,._4jy3,._517h,._51sy,._59pe,._42ft>*[aria-haspopup='true']")[0];

// if(reply_as_btn.cliked == true){
//     alert("btn already clicked.");
// }else{
//     reply_as_btn.click();
// }




$(document).ready(function () {
    /* JIT -- Setting up a cookie for facebook user's name */
    // For initial setup user has to be in facebook homepage
    if (regexPages.facebook.test(window.location.href)) {
        // Create cookie and save user's name from header
        const option = $("a[data-testid^='left_nav_item']");
        if (option.length) {
            const username = option.attr("title");
            const profileLink = option.attr("href").split("?")[0];
            const userid = profileLink.split("/").pop();
            fbUserData = {
                username: username,
                profile: profileLink,
                userID: userid
            };
            chrome.storage.local.set({ "userFBData": fbUserData });
        }
    }
    // Save user's basic data into localstorage

    /* JIT -- END*/
    const loaderHtm = `<div class="ext_loader" style="display:none"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#4267b2" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round" transform="rotate(63.8978 50 50)">
    <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
    </circle>
    <circle cx="50" cy="50" r="23" stroke-width="8" stroke="rgba(66, 103, 178, 0.13725806451612899)" stroke-dasharray="36.12831551628262 36.12831551628262" stroke-dashoffset="36.12831551628262" fill="none" stroke-linecap="round" transform="rotate(-63.8978 50 50)">
    <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;-360 50 50"></animateTransform>
    </circle>
    </svg></div>`;
    $('body').prepend(loaderHtm);
    // port = chrome.runtime.connect({name: "contentScriptConnect"});
    // let page=[];
    // let user=document.getElementsByClassName("_alf");
    // console.log(user);
    // for(i=0;i<user.length;++i){
    //     let page=user[i].textContent;
    //     console.log(page);
    // }
    // console.log("pages::: ",page);

    chrome.runtime.onMessage.addListener(cbListener);
    // chrome.runtime.onMessage.addListener(sendMessageToFriend);

    doInit();
    onElementHeightChange(document.body, function () {
        console.log("Body height changes");
        doInit();
    });


});

/**
 * @function callback Handle all requests from background or popup
 * @param {Object} param Payload from background or popup
 * @returns true always for asynchronous nature
 */
function cbListener(param) {
    console.log("cblistener::: ", param);
    switch (param.action) {
        case "startReplying":
            console.warn("HERE IS THE PAYLOAD");
            console.log('Message received from background', param.payload);
            console.log('Message received from background position', param.position);
            param_item = param.payload;
            param_item_position = param.position
            param_reply_count = param_item.reply_btn

            param_rem_count = param_item.remember_button
            commentReply(param.payload);
            console.warn("HERE IS THE PAYLOAD");
            break;
        case "messagePerson":
            console.log("msg to frnd param::: ", param);
            sendMessageToFriend(param.userData);
            break;
    }

    return true;
};

function doInit() {
    //To Intial the post added checking and our menu button as well.
    let post_count = $("._6a.uiPopover._5pbi._cmw._b1e").length;
    if (!post_count) {
        processed_posts_count = 0;
        console.log("Intitial has been paused because post are " + post_count);
        setTimeout(doInit, 500);
        return;
    }
    if (post_count > processed_posts_count) {
        console.log("Now posts are = " + post_count);
        attachClickEvent();
        processed_posts_count = post_count;
    }
}

function attachClickEvent() {
    $('._6a.uiPopover._5pbi._cmw._b1e:not(.cf_event_attached)').click(function () {
        console.log("Its hitting the Fb feed post menu");
        const postObjElArr = $(this).parent().parent().parent();
        console.log(postObjElArr);
        if (CFIngerval) {
            clearInterval(CFIngerval);
        }
        //Calling Add CF menu function in a time a time interval  
        CFIngerval = setInterval(function () {
            addCFmenuLink(postObjElArr[0]);
        }, 500);

        function addCFmenuLink(postBodyEl = null) {
            // console.log("Add cf menu ");
            var popUpmenuBox = $('.uiContextualLayerPositioner.uiLayer').not('.hidden_elem');
            // console.log("PopupMenuBox",popUpmenuBox);
            // console.log("Aleady inserted",popUpmenuBox.children().children().children().children().children());
            var already_existed = $(popUpmenuBox.children().children().children().children().children()[0]).hasClass('postProfits');
            // To catch the delete button of a particular post
            var canDelete = popUpmenuBox.find('a[data-feed-option-name="FeedDeleteOption"]');
            var canDelete2 = popUpmenuBox.find('a[ajaxify^="/ajax/groups/mall/delete"]');
            var li = popUpmenuBox.find("li");
            if (!li.length) {
                //if the popup opened but the content inside has not fully loaded 
                return;
            }
            if ((!canDelete.length && !canDelete2.length) || already_existed) {
                clearInterval(CFIngerval);
                return;
            }
            //To get the Message id of the selected post
            var aTag = popUpmenuBox.find('a[data-feed-option-name="FeedFollowOption"]');
            if (!aTag.length) {
                aTag = popUpmenuBox.find('a[ajaxify^="/ajax/litestand/follow_group_post"]');
            }
            var uri = aTag.attr('ajaxify');
            var decodedUri = decodeURI(uri);
            var whole_url = new URL('https://www.facebook.com/' + decodedUri);
            var message_id = whole_url.searchParams.get('message_id');
            var current_popup = $("._54nf").parent().parent().parent().parent().parent(); //To catch the current opend popup

            if (current_popup.not('.hidden_elem') && !already_existed && message_id) {
                chrome.storage.local.get(["userFBData"], function (obj) {
                    if (isEmptyObj(obj)) {
                        window.location.href = "https://facebook.com";
                    }
                });
                //If the seleted post has open the feed post menu popup and the Comment funnel menu is not exist  
                popUpmenuBox.find('._54nf').prepend('<li class="postProfits __MenuItem">' +
                    '<a href="#" class="_54nc" target="_blank">' +
                    //'<img class="_2yaw img" aria-hidden="true" src="'+chrome.extension.getURL("icons/funnel.png")+'" alt="" style=" max-height: 13px;max-width: 13px;">' +
                    'Use Post Profits' + // '&reg;' + 
                    '</a></li><style>.postProfits:hover{' +
                    'background: #1877F2' +
                    '}</style>').find('.postProfits').click(function () {
                        const parentReplyAs = $(postBodyEl).find("._1dnh").children();
                        const User = $(postBodyEl).find(".fwb").find("a").text();
                        if (parentReplyAs.length > 1) {
                            $(".ext_loader").css("display", "block");
                            // Reply as option is there. Means a page has been linked
                            const replyAsEl = $(postBodyEl).find("._1dnh").find("._1dnk").find("a");
                            replyAsEl[0].click(); // Click to open the pages popup from reply as option
                            let pageName = ["User"];
                            // Pausing for two seconds after click as page might take sometime to load.
                            // Increase if required
                            setTimeout(function () {
                                chrome.storage.local.get(["userFBData"], function (data) {
                                    let pages = document.getElementsByClassName("_alf");
                                    for (i = 0; i < pages.length; i++) {
                                        if (pages[i].textContent !== decodeURI(data.userFBData.username)) {
                                            pageName.push(pages[i].textContent);
                                        }
                                    }
                                    replyAsEl[0].click();
                                    $(".ext_loader").css("display", "none");
                                    // Page Name are redirected to settings page though GET method.

                                    window.open(chrome.extension.getURL("settings.html?user=" + data.userFBData.username + "&post_id=https://m.facebook.com/" + message_id + "&pages=" + pageName));
                                });

                            }, 2000);
                        } else {
                            // Used timeout to make it similar user experience. Timeout not mandatory
                            setTimeout(function () {
                                $(".ext_loader").css("display", "none");
                                chrome.storage.local.get(["userFBData"], function (data) {
                                    window.open(chrome.extension.getURL("settings.html?user=" + data.userFBData.username + "&post_id=https://m.facebook.com/" + message_id));
                                });

                            }, 500);
                        }
                    });
                clearInterval(CFIngerval);
            }
        }

    });

}

function onElementHeightChange(elm, callback) {
    var lastHeight = elm.clientHeight, newHeight;
    (function run() {
        newHeight = elm.clientHeight;
        if (lastHeight != newHeight)
            callback();
        lastHeight = newHeight;

        if (elm.onElementHeightChangeTimer)
            clearTimeout(elm.onElementHeightChangeTimer);

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}

//Function for comment reply
function commentReply(settings) {
    console.log(settings);
    random_delay = eval(settings.random_delay) * 1000;
    min_time = eval(settings.min_time) * 1000;
    msg_reply = settings.replyInput.split(',');
    users = decodeURI(settings.user);
    pages = decodeURI(settings.pages);
    keywords = settings.keywordsInput.split(',');
    x_minutes = eval(settings.x_minutes) * 60 * 1000;
    x_replies = eval(settings.x_replies);
    reply_from_where = settings.reply_from_where;
    reply_from_which = settings.reply_from_which;
    latest_post = settings.latest_post
    no_latest_post = settings.no_latest_post
    groupid = settings.groupid
    console.log(groupid)

    //     chrome.storage.sync.get("fcmessages", function(items) {
    //         let groups=[];
    //         if(items.fcmessages!= undefined && items.fcmessages!=null){
    //         console.log("This is groups::: ", items.fcmessages.groups);
    //         groups=items.fcmessages.groups;

    //         groups=groups.filter(function(res){
    //             return res.id==groupid
    //         });
    //         console.log(groups)
    //         if(groups!= undefined && groups!=null){
    //         console.log("filtered group::: ",groups);
    //         // console.log("filtered group id::: ",groups[0].id);
    //         }
    //     }
    // });
    // if(Array.isArray(settings.groups) && settings.groups.length){
    //     console.log("groups is not undefined")
    //     groups=settings.groups;
    //     group_ID=settings.groups[0].id;
    // }
    // else{
    //     console.log("groups is undefined")
    // }
    // post_url = settings.post_url;
    console.log(random_delay, min_time, msg_reply, keywords, reply_from_where, users, pages);
    console.log(pages)
    if (pages != "undefined" && pages != null) {
        console.log("pages are found");
        setTimeout(() => {
            userOrPage();
        }, 3000);
    }
    else {
        console.log("pages are not found");
        startReply();
    }
}

//Fetch all the page names from post of page 
function userOrPage() {
    let drpdwnbtn = document.getElementsByClassName("_2g0e");
    console.log("dropdown button:::", drpdwnbtn[0])
    buttonclick(drpdwnbtn[0]).then(function () { selectPageName() }).then(setTimeout(function () { startReply() }, 10000));
    // .then(function() {startReply()});
}

//Click on dropdown button of a post of page
function buttonclick(drpdwnbtn) {
    return new Promise(function (resolve, reject) {
        if (drpdwnbtn) {
            console.log("drpdwnbtn::: ", drpdwnbtn);
            drpdwnbtn.click();
            resolve();
        }
        else {
            console.log("there is no button");
            reject();
        }
    })
}

//select the required page name
function selectPageName() {
    console.log("selectPageName called")

    return new Promise(function (resolve, reject) {

        // setTimeout(function(){
        let replies_from;
        let pNames = document.getElementsByClassName("_ru0");
        console.log("pNames::: ", pNames)
        setTimeout(function () {
            console.log("length::: ", pNames.length)
            if (pNames.length > 0) {
                console.log("length2::: ", pNames.length)
                for (let i = 1; i < pNames.length; ++i) {
                    console.log("i:::", i, reply_from_where)
                    if (reply_from_where == "User") {
                        // console.log("reply from: ",users)
                        replies_from = users;
                        console.log("reply from: ", replies_from)
                    } else {
                        replies_from = reply_from_where;
                        console.log("reply from: ", replies_from)
                    }
                    if (pNames[i].textContent == replies_from) {
                        console.log("TRUE", pNames[i].textContent);
                        pNames[i].children[0].children[1].children[0].click();
                        resolve();
                    }
                    console.log("page list ", i, " ::: ", pNames[i].textContent);
                }
            }
            else {
                console.log("results rejected")
                // reject("rejected");
            }
        }, 3000);
    });
}

//Start Reply
function startReply() {
    console.log('startReply called');



    reply_btns = getReplyButtons()
    all_reply_btns = getReplyButtons(true);
    buttonCount();

  


    if (!reply_btns.length) {
        // click load more if we have
        loadMoreComments();
    }
    reply_btns_count = all_reply_btns.length;


    // start replying to comments
    if (reply_btns_count) {



        active_status = true;

        startAction();


    }

}

//Getting all 'reply' buttons from dom
function getReplyButtons(all = false) {
    //console.log('getReplyButtons called');

    let btns = [];
    // $('#add_comment_link_placeholder').parent().find('._333v._45kb')
    if (all) {
        let all_action_btns = $(comments_container_selector + '>' + comment_selector + '>._2b04>div[data-sigil="ufi-inline-comment-actions"]>a'); // Like,Comment and More buttons of all comments
        all_action_btns.each(function (ev) {
            let filter = filterComments(this);
            let replied = alreadyReplied(this);
            if ($(this).text() == 'Reply' && filter && !replied) {
                btns.push(this);
            } else {
                $(this).addClass('gone_through')
            }
        });
        return btns;
    }
    let all_action_btns = $(comments_container_selector + '>' + comment_selector + '>._2b04>div[data-sigil="ufi-inline-comment-actions"]>a:not(.gone_through)'); // Like,Comment and More buttons of all comments
    all_action_btns.each(function (ev) {
        // console.log("no no no no nooooo");
        let filter = filterComments(this);
        let replied = alreadyReplied(this);
        if ($(this).text() == 'Reply' && filter && !replied) {
            btns.push(this);
        } else if (!filter) {
            $(this).addClass('gone_through')
        }
    });
    return btns;
}

//Filter comments with keywords
function filterComments(reply_btn) {
    console.log('filterComments called');
    // keywords=keywords.split(',');
    if (!keywords || !keywords.length) {
        return true;
    }
    let comment_text = $(reply_btn).closest(comment_selector).find('[data-sigil="comment-body"]').text().trim().toLowerCase();
    let pass_filter = false;
    //    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log('keywords >>', keywords, keywords.length);

    keywords.forEach(function (value, index) {
        console.log("keywords " + index, value);

        let filter_text = value.trim().toLowerCase();
        //    console.log('Filter Text is >>'+filter_text);
        //    console.log('Reply Filter Index', comment_text.indexOf(filter_text));

        if (comment_text.indexOf(filter_text) > -1 && !pass_filter) {
            pass_filter = true;
        }
    });

    return pass_filter;
}

//checking already replied or not
function alreadyReplied(reply_btn) {
    console.log('alreadyReplied called');

    let reply_see_text = $(reply_btn).closest(comment_selector).find('[data-sigil="replies-see-more"]');//
    let already_replied = false;

    if (reply_see_text.length && (reply_see_text.text().trim().toLowerCase().indexOf('you replied') > -1 || reply_see_text.text().trim().toLowerCase().indexOf(reply_from_where + ' replied') > -1) || reply_see_text.text().trim().toLowerCase().indexOf(users + ' replied') > -1) {
        already_replied = true
    }

    return already_replied;
}

//If there are new comment then load those
function loadMoreComments() {
    console.log('loadMoreComments called');
    let load_more_btn = getLoadMoreButton();
    if (load_more_btn.length) {
        loadMoreReplyBtns(load_more_btn).then((res) => {
            console.log(' Loaded more comments');
            console.log(' got new reps ', reply_btns);
            console.log('reply_btns_count ', reply_btns_count);

            reply_btns = getReplyButtons();

            reply_btns_count += reply_btns.length;
            active_status = true;
            setTimeout(function () {

                startReply();

            }, randomBetween(finalWaitTime() + diff, finalWaitTime() - diff));

        });
    }
    else {
        active_status = false
        updateStatusString(0);
    }
}

//getting more button for loading
function getLoadMoreButton() {
    console.log('getLoadMoreButton called');

    let btn_prev_id = 'see_prev_' + getFbStoryId();
    let see_prev_btn = $('#' + btn_prev_id + '>a');
    if (see_prev_btn.length) {
        return see_prev_btn;
    }
    let btn_next_id = 'see_next_' + getFbStoryId();
    return $('#' + btn_next_id + '>a');
}

//Getting story id of facebook
function getFbStoryId() {
    //console.log('getFbStoryId called');

    if (post_url.href.indexOf('/groups/') > -1) {
        return getPostId();
    }
    return post_url.searchParams.get("story_fbid");
}

//Getting only post id from url
function getPostId() {
    //  console.log('getPostId called');
    return post_url.searchParams.get("id");
}

//Fetch more new reply buttons
function loadMoreReplyBtns(load_btn) {
    //console.log('loadMoreComments called', load_btn);

    load_btn.get(0).click();

    return new Promise(function (resolve, reject) {
        let count = 0;
        let interval = setInterval(function () {


            rep_btns = getReplyButtons();





            if (rep_btns.length) {
                //reply_btns_count = rep_btns.length;

                //console.log('reply_btns', rep_btns);
                resolve(rep_btns);
                clearInterval(interval);
            }
            if (count > 60) {
                // else{
                // console.log('something web wrong ');
                reject('could not load more comments');
                clearInterval(interval);
                // try Again
                loadMoreComments()
            }
            count++
        }, 500);
    });
}

//Random interval count
function randomBetween(interval, interval2) {
    console.log('randomBetween called');
    let sec = Math.floor(Math.random() * (interval2 - interval + 1) + interval);
    console.log(sec);
    return sec;

}

function finalWaitTime() {
    let rNumber = randomNumber(-30, 180);

    console.log("rNumber::: ", rNumber);
    console.log("min_time::: ", min_time);
    console.log("random_delay::: ", random_delay);

    let finalTime = min_time + random_delay + rNumber;

    console.log("finalTime:::", finalTime);

    if (finalTime >= 60 * 1000) {
        console.log("finalTime will be set");
        return finalTime;
    } else {
        console.log("60 sec will be set");
        return 60 * 1000;
    }
}

function randomNumber(min, max) { // min and max  
    return (Math.random() * (max - min + 1) + min) * 1000;
};

//Update the status of number of replied comment
function updateStatusString(newLen) {
    if (newLen === 0) {
        clearTimeout(scheduled_start);

        scheduled_start = setTimeout(function () {
            console.log('start_again');
            startReply();
        }, finalWaitTime())
        // startReply();
    } else {
        console.log(reply_btns_count - newLen + " of " + reply_btns_count + " Done!");
    }

}

//stop the reply
function stopReply() {
    console.log('stopReply called');


    clearTimeout(scheduled_start);

    active_status = false;
}

//Action against comments which are not replied
function startAction() {
    console.log('startAction called');

    let reply_btn = reply_btns[0];

    if (!reply_btns.length) {
        console.log('All done');
        // active_status = false;
        // return;
        // loadMoreComments(); 
    }
    if (!active_status) {
        clearTimeout(scheduled_start);

        scheduled_start = setTimeout(function () {
            console.log('start_again');
            startReply();
        }, finalWaitTime())
        // //     loadMoreComments();
        //     console.log('Stopped');
        //     return;
    }
    loadReplyForm(reply_btn).then((form) => {
        console.log("form::: ", form);
        postReply(form);
    })
}

//clicking on reply button
function loadReplyForm(btn) {
    btn.click();

    return new Promise(function (resolve, reject) {
        let count = 0;
        let interval = setInterval(function () {
            let cmnt = $(btn).closest(comment_selector);
            //console.log('comment', cmnt);
            let reply_form = cmnt.find('form[id^="comment_form_"]');

            if (reply_form.length) {
                //console.log('reply_form', reply_form);
                resolve(reply_form);
                clearInterval(interval);
            }
            if (count > 120) {
                //console.log('something web wrong ');
                clearInterval(interval);
            }
            count++
        }, 500);
    });

}

//posting reply of comments
function postReply(form) {
    console.log('postReply called', form);

    let submit_btn = form.find('button[type="submit"]');
    let textarea = form.find('textarea.mentions-input');
    let input = form.find('input[name="comment_text"]');
    let comment = form.closest(comment_selector);

    let reply_content = makeReply(form, comment);



    submit_btn.removeAttr('disabled'); // enable button
    //textarea.val(reply_content);
    input.val(reply_content);

    submit_btn.click();
    //submit_btn.css({'background': 'red'});

    let userID = getCommenterId(comment).trim()
    name = getCommenterName(comment).trim();
    console.log("name::: ", name)
    nameArr = name.split(" ");
    console.log("nameArr::: ", nameArr)
    // Sending message to background for sending message
    const newPayload = {
        action: "openPerson",
        userData: {
            name: name,
            fname: nameArr[0],
            lname: nameArr[1],
            mobileUrl: "https://m.facebook.com/messages/thread/" + userID,
            groupID: groupid
        }
    };
    console.log("newpayload::: ", newPayload)
    if (groupid != null && groupid != "") {
        console.log(groupid)
        port.postMessage(newPayload)
    }
    else {
        console.log("no message is selected")
    }
    // if(Array.isArray(groups) && groups.length){
    //   port.postMessage(newPayload)
    // }
    //rememberComment
    rememberComment(comment);
}




//make a reply from settings
function makeReply(form, comment) {
    console.log('makeReply called');

    let reply = msg_reply[Math.floor(Math.random() * msg_reply.length)];
    let name = getTagString(comment);

    return name + ' ' + reply;
}


//get the name and Id of commenter
function getTagString(comment) {
    console.log('getTagString called', comment);

    return "@[" + getCommenterId(comment).trim() + ":" + getCommenterName(comment).trim() + "]";
}

//getting commenter id
function getCommenterId(comment) {
    console.log('getCommenterId called');

    // feed_story_ring100014369911062
    let elm = comment.find('div[data-sigil^="feed_story_ring"]');
    let c_id = elm.attr('data-sigil').replace('feed_story_ring', '');
    console.log("commenterid::: ", c_id)
    return c_id;
}


//getting commenter name
function getCommenterName(comment) {
    console.log('getCommenterName called');

    return comment.find('._2b05>a').first().text();
}

//take pause for x minutes after x replies
function rememberComment() {
    //console.log('rememberComment called');

    let remembered_btn = reply_btns.shift();
    $(remembered_btn).addClass('gone_through');

    console.log('reply_btns popped', reply_btns);
    console.log('remembered_btn', remembered_btn);

    if (reply_btns.length) {
        updateStatusString(reply_btns.length);
        console.log('rem', reply_btns.length, reply_btns_count);

        // sleep for sleep_for seconds and start again
        if (reply_btns_count - reply_btns.length >= x_replies) {
            x_replies = x_replies + x_replies;
            console.log('after X replies', x_replies);
            stopReply();
            // if(x_minutes.length!=0 && x_minutes!=0){
            scheduleStart();
            // }
        }

    } else {
        // click load more if we have
        loadMoreComments();
    }

    // run again if we still have comments
    if (reply_btns.length && active_status) {
        setTimeout(function () {

            startAction();

        }, randomBetween(finalWaitTime() - diff, finalWaitTime() + diff));
    }
}

//reschedule the startReply
function scheduleStart() {
    console.log('scheduled for ', x_minutes);
    clearTimeout(scheduled_start);

    scheduled_start = setTimeout(function () {

        console.log('start_again');
        startReply();
    }, x_minutes)
}



/* ----------------  SENDING MESSAGES FUNCTION ------------------- */
/**
 * FUNCTIONS FOR SENDING FRIEND REQUEST TO SUGGESTED PEOPLE
 * @param {Object} param payload from background js
 */

//  console.log("send message to frnd params::: ",param)
function sendMessageToFriend(param) {
    console.log("Send message param", param);

    chrome.storage.sync.get("fcmessages", async function (items) {
        console.log(items.fcmessages);
        // Assigning to a variable
        if (typeof items.fcmessages !== 'undefined' && items.fcmessages !== null) {
            console.log("Initiate to send message::: ");
            messages = items.fcmessages;
            groupID = param.groupID;
            console.log("Group ID", groupID);
            console.log("Group", messages.groups);
            const filteredGroup = messages.groups.filter(el => {
                return el.id == groupID;
            });
            console.log("Filtered Group", filteredGroup);
            const constructedMsg = await createMessage(filteredGroup[0].blocksPos, param);
            console.log(constructedMsg);
            const newMsg = await constructedMsg.replace("{First_Name}", param.fname).replace("{Last_Name}", param.lname);
            $("textarea").text(newMsg);
            // Will simulate send.
            await setTimeout(async function () {
                await simulateSend();
            }, 1000);
        } else {
            console.log("Will close the window");
            window.close();
        }
    });
};
/** FUNCTION FOR GENERATING NUMBER
 * @param {Number} max Maximum number
 * @returns Random Number between 1 and max parameters
 */
function getRandomNumber(max) {
    return Math.round(Math.random() * (max - 1));
};
/**
 * FUNCTION FOR CONSTRUCTING THE MESSAGE
 * @param {Array} groupArr Array of Group set in local storage
 * @param {Object} data User first name or last name to replace with actual name
 */
async function createMessage(groupArr, data) {
    const random = getRandomNumber(groupArr.length);
    let constructMsg = "";
    await groupArr[random].forEach((e, i) => {
        if (i) {
            constructMsg += " " + returnSegmentBySegmentID(e);
        } else {
            constructMsg += returnSegmentBySegmentID(e);
        }
    });
    const constructedMsg = await constructMsg.replace("{First_Name}", data.fname).replace("{Last_Name}", data.lname);
    console.log(constructedMsg);
    return await constructedMsg;
};
/**
 * FUNCTION FOR FETCHING THE SEGMENT BY POSITION
 * @param {*} pos Array Element of segment or static text for fetching either segment or return the text
 */
function returnSegmentBySegmentID(pos) {
    if (!isNaN(parseInt(pos))) {
        /* Filter out segment with the id */
        const segments = messages.segments.filter(obj => obj.id == pos);
        /* Create a random number to choose one, max length would be the length of that perticular segment blocks */
        const randomNumber = Math.floor(Math.random() * segments[0].blocks.length);
        /* Randomize the blocks array of that filtered segment and return one array element and return */
        return segments[0].blocks[randomNumber];
    } else {
        /* Return if not a segment */
        return pos;
    }
};

/** FUNCTION FOR SIMULATING SEND BUTTON
 */
async function simulateSend() {
    // console.log("In send Simulation");
    var txtbox = document.querySelector('.input');
    txtbox.onkeydown = function (e) {
        if (e.key == "Enter") {
            console.log("Enter Pressed");
        }
        e.preventDefault();
    };

    var ev = await new KeyboardEvent('keydown', {
        altKey: false,
        bubbles: true,
        cancelBubble: false,
        cancelable: true,
        charCode: 0,
        code: "Enter",
        composed: true,
        ctrlKey: false,
        currentTarget: null,
        defaultPrevented: true,
        detail: 0,
        eventPhase: 0,
        isComposing: false,
        isTrusted: true,
        key: "Enter",
        keyCode: 13,
        location: 0,
        metaKey: false,
        repeat: false,
        returnValue: false,
        shiftKey: false,
        type: "keydown",
        which: 13
    });

    await txtbox.dispatchEvent(ev);
    // setTimeout(function() {
    var buttonSend = await document.getElementsByClassName("btnC");
    await buttonSend[0].click();
    await setTimeout(function () {
        window.close();
    }, 2000);
};
/* ---------------- END SENDING MESSAGES ------------------- */
//Start of Shiwani's Code


//Function for Setting the total no of Reply button count and Remember button count to local storage
/**
* @param {Integer} Total_reply_btns_count refresh button
* @param {Integer} remembered_btn_count  
 */

function setpayloads(Total_reply_btns_count, remembered_btn_count) {



    param_item.reply_btn = Total_reply_btns_count;
    param_item.remember_button = remembered_btn_count;
    console.log("Param item ", param_item);


    chrome.storage.sync.get(['settings'], function (res) {
        console.log("item get", res.settings)
        setting_item = res.settings;
        setting_item[param_item_position] = param_item;
        console.log("setting item", setting_item)

        chrome.storage.sync.set({ 'settings': setting_item }, function (res) {

            console.log("item set here")

        })
        chrome.storage.sync.get(['settings'], function (response) {
            console.log("get param item", response.settings)

        })

    })
}

//Function for getting Total Reply Button Count and Total Reply button count which yet to be replied
function buttonCount() {
    $(document).on("DOMNodeInserted", function () {


        console.log("node inserted")
        let reply_button = getReplyButtons(true);
        let replied_button = getReplyButtons()
        console.log("reply btn length", reply_button.length)
        console.log("remember btn length", replied_button.length)

        let remaining_button_count = 0;


        let reply_button_count = reply_button.length
        let replied_button_count = replied_button.length
        remaining_button_count = reply_button_count - replied_button_count

        reply_count = param_reply_count;

        remember_count = param_rem_count;

        if (reply_count == remember_count) {
            console.log("both buttons are equal")

            Total_reply_btns_count = reply_button_count
            console.log("Total reply btn count", Total_reply_btns_count)
            remembered_btn_count = remaining_button_count
            console.log("Total remember btn count", remembered_btn_count)
            setpayloads(Total_reply_btns_count, remembered_btn_count);

        }

        if (reply_count != remember_count) {
            console.log("both buttons are not equal")




            Total_reply_btns_count = reply_button_count + remember_count
            console.log("Total reply btn count", Total_reply_btns_count)
            remembered_btn_count = remember_count + remaining_button_count
            console.log("Total remember btn count", remembered_btn_count)
            setpayloads(Total_reply_btns_count, remembered_btn_count);


        }
    })
}
//End of Shiwani's Code