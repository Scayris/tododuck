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
		
		editor.find("#editing-index").val("");
		editor.find("#task-text").val("");
		editor.find("#place").val("");
		editor.find("#deadline").val("");
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
	
	$("#task-list").empty().append(template);
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

/*	editTask()
 *
 * Open up task editor and load task's values into it.
 */
function editTask(id) {
	adding = false;
	$("#task-editor > .mdl-card__title > .mdl-card__title-text").text("Edit task");
	$("#task-editor").fadeIn(200);
	$("#task-editor-overlay").fadeIn(200);
	
	var editor = $("#task-editor");
	var task = shown[id];
	
	editor.find("#editing-index").val(id);
	editor.find("#task-text").val(task.text).parent().addClass("is-dirty");			//mark as dirty to remove helper text
	editor.find("#place").val(task.place).parent().addClass("is-dirty");			//mark as dirty to remove helper text
	editor.find("#deadline").val(task.deadline).parent().addClass("is-dirty");		//mark as dirty to remove helper text
	editor.find("#priority-slider").attr("max",maxPriority);
	editor.find("#priority-slider").get(0).MaterialSlider.change(task.priority);	//needs HTML element to call change method
	
}

/*	removeTask()
 * 
 */
function removeTask(id) {
	var removing = shown.splice(id, 1);
	
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
	completed.done = true;
	completed.push(completing);
	
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
	
	showTasks();
}

/*	search()
 * 
 * Look through tasks for queried text.
 */
function search() {
	var lookingFor = $("#fixed-header-drawer-exp").val();
	alert(lookingFor);
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
	tasks.push(task);
	task = newTask();
	task.text = "Rezerviraj karte za fuzbal tekmo";
	task.deadline = "21/11/2015";
	task.place = "Arena Stožice";
	task.priority = 5;
	tasks.push(task);
	task = newTask();
	task.text = "Pospravi sobo";
	task.deadline = "20/11/2015";
	task.priority = 2;
	tasks.push(task);
	
	for (var i in tasks) {
		tasks[i].origId = i;
		shown.push(tasks[i]);
		taskNum++;
	}
}
