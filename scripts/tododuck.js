/* Global variables */
var adding = false;		//is a task being edited or added?
var username = "User";

var tasks = [];			//array holding all tasks
var shown = [];			//array holding all incomplete tasks
var completed = [];		//array holding completed tasks

var taskNum = tasks.length;

var defaultPriority = 3;
var maxPriority = 5;

var colorNotImportant = "#009688";
var colorSemiImportant = "#827717";
var colorVeryImportant = "#F57C00";
var colorUrgent = "#E53935";

var pickedCat = 0;

/*	On document ready
 *
 * Add event listeners, load tasks into task list
 */

$(document).ready(function () {	//ready the page
	//hide task editor. Could be done by default in CSS but jquery likes this better for fadeIn
	$("#task-editor").hide();
	$("#task-editor-overlay").hide();
	//set user's display name
	$("#username").text(username);
	
	//search
	$("#fixed-header-drawer-exp").change(function() {
		if ($("#fixed-header-drawer-exp").val() != "") {
			search();
		} else {
			for (var i in shown) {
				shown[i].domPtr.css("opacity", "1");
			}
		}
	});
	
	//fill in some typical values
	genDemo();
	
	//spawn tasks
	showTasks();
	
	//add task
	$("#add-task").click(function () {
		adding = true;
		$("#task-editor > .mdl-card__title > .mdl-card__title-text").text("Add task");
		$("#task-editor").fadeIn(200);
		$("#task-editor-overlay").fadeIn(200);
		
		editor = $("#task-editor");
		editor.find("#task-text").val("").parent().removeClass("is-dirty");	
		editor.find("#place").val("").parent().removeClass("is-dirty");	
		editor.find("#deadline").val("").parent().removeClass("is-dirty");	
		editor.find("#priority-slider").attr("max",maxPriority);
		editor.find("#priority-slider").get(0).MaterialSlider.change(defaultPriority);
	});
	
	//task editor
	$("#task-editor-overlay").click(function () {
		$("#task-editor").fadeOut(200);
		$("#task-editor-overlay").fadeOut(200);
	});
	$("#close-editor").click(function () {
		$("#task-editor").fadeOut(200);
		$("#task-editor-overlay").fadeOut(200);
	});
	$("#done-editing").click(function () {
		updateTask();
		$("#task-editor").fadeOut(200);
		$("#task-editor-overlay").fadeOut(200);
	});
	$("#show-all").click(function () {
		showTasks();
	});
	$("#show-completed").click(function () {
		showCompleted();
	});
	
	//category sorting
	$("#cat-work").click(function () {
		showCat(0);
	});
	$("#cat-studies").click(function () {
		showCat(1);
	});
	$("#cat-hobbies").click(function () {
		showCat(2);
	});
	$("#cat-chores").click(function () {
		showCat(3);
	});
	$("#cat-recreation").click(function () {
		showCat(4);
	});
	$("#cat-free").click(function () {
		showCat(5);
	});
	
	//category menu click listeners
	$("#menu-work").click(function(){ pickedCat = 0 });
	$("#menu-studies").click(function(){ pickedCat = 1 });
	$("#menu-hobbies").click(function(){ pickedCat = 2 });
	$("#menu-chores").click(function(){ pickedCat = 3 });
	$("#menu-recreation").click(function(){ pickedCat = 4 });
	$("#menu-free").click(function(){ pickedCat = 5 });
});


/*	newTask()
 * 
 * Generate a new task object
 */
function newTask() {
	return {
		origId:"",
		text:"",
		priority:defaultPriority,
		place:"",
		deadline:"",
		category:"",
		done:false,
		domPtr:null
	};
}

/*	sortTasks()
 * 
 * Sort tasks by priority
 */
function sortTasks() {
	shown.sort(function(a, b) {
		return b.priority - a.priority;
	});
}

/*	showTasks()
 *
 * Generate DOM objects from tasks list
 */
function showTasks() {
	sortTasks();
	
	var template = $("#empty-task");
	
	$("#task-list").empty();
	var current;
	
	var domObj;
	for (var i in shown) {
		//clone empty-task
		domObj = template.clone();
		current = shown[i];
		
		domObj.attr("id",i);
		domObj.find(".task-content").text(current.text);
		domObj.find(".urgency-holder").text(current.priority);
		domObj.find(".date-holder").text(current.deadline);
		domObj.find("#maps-link").attr("href","http://maps.google.com/?q="+current.place);
		domObj.find("#editor-link").on("click", { id:i }, function(event) { editTask(event.data.id); });
		domObj.find("#remove-link").on("click", { id:i }, function(event) { removeTask(event.data.id); });
		domObj.find("#complete-link").on("click", { id:i }, function(event) { completeTask(event.data.id); });
		
		// set deadline warning
		if (current.deadline == "") {
			domObj.find(".date-warning").hide();
		} else {
			domObj.find(".date-warning").show();
		}
		
		// color the priority holder
		if (current.priority >= maxPriority) {
			domObj.find(".urgency-holder").css("background-color", colorUrgent);
		} else if (current.priority > maxPriority * (2/3)) {
			domObj.find(".urgency-holder").css("background-color", colorVeryImportant);
		} else if (current.priority > maxPriority / 3) {
			domObj.find(".urgency-holder").css("background-color", colorSemiImportant);
		} else {
			domObj.find(".urgency-holder").css("background-color", colorNotImportant);
		}
		
		//make task visible
		domObj.css("display","block");
		shown[i].domPtr = domObj;
		$("#task-list").append(shown[i].domPtr);
	}
}

