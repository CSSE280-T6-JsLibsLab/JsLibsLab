var rhit = rhit || {};

rhit.DEFAULT_PREVIEW_IMAGE_HTML = "<img id=\"sampleImg\" src=\"https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg\" alt=\"sampleImg\">"
rhit.FB_COLLECTION_USERS = "Users";
rhit.FB_COLLECTION_SCRIPTS = "Scripts";
rhit.FB_KEY_USER_NAME = "name";
rhit.FB_KEY_USER_PHOTOURL = "photoUrl";

rhit.FB_KEY_SCRIPT_NAME = "name";
rhit.FB_KEY_SCRIPT_DESCRIPTION = "description";
rhit.FB_KEY_SCRIPT_PHOTOURL = "photoUrl";
rhit.FB_KEY_SCRIPT_EFFECTS = "effects";
rhit.FB_KEY_SCRIPT_FILEPATH = "filePath";
rhit.FB_KEY_SCRIPT_VIEWTIMES = "viewTimes";

rhit.fbUserManager = null;
rhit.fbScriptsManager = null;
rhit.fbSingleScriptManager = null;
rhit.fbAuthManager = null;

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

/* User Nav */
rhit.UserNavController = class {
	constructor() {
		document.querySelector("#menuMyAccount").onclick = (event) => {
			console.log(rhit.fbAuthManager.uid);
			window.location.href = `/profile.html?uid=${rhit.fbAuthManager.uid}`;
		}
		document.querySelector("#menuMyFavorites").onclick = (event) => {

		}
		document.querySelector("#menuFeaturingLibraries").onclick = (event) => {

		}
		document.querySelector("#menuSearch").onclick = (event) => {

		}
		document.querySelector("#menuUploadLibraries").onclick = (event) => {

		}
		document.querySelector("#menuSignOut").onclick = (event) => {
			console.log("Sign Out!!!!!!!!!!!!!!!!!");
			rhit.fbAuthManager.signOut();
		}
	}
}

/* Preview Page */
rhit.PreviewPageController = class {
	constructor() {

		this.selectedEffect = 0;
		this.effectEnabled = false;

		rhit.fbSingleScriptManager.beginListening(this.updateView.bind(this));
		
		

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

	updateView() {
		const effects = rhit.fbSingleScriptManager.effects;
		document.querySelector("#enableListItem").addEventListener("click", (event) => {
			if (document.querySelector("#enableListItemIcon").innerHTML == "radio_button_checked") {
				document.querySelector("#enableListItemIcon").innerHTML = "radio_button_unchecked";
				effectMap.get(effects[this.selectedEffect])[1]();
				this.effectEnabled = false;
			} else {
				document.querySelector("#enableListItemIcon").innerHTML = "radio_button_checked";
				effectMap.get(effects[this.selectedEffect])[0]();
				this.effectEnabled = true;
			}
		})

		for (let file_name of rhit.fbSingleScriptManager.filePath) {
			const s1 = document.createElement('script');
			s1['setAttribute']('src', `scripts/libraries/${file_name}`);
			document.head.appendChild(s1)
		}

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
		const effects = rhit.fbSingleScriptManager.effects;
		for (let i = 0; i < effects.length; i++) {
			const newEffectTab = this.createEffectTab(effects[i]);
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

/* Login Page */
rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#loginButton").onclick = (params) => {
			const inputEmailEl = document.querySelector("#inputEmail");
			const inputPasswordEl = document.querySelector("#inputPassword");
			rhit.fbAuthManager.signIn(inputEmailEl.value, inputPasswordEl.value);
		};
	}
}

/* Index Page */
rhit.IndexPageController = class {
	constructor() {
		document.querySelector("#getStartedButton").onclick = (event) => {
			window.location.href = "/login.html";
		}
	}
}

rhit.ProfilePageController = class {
	constructor() {
		rhit.fbUserManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		console.log(rhit.fbUserManager.name);
		console.log(rhit.fbUserManager.photoUrl);
	}
}

rhit.MainPageController = class {
	constructor() {
		rhit.fbScriptsManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		const newList = htmlToElement(`<div id="columns"></div>`);
		for (let i = 0; i < rhit.fbScriptsManager.length; i++) {
			const script = rhit.fbScriptsManager.getScriptAtIndex(i);
			const newCard = this.createCard(script);

			// TODO: LINKS

			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#columns");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.append(newList);
		oldList.remove();
	}

	createCard(script) {
		return htmlToElement(`<div class="card" id="${script.id}">
								<img class="card-img-top" src="${script.photoUrl}" alt="Script Photo">
								<div class="card-body">
		  							<h5 class="card-title">${script.name}</h5>
		  							<p class="card-text">${script.description}</p>
									<a href="#" class="btn btn-primary cardIcon"><i class="material-icons">remove_red_eye</i></a>
									<a href="#" class="btn btn-primary cardIcon"><i class="material-icons">public</i></a>
									<a href="#" class="btn btn-primary cardIcon"><i class="material-icons">star_border</i></a>
								</div>
	  						</div>`);
	}
}

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

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
	}
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}
	signIn(email, password) {
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then((user) => {
				// Signed in 
				// ...
				console.log("User signed in with email");
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("Existing account login error", errorCode, errorMessage);
			});
		// Rosefire.signIn("<ROSEFIRE KEY>", (err, rfUser) => {
		// 	if (err) {
		// 		console.log("Rosefire error!", err);
		// 		return;
		// 	}
		// 	console.log("Rosefire success!", rfUser);

		// 	// Next use the Rosefire token with Firebase auth.
		// 	firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
		// 		if (error.code === 'auth/invalid-custom-token') {
		// 			console.log("The token you provided is not valid.");
		// 		} else {
		// 			console.log("signInWithCustomToken error", error.message);
		// 		}
		// 	}); // Note: Success should be handled by an onAuthStateChanged listener.

		// });
	}
	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("Sign out error");
		});
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}

	get name() {
		return this._user.displayName || "Anonymous User";
	}

	get photoUrl() {
		return this._user.photoURL || "noPHOTO";
	}
}

