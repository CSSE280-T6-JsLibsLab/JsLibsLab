var rhit = rhit || {};

rhit.DEFAULT_PREVIEW_IMAGE_HTML = "<img id=\"sampleImg\" src=\"https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg\" alt=\"sampleImg\">"
// TODO: This will be on firestore
//rhit.effects = ["Sphere Animation", "Layered Animation"]; // "Easing Animation", "Layered Animation", "Sphere Animation", "Advanced Staggering"
rhit.effects = ["Cursor"];

// TODO: Two more demos
//https://codepen.io/juliangarnier/pen/dwKGoW
//https://codepen.io/juliangarnier/pen/MZXQNV
//rhit.effect_file_name = ['animejs/anime.min.js', 'animejs/anime.js', 'animejs/anime.es.js', 'animejs/sphereDemo.js', 'animejs/layeredDemo.js'];
rhit.effect_file_name = ['lax/lax.min.js', 'lax/cursorDemo.js'];

function htmlToElement(html) {
	var template = document.createElement("template");
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.PreviewPageController = class {
	constructor() {
		this.selectedEffect = 0;
		this.effectEnabled = false;
		//this.effectMap = getEffectMap();
		// TODO: Only allow one effect at a time??
		document.querySelector("#enableListItem").addEventListener("click", (event) => {
			if (document.querySelector("#enableListItemIcon").innerHTML == "radio_button_checked") {
				document.querySelector("#enableListItemIcon").innerHTML = "radio_button_unchecked";
				effectMap.get(rhit.effects[this.selectedEffect])[1]();
				this.effectEnabled = false;
			} else {
				document.querySelector("#enableListItemIcon").innerHTML = "radio_button_checked";
				effectMap.get(rhit.effects[this.selectedEffect])[0]();
				this.effectEnabled = true;
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

		this.updateEffectList();
	}

	resetElements() {
		document.querySelector("#titleText").innerHTML = "Lorem Ipsum Dolor Sit Amet"
		document.querySelector("#paragraphText1").innerHTML = "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		document.querySelector("#paragraphText2").innerHTML = `${rhit.DEFAULT_PREVIEW_IMAGE_HTML}Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Morbi tristique senectus et netu set. Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
	}

	createEffectTab(effectName) {
		return htmlToElement(`<div class="list-group-item list-group-item-action">
								<div>${effectName}</div>
	  						</div>`);
	}

	updateEffectList() {
		const newList = htmlToElement('<div id="effectList"></div>');
		for (let i = 0; i < rhit.effects.length; i++) {
			const newEffectTab = this.createEffectTab(rhit.effects[i]);
			if (i == this.selectedEffect) {
				newEffectTab.style.color = "red";
			}
			newEffectTab.onclick = (event) => {
				if (this.effectEnabled) {
					alert("You must disable the enabled effect first!");
					return;
				}
				this.selectedEffect = i;
				this.updateEffectList();
			}
			newList.appendChild(newEffectTab);
		}
		const oldList = document.querySelector("#effectList");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.append(newList);
		oldList.remove();
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
		for (file_name of rhit.effect_file_name) {
			const s1 = document.createElement('script');
			s1['setAttribute']('src', `scripts/libraries/${file_name}`);
			document.head.appendChild(s1)
		}
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