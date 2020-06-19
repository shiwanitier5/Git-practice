console.log("Enter to funnel page.");
var $ = jQuery = require('jquery');

var port = chrome.extension.connect({
  name: "Popup-Background"
});

chrome.storage.sync.get(['settings'], function (res) {
  console.log("items",res.settings);
  if(res.settings!=undefined && res.settings!=null)
  {
      window.location.href='funnels.html';
  }
  else{
      window.location.href='dashboard.html';
  }
});

$(document).ready(function () {
  let datas = [];
  let i = 0;

  chrome.storage.sync.get(['settings'], function (res) {
    if (res.settings != null && res.settings != undefined) {
      datas = res.settings;
    } else {
      window.location.href = "dashboard.html";
    }
    console.log("items", datas);
    if (!datas.length) window.location.href = "dashboard.html";

    let card_length = datas.length;
    console.log("No. of cards: ", card_length);
    if (res.settings != null && res.settings != undefined) {
      // var loopStartOpt1 = performance.now();


      //creating and appending cards in popup
      $(datas).get().reverse().forEach(function (value, index) {
        console.log("value of stroge in String Format", JSON.stringify(value));


        $("#content_list").append(`<div class="cf_funnel" id="cf_funnel` + i + `">
          <div class="funnel_info">
            <div class="funnel_txt">
              <h4 id="title`+ i + `" class="tittle">Post Filter Teaser</h4>
              <p id ="description`+ i + `">Funnel created to automate post filter feature teaser</p>
              <button class="btn viewPost" id="viewPost`+ i + `">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" class="shape_view"><path class="a" d="M8,6A2,2,0,0,1,6,8,2,2,0,1,0,8,6ZM8,2C3.9,2,0,6.648,0,8s3.9,6,8,6,8-4.648,8-6S12.1,2,8,2ZM8,12a4,4,0,1,1,4-4A4,4,0,0,1,8,12Z" transform="translate(0 -2)"/></svg>
                View Post
              </button>
            </div>
            <div class="funnel_stat">
              <div class="post_button">
                <button class="btn playContent post_play" id="post_play`+ i + `">
                  <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" class="cf_play">
                    <g transform="translate(-0.25 -0.25)">
                      <circle class="a" cx="18" cy="18" r="18" transform="translate(1.75 1.75)" />
                      <path class="a" d="M10,8l10.65,7.1L10,22.2Z" transform="translate(6.2 4.65)" />
                    </g>
                  </svg>
                </button>
                <button class="btn playContent post_pause">
                  <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" class="cf_pause"><g transform="translate(-0.5 -0.5)"><circle class="a" cx="18" cy="18" r="18" transform="translate(2 2)"/><line class="a" y1="10" transform="translate(16 15)"/><line class="a" y1="10" transform="translate(24 15)"/></g></svg>
                </button>
              </div>
              <div class="post_stat">
                <span class="remember_btn_count" id="remember_btn_count`+ i + `"><em class="reply_btn_count" id="reply_btn_count` + i + `">` + JSON.stringify(value.remember_button) + `</em>/` + JSON.stringify(value.reply_btn) + `</span>
                <div class="stat_bar">
                <span class="stat_done" style="width:45%;"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="funnel_control">
          <a href="" class="cf_edit" id="cf_edit`+ i + `">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" class="shape_edit"><path class="a" d="M2.453,9.3C1.754,10,1,13.7,1,14a.993.993,0,0,0,1,1c.3,0,4-.754,4.7-1.453l5.722-5.722-4.25-4.25ZM12,1a3.045,3.045,0,0,0-2.141.891l-.284.284,4.25,4.25.284-.284A3.041,3.041,0,0,0,15,4,3,3,0,0,0,12,1Z" transform="translate(-1 -1)"/></svg>
          </a>
          <a href="" class="cf_refresh"  id="cf_refresh`+ i + `">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" class="shape_refresh"><path class="a" d="M14,8a1,1,0,0,0-1,.883A5.183,5.183,0,0,1,8,13a4.947,4.947,0,0,1-2.114-.474L6.414,12c.359-.344.586-.555.586-1a1.013,1.013,0,0,0-1-1H3a.991.991,0,0,0-1,1v3a1,1,0,0,0,1,1c.484,0,.688-.273,1-.594L4.408,14A6.933,6.933,0,0,0,8,15a7.241,7.241,0,0,0,7-5.938A1,1,0,0,0,14,8ZM3,7.117A5.184,5.184,0,0,1,8,3a4.946,4.946,0,0,1,2.114.473L9.586,4C9.227,4.344,9,4.555,9,5a1.013,1.013,0,0,0,1,1h3a.991.991,0,0,0,1-1V2a1,1,0,0,0-1-1c-.484,0-.688.273-1,.594L11.592,2A6.933,6.933,0,0,0,8,1,7.241,7.241,0,0,0,1,6.938a1,1,0,0,0,2,.179Z" transform="translate(-1 -1)"/></svg>
          </a>
          <a href="" class="cf_delete" id="cf_delete`+ i + `">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" class="shape_remove"><g transform="translate(-2)"><g transform="translate(2)"><path class="a" d="M13.964,8h-9.2a.6.6,0,0,0-.667.647l1.067,7.707a1.268,1.268,0,0,0,1.334,1h5.667a1.268,1.268,0,0,0,1.334-1l1.067-7.707A.554.554,0,0,0,13.964,8Z" transform="translate(-2.859 -3.354)"/><path class="a" d="M13.7,1.177H10.45A1.247,1.247,0,0,0,9.15,0H7.85a1.247,1.247,0,0,0-1.3,1.177H3.3A1.247,1.247,0,0,0,2,2.353v.588a.587.587,0,0,0,.65.588h11.7A.587.587,0,0,0,15,2.942V2.353A1.247,1.247,0,0,0,13.7,1.177Z" transform="translate(-2)"/></g></g></svg>
          </a>
        </div>
      </div>`);
        i++;
      });
    }
    i = i - 1;
    // i=0;
    datas.forEach(function (value, index) {
      //showing title in card
      console.log("title is added::: ", value.card_title);
      if (value.card_description.length == 0) {
        $("#title" + i).html("No title");
      } else {
        $("#title" + i).html(value.card_title);
      }

      //showing description in card
      if (value.card_description.length == 0) {
        $("#description" + i).html("No description");

      } else {
        $("#description" + i).html(value.card_description);
      }

      //view post
      $("#viewPost" + i).click(function () {
        chrome.tabs.create({ url: value.post_url }, function (tab) {
          console.log("tab ::: ", tab);
        });
      });

      //edit card
      $("#cf_edit" + i).click(function () {
        window.open(chrome.extension.getURL("settings.html?post_id=" + value.post_url + "&edit=true"));
      })

      //Start of Shiwani's Code
      //Refresh Card
      $("#cf_refresh" + i).click(function () {
        refresh(this, index)


      })

      //End

      //delete card
      $("#cf_delete" + i).click(function () {
        console.log("Delete button pressed.");
        //   datas=datas.filter(function(res){
        //   res.post_url!=value.post_url;
        // });

        let confirmMsg = confirm("Are you Sure?You want to delete this card?")
        if (confirmMsg == true) {
          chrome.storage.sync.get(['settings'], function (res) {
            let arr = [];
            if (res.settings != null && res.settings != undefined) {
              arr = res.settings;
            }
            let new_set_arr = arr.filter(function (res) {
              return res.post_url != value.post_url;
            });
            console.log("without deleted item: ", new_set_arr);
            chrome.storage.sync.set({ settings: new_set_arr }, function () {
              console.log("Data is saved");
            });
          });
          $("#cf_funnel").remove(function () {
            console.log("Card removed.");
          });
        }
      });

      $("#post_play" + i).click(function () {
        openUrlSendMessage(value, index);
      })
      i--;

    });

  });
});




