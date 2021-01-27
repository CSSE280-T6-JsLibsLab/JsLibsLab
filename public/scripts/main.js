var rhit = rhit || {};

rhit.DEFAULT_PREVIEW_IMAGE_HTML = "<img id=\"sampleImg\" src=\"https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg\" alt=\"sampleImg\">"

function htmlToElement(html) {
	var template = document.createElement("template");
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.PreviewPageController = class {
	constructor() {
		document.querySelector("#enableListItem").addEventListener("click", (event) => {
			if (document.querySelector("#enableListItemIcon").innerHTML == "radio_button_checked") {
				document.querySelector("#enableListItemIcon").innerHTML = "radio_button_unchecked";
				endEffect();
				document.querySelector("#colorpicker").style.display = "none";
				clearEffectEditablePage();
				clearEffectFlyingPics();
			} else {
				document.querySelector("#enableListItemIcon").innerHTML = "radio_button_checked";
				startEffect();
				document.querySelector("#colorpicker").style.display = "block";
				startEffectEditablePage();
				startEffectFlyingPics();
			}
		})

		document.querySelector("#refreshListItem").addEventListener("click", (event) => {
			window.location.reload();
		})

		document.querySelector("#resetListItem").addEventListener("click", (event) => {
			this.resetElements();
		})

		document.querySelector("#manageListItem").addEventListener("click", (event) => {
			if (document.querySelector("#manageListItemIcon").innerHTML == "expand_less") {
				document.querySelector("#manageListItemExpand").style.display = "none";
				document.querySelector("#manageListItemIcon").innerHTML = "expand_more";
			} else {
				document.querySelector("#manageListItemExpand").style.display = "block";
				document.querySelector("#manageListItemIcon").innerHTML = "expand_less";
			}
		})
	}

	resetElements() {
		document.querySelector("#titleText").innerHTML = "Lorem Ipsum Dolor Sit Amet"
		document.querySelector("#paragraphText1").innerHTML = "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		document.querySelector("#paragraphText2").innerHTML = `${rhit.DEFAULT_PREVIEW_IMAGE_HTML}Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Morbi tristique senectus et netu set. Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	//new this.PreviewPageController();

	if (document.querySelector("#loginPage")) {
		this.startFirebaseUI();
	}
	if (document.querySelector("#previewPage")) {
		const s1 = document.createElement('script');
		s1['setAttribute']('src', 'scripts/letitsnow.js');
		document.head.appendChild(s1);
		const s2 = document.createElement('script');
		s2['setAttribute']('src', 'scripts/colorpicker.js');
		document.head.appendChild(s2);
		const s3 = document.createElement('script');
		s3['setAttribute']('src', 'scripts/flyingpics.js');
		document.head.appendChild(s3);
		const s4 = document.createElement('script');
		s4['setAttribute']('src', 'scripts/editablepage.js');
		document.head.appendChild(s4);
		new rhit.PreviewPageController();
	}
};

rhit.startFirebaseUI = function () {
	var uiConfig = {
		signInSuccessUrl: '/main.html',
		signInOptions: [
			// Leave the lines as is for the providers you want to offer your users.
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		],
	};
	const ui = new firebaseui.auth.AuthUI(firebase.auth());
	ui.start('#firebaseui-auth-container', uiConfig);
}

rhit.main();