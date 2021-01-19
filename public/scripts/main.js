var rhit = rhit || {};

/** globals */
rhit.variableName = "";

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

rhit.PreviewPageController = class {
	constructor() {

		document.querySelector("#enableListItem").addEventListener("click", (event) => {
			document.querySelector("#enableListItemIcon").innerHTML =
			 document.querySelector("#enableListItemIcon").innerHTML == "radio_button_checked" ? "radio_button_unchecked" : "radio_button_checked";
		})

		document.querySelector("#refreshListItem").addEventListener("click", (event) => {
			window.location.reload();
		})

		document.querySelector("#resetListItem").addEventListener("click", (event) => {
			this.resetElements();
		})
	}

	resetElements() {
		document.querySelector("#titleText").innerHTML = "Lorem Ipsum Dolor Sit Amet"
		document.querySelector("#paragraphText1").innerHTML = "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		document.querySelector("#paragraphText2").innerHTML = "<img id=\"sampleImg\" src=\"https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg\" alt=\"sampleImg\">Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Morbi tristique senectus et netu set. Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new this.PreviewPageController();
};

rhit.main();