function showCompleted() {
	var template = $("#completed-task");
	
	$("#task-list").empty();
	var current;
	
	var domObj;
	for (var i in completed) {
		//clone completed-task
		domObj = template.clone();
		current = completed[i];
		
		domObj.attr("id",i);
		domObj.find(".task-content").text(current.text);
		domObj.find(".urgency-holder").text(current.priority);
		domObj.find(".date-holder").text(current.deadline);
		domObj.find("#remove-link").on("click", { id:i }, function(event) { removeDoneTask(event.data.id); });
		domObj.find("#complete-link").on("click", { id:i }, function(event) { readdTask(event.data.id); });
		domObj.find(".urgency-holder").css("background-color", "#999");
		domObj.find(".urgency-holder").css("margin-right", "8px");
		
		//make task visible
		domObj.css("display","block");
		completed[i].domPtr = domObj;
		$("#task-list").append(completed[i].domPtr);
	}
}
/*	removeDoneTask()
 * 
 */
function removeDoneTask(id) {
	var removing = completed.splice(id, 1);
	removing = removing[0];
	
	for (var i in tasks) {
		if (removing.origId == tasks[i].origId) {
			tasks.splice(i, 1);
		}
	}
	
	showCompleted();
}
/*	readdTask()
 * 
 * Add a completed task back to current tasks list.
 */
function readdTask(id) {
	var readding = completed.splice(id, 1);
	readding = readding[0];
	
	for (var i in tasks) {
		if (readding.origId == tasks[i].origId) {
			tasks.splice(i, 1);
		}
	}
	
	readding.origId = taskNum;
	taskNum++;
	tasks.push(readding);
	shown.push(readding);
	
	showCompleted();
}

/*	editTask()
 *
 * Open up task editor and load task's values into it.
 */
function editTask(id) {
	adding = false;
	
	var editor = $("#task-editor");
	var task = shown[id];
	
	editor.find("#editing-index").val(id);
	editor.find("#task-text").val(task.text).parent().addClass("is-dirty");			//mark as dirty to remove helper text
	editor.find("#place").val(task.place).parent().addClass("is-dirty");			//mark as dirty to remove helper text
	editor.find("#deadline").val(task.deadline).parent().addClass("is-dirty");		//mark as dirty to remove helper text
	editor.find("#priority-slider").attr("max",maxPriority);
	editor.find("#priority-slider").get(0).MaterialSlider.change(task.priority);	//needs HTML element to call change method
	
	$("#task-editor > .mdl-card__title > .mdl-card__title-text").text("Edit task");
	$("#task-editor").fadeIn(200);
	$("#task-editor-overlay").fadeIn(200);
}

/*	removeTask()
 * 
 */
function removeTask(id) {
	var removing = shown.splice(id, 1);
	removing = removing[0];
	
	for (var i in tasks) {
		if (removing.origId == tasks[i].origId) {
			tasks.splice(i, 1);
		}
	}
	
	showTasks();
}

/*	completeTask()
 * 
 */
function completeTask(id) {
	var completing = shown.splice(id, 1);
	completing = completing[0];
	
	completing.done = true;
	completed.push(completing);
	
	console.log(completed);
	
	showTasks();
}

/*	updateTask()
 *
 * Caled after task editor is closed via "Done" button.
 */
function updateTask() {
	var editor = $("#task-editor");
	
	if (adding) {
		var newT = newTask();
		newT.origId = taskNum;
		taskNum++;
		tasks.push(newT);
		shown.push(newT);
		var id = shown.length - 1;
	} else {
		var id = editor.find("#editing-index").val();
	}
	
	var task = shown[id];
	
	task.text = editor.find("#task-text").val();
	task.place = editor.find("#place").val();
	task.deadline = editor.find("#deadline").val();
	task.priority = editor.find("#priority-slider").get(0).value;
	task.category = pickedCat;
	
	showTasks();
}

/*	search()
 * 
 * Look through tasks for queried text.
 */
function search() {
	var lookingFor = $("#fixed-header-drawer-exp").val();
	
	for (var i in shown) {
		if (shown[i].text.match(new RegExp(lookingFor, "i")) != null) {
			shown[i].domPtr.css("opacity", "1");
		} else {
			shown[i].domPtr.css("opacity", "0.5");
		}
	}
}

/*	showCat()
 *
 * Show which tasks fall into a given category
 */
function showCat(catID) {
	for (var i in shown) {
		if (shown[i].category == catID) {
			shown[i].domPtr.css("opacity", "1");
		} else {
			shown[i].domPtr.css("opacity", "0.5");
		}
	}
}

/*	genDemo()
 * 
 * Fill in some typical values and tasks.
 */
function genDemo() {
	var task = newTask();
	task.text = "Preglej snov za predavanje SP";
	task.deadline = "24/11/2015";
	task.place = "Večna Pot 113";
	task.priority = 4;
	task.category = 1;
	tasks.push(task);
	task = newTask();
	task.text = "Rezerviraj karte za fuzbal tekmo";
	task.deadline = "21/11/2015";
	task.place = "Arena Stožice";
	task.priority = 5;
	task.category = 2;
	tasks.push(task);
	task = newTask();
	task.text = "Preveri za nove epizode priljubljenih serij";
	task.deadline = "";
	task.priority = 1;
	task.category = 5;
	tasks.push(task);
	task = newTask();
	task.text = "Pospravi sobo";
	task.deadline = "20/11/2015";
	task.priority = 2;
	task.category = 3;
	tasks.push(task);
	
	for (var i in tasks) {
		tasks[i].origId = i;
		shown.push(tasks[i]);
		taskNum++;
	}
}