rhit.FbSingleScriptManager = class {
	constructor(id) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_SCRIPTS).doc(id);
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				this._documentSnapshot = doc;
				//console.log(doc.data());
				changeListener();
			} else {
				console.log("No such doc");
				//window.location.href = "/";
			}
		})
	}

	stopListening() {
		this._unsubscribe();
	}

	get name() {
		return this._documentSnapshot.get(rhit.FB_KEY_SCRIPT_NAME);
	}

	get photoUrl() {
		return this._documentSnapshot.get(rhit.FB_KEY_SCRIPT_PHOTOURL);
	}

	get description() {
		return this._documentSnapshot.get(rhit.FB_KEY_SCRIPT_DESCRIPTION);
	}

	get effects() {
		return this._documentSnapshot.get(rhit.FB_KEY_SCRIPT_EFFECTS);
	}

	get filePath() {
		return this._documentSnapshot.get(rhit.FB_KEY_SCRIPT_FILEPATH);
	}

	get viewTimes() {
		return this._documentSnapshot.get(rhit.FB_KEY_SCRIPT_VIEWTIMES);
	}
}

rhit.FbScriptsManager = class {
	constructor() {
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_SCRIPTS);
		this._documentSnapshots = [];
		this._unsubscribe = null;
	}

	beginListening(changeListener) {
		// TODO: Order by view times
		this._unsubscribe = this._ref.limit(50).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		})
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getScriptAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const script = new rhit.Script(docSnapshot.id, docSnapshot.get(rhit.FB_KEY_SCRIPT_NAME), docSnapshot.get(rhit.FB_KEY_SCRIPT_PHOTOURL), 
		docSnapshot.get(rhit.FB_KEY_SCRIPT_DESCRIPTION), docSnapshot.get(rhit.FB_KEY_SCRIPT_FILEPATH), docSnapshot.get(rhit.FB_KEY_SCRIPT_EFFECTS), 
		docSnapshot.get(rhit.FB_KEY_SCRIPT_VIEWTIMES));
		return script;
	}
}

