/* Global variables */
var adding = false;		//is a task being edited or added?
var username = "User";

var tasks = [];			//array holding all the tasks.
var shown = [];			//array holding the currently displayed tasks.

var defaultPriority = 3;

var clickedTask;

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
		text:"",
		priority:defaultPriority,
		place:"",
		deadline:"",
		category:"",
		done:0,
		domPtr:null
	};
}

/*	showTasks()
 *
 * Generate DOM objects from tasks list
 */
function showTasks() {
	var template = $("#empty-task");
	
	$("#task-list").empty().append(template);
	var current;
	
	var domObj;
	for (var i in shown) {
		//clone empty-task
		domObj = template.clone();
		current = shown[i];
		
		var j = i;
		
		domObj.attr("id",i);
		domObj.find(".task-content").text(current.text);
		domObj.find(".urgency-holder").text(current.priority);
		domObj.find("#maps-link").attr("href","http://maps.google.com/?q="+current.place);
		domObj.find("#editor-link").on("click", { id:i }, function(event) { editTask(event.data.id); });
		
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
	var task = tasks[id];
	
	editor.find("#task-text").val(task.text).parent().addClass("is-dirty");			//mark as dirty to remove helper text
	editor.find("#place").val(task.place).parent().addClass("is-dirty");			//mark as dirty to remove helper text
	editor.find("#deadline").val(task.deadline).parent().addClass("is-dirty");		//mark as dirty to remove helper text
	editor.find("#priority-slider").get(0).MaterialSlider.change(task.priority);	//needs HTML element to call change method
	
}

/*	updateTask()
 *
 * Caled after task editor is closed via "Done" button.
 */
function updateTask() {
	
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
	task.priority = 5;
	tasks.push(task);
	task = newTask();
	task.text = "Rezerviraj karte za fuzbal tekmo";
	task.deadline = "21/11/2015";
	task.place = "Arena Stožice";
	task.priority = 7;
	tasks.push(task);
	task = newTask();
	task.text = "Pospravi sobo";
	task.deadline = "20/11/2015";
	task.priority = 2;
	tasks.push(task);
	
	for (var i in tasks) {
		shown.push(tasks[i]);
	}
}
