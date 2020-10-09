//This returns the current URL
function getCurrentTabUrl(callback) {
  try {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      // use `url` here inside the callback because it's asynchronous!
      callback(url)
    });
  } catch(err) {
    //alert(err)
    callback(null)
  }
}

//This returns the module ID from the keats page
function getCurrentModuleID(callback){
  getCurrentTabUrl(function(url){
    if(url!=null){
      try{
        var url = new URL(url);
        var moduleID = url.searchParams.get("id");
        callback(moduleID)
      } catch(err) {
        //alert(err)
        callback(null)
      }
    }else{
      callback(null)
    }
  });
}

var keatsProgressData = {
  getProgressDataFromCurrentTab : function(callback){
    getCurrentModuleID(function(moduleID){
      if(moduleID!=null){
        chrome.storage.local.get(moduleID, function(items){
          callback(items)
        });
      }
    })
  },
  setProgressDataFromCurrentTab : function(completed_activities, callback){
    getCurrentModuleID(function(moduleID){
      if(moduleID!=null){
        chrome.storage.local.set({ [moduleID] : completed_activities}, function(items){
          callback(true)
        });
      }
    });
  },
  processCurrentModuleEntry : function(entry, callback){
    //Get module stage from tab
    this.getProgressDataFromCurrentTab((items) =>{
      if(!(Object.keys(items).length === 0 && items.constructor === Object)){
        var completed_activities = items[Object.keys(items)[0]];
        if(completed_activities.includes(entry.activityID)){
          if(entry.activityStatus){
            //do nothing
            callback(true)
          }else{
            completed_activities_new = completed_activities.filter(e => e !== entry.activityID);
            this.setProgressDataFromCurrentTab(completed_activities_new, function(result){
              callback(true)
            });
          }
        }else{
          if(entry.activityStatus){
            completed_activities.push(entry.activityID)
            this.setProgressDataFromCurrentTab(completed_activities, function(result){
              callback(true)
            });
          }
        }
      }else{
        //Module has not been initialised yet.
        if(entry.activityStatus){
          this.setProgressDataFromCurrentTab([entry.activityID], function(result){
            callback(true)
          });
        }
      }
    });
  }
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.cmd=="getModuleProgress"){
      keatsProgressData.getProgressDataFromCurrentTab(function(progressData){
        sendResponse(progressData)
      });
    }
    if(request.cmd=="processCurrentModuleEntry"){
      keatsProgressData.processCurrentModuleEntry(request.payload, function(status){
        sendResponse(status)
      });
    }
    if(request.cmd=="updateProgress"){
      chrome.browserAction.setBadgeText({text: `${request.payload}%`});
      if(request.payload<=50){
        //Red notification
        chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000"});
      }else if (request.payload<=99){
        //Orange notification
        chrome.browserAction.setBadgeBackgroundColor({ color: "#eaa82f"});
      }else{
        //Green notification
        chrome.browserAction.setBadgeBackgroundColor({ color: "#47a947"});
      }

    }
    return true;
});
//Off events, these are for when user might have left keats
chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it (like read the url)
    if (changeInfo.url) {
      chrome.browserAction.setBadgeText({text: ''});
    }
  }
);