rhit.FbUserManager = class {
	constructor(uid) {
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_USERS).doc(uid);
		this._documentSnapshot = {};
		this._unsubscribe = null;
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				this._documentSnapshot = doc;
				//console.log(doc.data());
				changeListener();
			} else {
				console.log("No such doc");
				//window.location.href = "/";
			}
		})
	}

	stopListening() {
		this._unsubscribe();
	}

	get name() {
		return this._documentSnapshot.get(rhit.FB_KEY_USER_NAME);
	}
	
	get photoUrl() {
		return this._documentSnapshot.get(rhit.FB_KEY_USER_PHOTOURL);
	}

	// addNewUser(uid, name, photourl) {
	// 	this._ref.doc(uid).onSnapshot((doc) => {
	// 		if (doc.exists) {
	// 			console.log(doc.data());
	// 			//changeListener();
	// 		} else {
	// 			console.log("No such doc");
	// 			//window.location.href = "/";
	// 		}
	// 	})
	// }
}

rhit.Script = class {
	constructor(id, name, photoUrl, description, filePath, effects, viewTimes){
		this.id = id;
		this.name = name;
		this.photoUrl = photoUrl;
		this.description = description;
		this.filePath = filePath;
		this.effects = effects;
		this.viewTimes = viewTimes;
	}
}

rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		console.log("You have logged in. redirecting to main page.");

		// TODO: Create User Doc after logging in
		// rhit.fbUsersManager = new rhit.FbUsersManager();
		// rhit.fbUsersManager.addNewUser(rhit.fbAuthManager.uid, rhit.fbAuthManager.name, rhit.fbAuthManager.photoUrl);
		window.location.href = "/main.html";
	}
	if (!(document.querySelector("#loginPage") || document.querySelector("#indexPage")) && !rhit.fbAuthManager.isSignedIn) {
		console.log("You are not signed in. redirecting to index page.");
		window.location.href = "/";
	}
};

rhit.initializePage = function () {

	const urlParam = new URLSearchParams(window.location.search);
	// if (document.querySelector("#listPage")) {
	// 	console.log("You are on the list page")
	// 	const queryString = window.location.search;
	// 	const urlParams = new URLSearchParams(queryString);
	// 	const uid = urlParams.get("uid");
	// 	rhit.fbPhotosManager = new rhit.FbPhotosManager(uid);
	// 	new rhit.ListPageController();
	// }

	// if (document.querySelector("#detailPage")) {
	// 	console.log("You are on the detail page");

	// 	const queryString = window.location.search;
	// 	console.log('queryString :>> ', queryString);
	// 	const urlParams = new URLSearchParams(queryString);
	// 	const photoId = urlParams.get("id");
	// 	if (!photoId) {
	// 		window.location.href = "/";
	// 	}
	// 	rhit.fbSinglePhotoManager = new rhit.FbSinglePhotoManager(photoId);
	// 	new rhit.DetailPageController();
	// }

	if (document.querySelector("#indexPage")) {
		console.log("You are on the index page")
		new rhit.IndexPageController();
	}

	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page");
		this.startFirebaseUI();
		new rhit.LoginPageController();
	}

	if (document.querySelector("#mainPage")) {
		console.log("You are on the main page");
		rhit.fbScriptsManager = new rhit.FbScriptsManager();
		new rhit.UserNavController();
		new rhit.MainPageController();
	}

	if (document.querySelector("#profilePage")) {
		console.log("You are on the profile page")
		const uid = urlParam.get("uid");
		rhit.fbUserManager = new rhit.FbUserManager(uid);
		new rhit.UserNavController();
		new rhit.ProfilePageController();
	}

	if (document.querySelector("#previewPage")) {
		console.log("You are on the preview page")
		const id = urlParam.get("id");
		rhit.fbSingleScriptManager = new rhit.FbSingleScriptManager(id);
		//Initialize external scripts
		
		new rhit.PreviewPageController();
	}
}



/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("isSignedIn=" + rhit.fbAuthManager.isSignedIn);
		rhit.checkForRedirects();
		rhit.initializePage();
	});

};

rhit.main();