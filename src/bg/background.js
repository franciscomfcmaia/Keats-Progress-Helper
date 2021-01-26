//Send messages to current content script
var content = {
  selectAllModules : function(){
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendRequest(tab.id, {cmd : "selectAllModules", payload : null}, null);
    });
  },
  deleteAllActivities : function(){
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendRequest(tab.id, {cmd : "deleteAllActivities", payload : null}, null);
    });
  }
}
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
//Arrays equal
function arraysEqual(_arr1, _arr2) {
    if (
      !Array.isArray(_arr1)
      || !Array.isArray(_arr2)
      || _arr1.length !== _arr2.length
      ) {
        return false;
      }

    // .concat() is used so the original arrays are unaffected
    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
         }
    }

    return true;
}
//Checks if object is in array
function containsObject(obj, list, keys_to_check) {
    var x;
    var checked = [];
    for (x in list) {
      checked = []
      for(y in keys_to_check){
        key_to_check = keys_to_check[y]
        if(obj.hasOwnProperty(key_to_check) && list[x].hasOwnProperty(key_to_check)){
          if(obj[key_to_check] == list[x][key_to_check]){
            checked.push(key_to_check)
            if(arraysEqual(checked, keys_to_check)){
              return true
            }
          }else{
            //
          }
        }else{
          //
        }
      }
    }
    return false;
}

//Create list without object
function filter_array(obj, list){
  var new_list = []
  for(x in list){
    current_obj = list[x]
    if(!containsObject(obj, [current_obj], ["resourceURL"])){
      new_list.push(current_obj)
    }
  }
  return new_list
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
  fifoBuffer : [],
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
  directWrite : function(entries, callback){
    this.setProgressDataFromCurrentTab(entries, function(result){
      callback(true)
    });
  },
  processCurrentModuleEntry : function(entry, callback, more_coming = false){
    //Get module stage from tab
    console.log(entry)
    var writeData = (completed_activities_new) => {
      if(more_coming){
        for(activityIndex in completed_activities_new){
          activity = completed_activities_new[activityIndex]
          if(!containsObject(activity, this.fifoBuffer, ["resourceURL"])){
            this.fifoBuffer.push(activity)
            callback(true)
          }
        }
      }else{
        console.log(`Currently in buffer ${this.fifoBuffer.length}`)
        if(this.fifoBuffer.length == 0){
          this.setProgressDataFromCurrentTab(completed_activities_new, function(result){
            callback(true)
          });
        }else{
          console.log(`Flushing ${this.fifoBuffer.length} entries...`)
          this.setProgressDataFromCurrentTab(this.fifoBuffer, function(result){
            this.fifoBuffer = []
            callback(true)
          });
        }
      }
    }
    this.getProgressDataFromCurrentTab((items) => {
      if(!(Object.keys(items).length === 0 && items.constructor === Object)){
        var completed_activities = items[Object.keys(items)[0]];
        if(containsObject(entry, completed_activities, ["resourceURL"])){
          if(entry.activityStatus){
            //do nothing
            callback(true)
          }else{
            completed_activities_new = filter_array(entry, completed_activities)
            writeData(completed_activities_new)
          }
        }else{
          if(entry.activityStatus){
            completed_activities.push(entry)
            writeData(completed_activities)
          }
        }
      }else{
        //Module has not been initialised yet.
        if(entry.activityStatus){
          writeData([entry])
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
    //if user is in main dashboard
    if(request.cmd=="isNavigatedDashboard"){
      getCurrentTabUrl(function(url){
        if(url!=null){
          sendResponse(url.endsWith("keats.kcl.ac.uk/my/"))
        }else{
          sendResponse(false)
        }
      });
    }
    if(request.cmd=="processCurrentModuleEntry"){
      keatsProgressData.processCurrentModuleEntry(request.payload.data, function(status){
        sendResponse(status)
      }, request.payload.more_coming);
    }
    if(request.cmd=="directWrite"){
      keatsProgressData.directWrite(request.payload.data, function(status){
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
var clear_storage = function(){
    chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
          console.error(error);
      }
  });
}
//contextMenus
chrome.contextMenus.create({
    id: "keats_progress",
    title: "Keats Progress",
    contexts: ["all"]
});
chrome.contextMenus.create({
  title: "Mark All As Completed",
  parentId: "keats_progress",
  onclick: content.selectAllModules
});
chrome.contextMenus.create({
  title: "Delete Page Progress",
  parentId: "keats_progress",
  onclick: content.deleteAllActivities
});
chrome.contextMenus.create({
  title: "Clear Local Storage",
  parentId: "keats_progress",
  onclick: clear_storage
});
