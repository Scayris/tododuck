/* Global variables */
var adding = false;		//is a task being edited or added?


/*	On document ready
 *
 * Add event listeners, load tasks into task list
 */

$(document).ready(function () {	//ready the page
	//hide task editor. Could be done by default in CSS but jquery likes this better for fadeIn
	$("#task-editor").hide();
	$("#task-editor-overlay").hide();
	
	//add task
	$("#add-task").click(function () {
		adding = true;
		$("#task-editor > .mdl-card__title > .mdl-card__title-text").text("Add task");
		$("#task-editor").fadeIn(200);
		$("#task-editor-overlay").fadeIn(200);
	});
	
	//task editor
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


/*	updateTask()
 *
 * Caled after task editor is closed via "Done" button.
 */
function updateTask() {
	
}
