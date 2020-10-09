//Main functionality Object
var keatsProgress = {
	getModuleProgress : function(callback){
		chrome.runtime.sendMessage({cmd :"getModuleProgress"}, function(response) {
			callback(response);
		});
	},
	modifyPrgressEntry : function(entry, callback){
		chrome.runtime.sendMessage({cmd : "processCurrentModuleEntry", payload : entry}, function(response) {
			console.log(response)
		});
		callback(true)
	},
	updateProgress : function(percentage){
		chrome.runtime.sendMessage({cmd : "updateProgress", payload : percentage}, null);
	}
}

var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		//Read saved Progress
		var totalNumberOfActivities = 0
		function handleClick(cb) {
			console.log("Clicked, new value = " + cb.checked);
		}
		clearInterval(readyStateCheckInterval);

		//Grab all the activity instances
		totalNumberOfActivities = $(".instancename").length
		$(".instancename").each(function(activityElementIndex){
			var activityElement = $(this);
			activityElement.parent().parent().prepend(
				`<input type="checkbox" id="keats_progress_${activityElementIndex}" name="keats_progress">`);
		});

		//Write current module stage to screen
		keatsProgress.getModuleProgress(function(response){
			var moduleProgress = response[Object.keys(response)[0]]
			moduleProgress.forEach((activity) => {
				var activityElement = $(`#${activity}`)
				if(activityElement != null){
					activityElement.prop('checked', true);
				}
			});
			//Update progress badge
			updateProgress()
		});
		//Update visual progress
		var updateProgress = function(){
			var percentageCompleted = $('input[type=checkbox]:checked').length/totalNumberOfActivities
			percentageCompleted = percentageCompleted*100
			percentageCompleted = percentageCompleted.toFixed(0)
			keatsProgress.updateProgress(percentageCompleted)
		}
		//Listen to Checkboxes
		$("input:checkbox").change(function(){
			var activityID = $(this).attr('id');
			var activityChecked = $(this).prop('checked')
			var entry = {
				activityID : activityID,
				activityStatus : activityChecked
			}
			keatsProgress.modifyPrgressEntry(entry,
				function(changeStatus){
					console.log(changeStatus)
				});
			//Equate percentage completed
			updateProgress()
		});
	}
}, 10);
