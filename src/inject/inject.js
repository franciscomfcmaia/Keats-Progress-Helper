//Main functionality Object
var keatsProgress = {
	getModuleProgress : function(callback){
		chrome.runtime.sendMessage({cmd :"getModuleProgress"}, function(response) {
			callback(response);
		});
	},
	directWrite : function(entries, callback){
		chrome.runtime.sendMessage({cmd : "directWrite", payload : {data : entries}}, function(response) {
			callback(response)
		});
	},
	modifyPrgressEntry : function(entry, callback, more_coming = false){
		chrome.runtime.sendMessage({cmd : "processCurrentModuleEntry", payload : {data : entry, more_coming : more_coming}}, function(response) {
			//console.log(response)
		});
		callback(true)
	},
	updateProgress : function(percentage){
		chrome.runtime.sendMessage({cmd : "updateProgress", payload : percentage}, null);
	},
	isNavigatedDashboard : function(callback){
		chrome.runtime.sendMessage({cmd : "isNavigatedDashboard", payload : null}, function(response){
			callback(response)
		});
	}
}
//Update visual progress
var totalNumberOfActivities = 0
var updateProgress = function(){
	var percentageCompleted = $('input[type=checkbox]:checked').length/totalNumberOfActivities
	percentageCompleted = percentageCompleted*100
	percentageCompleted = percentageCompleted.toFixed(0)
	keatsProgress.updateProgress(percentageCompleted)
}
//Element Parser
function parseActivityElement(activityElement, status = null){
	var activityID = $(activityElement).attr('id');
	var activityName = $(activityElement).attr('activityname');
	var activityType = $(activityElement).attr('activitytype');
	if(status == null){
		var activityChecked = $(activityElement).prop('checked');
	}else{
		var activityChecked = status;
	}
	var resourceURL = $(activityElement).attr('resourceURL');
	var entry = {
		activityID : activityID,
		activityName : activityName,
		activityType : activityType,
		resourceURL : resourceURL,
		activityStatus : activityChecked
	}
	return entry
}
var writeToScreen = function(){
	//Write current module stage to screen
	keatsProgress.getModuleProgress(function(response){
		//console.log(response)
		var moduleProgress = response[Object.keys(response)[0]]
		if(moduleProgress != undefined){
			if(moduleProgress.hasOwnProperty("length")){
				if(moduleProgress.length >= 1){
					moduleProgress.forEach((activity) => {
						//console.log(activity)
						activityID = activity.activityID
						var activityElement = $(`input[resourceURL="${activity.resourceURL}"]`)
						//console.log(activityElement.length)
						if(activityElement != null){
							activityElement.prop('checked', true);
						}else{
							activityElement.prop('checked', false);
						}
					});
				}
			}
		}
		//Update progress badge
		updateProgress()
	});
}
var injectPage = function(){
	//Check where we are. This will change operational mode.
	//console.log("Runing content script...")
	keatsProgress.isNavigatedDashboard(function(inDashBoard){
		if(inDashBoard){
			//User is in dashboard
		}
	});
	//Read saved Progress
	function handleClick(cb) {
		//console.log("Clicked, new value = " + cb.checked);
	}
	clearInterval(readyStateCheckInterval);

	//Grab all the activity instances
	var activity = {}
	totalNumberOfActivities = $(".instancename").length
	$(".instancename").each(function(activityElementIndex){
		var activityElement = $(this);
		var resourceURLElement = $(this).closest('.aalink');
		if (activityElement.length >= 1){
			activityName = activityElement[0].innerHTML.substr(0, activityElement[0].innerHTML.indexOf('<span class="accesshide ">'));
			activityType = activityElement[0].innerHTML.substr(activityElement[0].innerHTML.indexOf('<span class="accesshide ">'));
			activityType = activityType.replace('<span class="accesshide ">', "")
			activityType = activityType.replace('</span>', "")
			resourceURL = resourceURLElement.attr('href');
		}else{
			activityName = "undefined"
			activityType = "undefined"
		}
		activityElement.parent().parent().prepend(
			`<input type="checkbox" id="keats_progress_${activityElementIndex}" activityname="${activityName}" resourceURL="${resourceURL}" activitytype="${activityType.trim()}"  name="keats_progress">`);
	});
	writeToScreen()
	//Listen to Checkboxes
	$("input:checkbox").change(function(){
		var entry = parseActivityElement(this)
		keatsProgress.modifyPrgressEntry(entry,
			function(changeStatus){
				//console.log(changeStatus)
			});
		//Equate percentage completed
		updateProgress()
	});
}
var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		injectPage()
	}
}, 10);

var send_entries = function(entries, index, callback){
	keatsProgress.directWrite()
	if(entries.hasOwnProperty("length")){
		if(typeof entries[index] === 'undefined'){
			callback(null)
			updateProgress()
		}else{
			keatsProgress.modifyPrgressEntry(entries[index],
				function(changedStatus){
					send_entries(entries, (index+1), callback)
				}, !(typeof entries[index+1] === 'undefined'));
		}
	}
}

var keatsPage = {
	activities : null,
	setAllActivitiesCompleted : function(callback){
		var entries = []
		var instanceActivities = document.getElementsByName("keats_progress");
		instanceActivities.forEach(function(activityElement){
			var entry = parseActivityElement(activityElement, true)
			entry.activityStatus = true
			entries.push(entry)
		});
		keatsProgress.directWrite(entries, function(err){
			writeToScreen()
			//console.log(err)
		});

	},
	deleteAllActivities : function(callback){
		keatsProgress.directWrite([], function(err){
			callback()
			//console.log(err)
		});
	}
}

//Listeners
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.cmd=="selectAllModules"){
		keatsPage.setAllActivitiesCompleted(function(err){
			//console.log(err)
		});
	}
	if(request.cmd=="deleteAllActivities"){
		keatsPage.deleteAllActivities(function(err){
			var checkedElements = $('input[type=checkbox]:checked')
			//console.log(checkedElements)
			var checkedElementsIndex = 0;
			for (checkedElementsIndex = 0; checkedElementsIndex < checkedElements.length; checkedElementsIndex++) {
				$(checkedElements[checkedElementsIndex]).prop('checked', false);
			}
			//console.log(err)
		});
	}
});
