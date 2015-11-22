/* Global variables */
var firstTyped = false;

$(document).ready(function () {	//ready the page
	$("#mail-check").hide();
	$("#pass-check").hide();
	$("#registration").hide();
	$("#registration-overlay").hide();
	
	//register
	$("#register-button").click(function () {
		$("#registration").fadeIn(200);
		$("#registration-overlay").fadeIn(200);
	});
	
	//password comparing
	$("#desired-password").change( function() {
		if (!firstTyped) {
			firstTyped = true;	//just so it doesn't complain right when you type 1st pass
		} else {
			comparePass();
		}
	});
	$("#desired-password-2").change(function() { comparePass() });
	
	//registration
	$("#cancel-registration").click(function () {
		$("#registration").fadeOut(200);
		$("#registration-overlay").fadeOut(200);
	});
	$("#confirm-registration").click(function () {
		$("#registration").fadeOut(200);
		$("#registration-overlay").fadeOut(200);
	});
});

function comparePass() {
	if ($("#desired-password").val() == $("#desired-password-2").val()) {
		$("#pass-check").hide();
	} else {
		$("#pass-check").show();
	}
}