function openUrlSendMessage(payloads, pos) {
  const payload = {
    action: "startReplying",
    position: pos,
    payload: payloads
  }


  port.postMessage(payload);
}



//Start of Shiwani's Code

//Function for Refreshing Cards
/**
* @param {Object} current_target Selected refresh button for which button have clicked
* @param {Integer} i index of selected refresh button
 * @returns Updated count of Reply button and Remember button of selected refresh button
 */
function refresh(current_target, i) {

  let cf_selector = $(current_target).closest(".cf_funnel")
  let target = $(cf_selector).find(".remember_btn_count")
  console.log("cf_funnel", target);
  console.log("total_count text", $(target).html());
  getpayloads(target, i);




}

//Function for Getting the total no of Reply button count and Remember button count from local storage
/**
* @param {Object} target selected refresh button
* @param {Integer} i index of selected refresh button
* @returns Replace the html of the current selected refresh button's Reply button and Remember button count
 */

function getpayloads(target, i) {
  chrome.storage.sync.get(['settings'], function (response) {
    console.log("getitem", response.settings)
    let getitem = response.settings[i]

    console.log("get item is here for funnel.js after swapping", getitem)
    if (getitem.reply_btn != null && getitem.reply_btn != undefined) {
      Reply_button = getitem.reply_btn;
      console.log("reply_count", Reply_button)
    }

    if (getitem.remember_button != null && getitem.remember_button != undefined) {
      Remember_button = getitem.remember_button;
      console.log("remember_count", Remember_button)
    }

    let replaced_text = $(target).html('<span class="remember_btn_count"><em class="reply_btn_count">' + Remember_button + '</em>/' + Reply_button + '</span>')

    console.log("replaced text", $(replaced_text).text());
  })
}

//End of Shiwani's Code