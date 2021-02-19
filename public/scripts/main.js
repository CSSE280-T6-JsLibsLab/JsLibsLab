var rhit = rhit || {};

rhit.DEFAULT_PREVIEW_IMAGE_HTML = "<img id=\"sampleImg\" src=\"https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg\" alt=\"sampleImg\">"
rhit.FB_COLLECTION_USERS = "Users";
rhit.FB_COLLECTION_SCRIPTS = "Scripts";
rhit.FB_KEY_USER_NAME = "name";
rhit.FB_KEY_USER_PHOTOURL = "photoUrl";
rhit.FB_KEY_USER_FAVORITELIBRARIES = "favoriteLibraries";
rhit.FB_KEY_USER_ISADMIN = "isAdmin";

rhit.FB_KEY_SCRIPT_NAME = "name";
rhit.FB_KEY_SCRIPT_DESCRIPTION = "description";
rhit.FB_KEY_SCRIPT_PHOTOURL = "photoUrl";
rhit.FB_KEY_SCRIPT_EFFECTS = "effects";
rhit.FB_KEY_SCRIPT_FILEPATH = "filePath";
rhit.FB_KEY_SCRIPT_VIEWTIMES = "viewTimes";
rhit.FB_KEY_SCRIPT_SOURCE = "source";

rhit.fbUserManager = null;
rhit.fbScriptsManager = null;
rhit.fbSingleScriptManager = null;
rhit.fbAuthManager = null;

//rhit.effects = ["Sphere Animation", "Layered Animation"]; // "Easing Animation", "Layered Animation", "Sphere Animation", "Advanced Staggering"

// TODO: Two more demos
//https://codepen.io/juliangarnier/pen/dwKGoW
//https://codepen.io/juliangarnier/pen/MZXQNV

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
			window.location.href = `/favorites.html?uid=${rhit.fbAuthManager.uid}`;
		}
		document.querySelector("#menuFeaturingLibraries").onclick = (event) => {
			window.location.href = "/main.html";
		}
		document.querySelector("#menuUploadLibraries").onclick = (event) => {
			window.location.href = "/upload.html";
		}
		document.querySelector("#menuSignOut").onclick = (event) => {
			rhit.fbAuthManager.signOut();
		}
		rhit.fbUserManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		document.querySelector("#menuProfileUsername").innerHTML = rhit.fbUserManager.name;
	}
}

/* Upload Page */
rhit.UploadPageController = class {
	constructor() {
		//rhit.fbUserManager.beginListening(this.updateView.bind(this));
		document.querySelector("#submitUploadScriptButton").onclick = (event) => {
			console.log(document.querySelector("#formScript"));
			console.log(document.querySelector("#formScript").value);
		}
	}

	updateView() {
		document.querySelector("#profileName").innerHTML = `${rhit.fbUserManager.name}`;
		document.querySelector("#profileLibrariesFavorited").innerHTML = `Libraries Favorited: ${rhit.fbUserManager.favoriteLibraries.length}`;
	}
}

/* Favorites Page */
rhit.FavoritesPageController = class {
	constructor() {
		// TODO: Read from User favorites and create cards
		rhit.fbScriptsManager.beginListening(this.handleUserManager.bind(this), null);
	}

	handleUserManager() {
		rhit.fbUserManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		const newList = htmlToElement(`<div id="columns" class="row justify-content-start space-evenly"></div>`);
		for (let i = 0; i < rhit.fbScriptsManager.length; i++) {
			const script = rhit.fbScriptsManager.getScriptAtIndex(i);
			if (rhit.fbUserManager.favoriteLibraries.includes(script.id)) {
				let isFavorited = rhit.fbUserManager.favoriteLibraries.includes(script.id);
				const newCard = this.createCard(script, isFavorited);
				newList.appendChild(newCard);
			}

		}
		const oldList = document.querySelector("#columns");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.append(newList);
		oldList.remove();

		for (let i = 0; i < rhit.fbScriptsManager.length; i++) {
			const script = rhit.fbScriptsManager.getScriptAtIndex(i);
			if (rhit.fbUserManager.favoriteLibraries.includes(script.id)) {
				document.querySelector(`#preview_${script.id}`).onclick = (event) => {
					window.open(`/preview.html?id=${script.id}`);
				};
				document.querySelector(`#source_${script.id}`).onclick = (event) => {
					window.open(script.source);
				};
				document.querySelector(`#favorite_${script.id}`).onclick = (event) => {
					// console.log("Favorite");
					rhit.fbUserManager.favoriteScript(script.id);
					document.querySelector(`#favorite_icon_${script.id}`).innerHTML = document.querySelector(`#favorite_icon_${script.id}`).innerHTML == "star_border" ? "star" : "star_border";
				};
			}
		}
	}

	createCard(script, isFavorited) {
		return htmlToElement(`<div class="col-xs-6 col-md-4 col-lg-3 card" id="${script.id}">
								<img class="card-img-bot" src="${script.photoUrl}" alt="Script Photo">
								<div class="card-body">
		  							<h5 class="card-title">${script.name}</h5>
		  							<p class="truncate-overflow">${script.description}</p>
									<p>View Times: ${script.viewTimes}</p>
									<div class="row justify-content-center">
									<div class="col-4">
										<a id="preview_${script.id}" class="btn btn-primary cardIcon"><i class="material-icons">remove_red_eye</i></a>
									</div>
									<div class="col-4">
										<a id="source_${script.id}" class="btn btn-primary cardIcon"><i class="material-icons">public</i></a>
									</div>
									<div class="col-4">
										<a id="favorite_${script.id}" class="btn btn-primary cardIcon"><i id="favorite_icon_${script.id}" class="material-icons">${isFavorited ? "star" : "star_border"}</i></a>
									</div>
								</div>
	  						</div>`);
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
		rhit.fbSingleScriptManager.stopListening();
		rhit.fbSingleScriptManager.addViewTimes();
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
		let fireNodes1 = document.querySelectorAll("#fireNodes1 .cf-flame");
		let fireNodes2 = document.querySelectorAll("#fireNodes2 .cf-flame");
		let fireNodes3 = document.querySelectorAll("#fireNodes1 .cf-flame");
		let baseFire = document.querySelectorAll("#base-fire .cf-flame");

		function animateBaseFire() {
			anime({
				targets: baseFire,
				delay: anime.stagger(300),
				translateY: function () {
					return anime.random(0, -10);
				},
				keyframes: [{
						scale: .8
					},
					{
						scale: .825
					},
					{
						scale: .9
					},
					{
						scale: .925
					},
					{
						scale: 1
					}
				],
				duration: 300,
				easing: 'easeInOutSine',
				loop: true,
			})
		}

		function animateFlame1() {
			anime({
				targets: fireNodes1,
				delay: anime.stagger(100),
				translateY: function () {
					return anime.random(0, 300);
				},
				rotate: 30,
				opacity: function () {
					return anime.random(.5, 1);
				},
				translateX: function () {
					return anime.random(0, -60);
				},
				scale: 0,
				skew: function () {
					return anime.random(0, 10);
				},
				loop: true,
				easing: "easeInOutSine",
			})
		}

		function animateFlame2() {
			anime({
				targets: fireNodes2,
				delay: anime.stagger(400),
				translateX: function () {
					return anime.random(-30, 0);
				},
				translateY: function () {
					return anime.random(0, -260);
				},
				translateY: function () {
					return anime.random(-260, -160);
				},
				translateX: function () {
					return anime.random(0, -30);
				},
				scale: 0,
				rotate: function () {
					return anime.random(0, 60);
				},
				skew: function () {
					return anime.random(0, 30);
				},
				loop: true,
				easing: "easeInOutSine"
			})
		}

		function animateFlame3() {
			anime({
				targets: fireNodes3,
				delay: anime.stagger(500),
				translateY: function () {
					return anime.random(-300, -200);
				},
				opacity: function () {
					return anime.random(0, 1);
				},
				translateX: function () {
					return anime.random(-50, 50);
				},
				scale: 0,
				rotate: function () {
					return anime.random(0, -30);
				},
				skew: function () {
					return anime.random(0, 20);
				},
				loop: true,
				easing: "easeInOutSine",
			})
		}

		animateFlame1();
		animateFlame2();
		animateFlame3();
		animateBaseFire();
	}
}

/* Index Page */
rhit.IndexPageController = class {
	constructor() {
		document.querySelector("#getStartedButton").onclick = (event) => {
			window.location.href = "/login.html";
		}

		var textWrapper = document.querySelector('.ml9 .letters');
		textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

		anime.timeline({
				loop: true
			})
			.add({
				targets: '.ml9 .letter',
				scale: [0, 1],
				duration: 1500,
				elasticity: 600,
				delay: (el, i) => 45 * (i + 1)
			}).add({
				targets: '.ml9',
				opacity: 0,
				duration: 1000,
				easing: "easeOutExpo",
				delay: 1000
			});

		const path = anime.path('#path');
		const timeline = anime.timeline({
			easing: 'easeInOutExpo',
			duration: 1000,
			complete: () => {
				anime({
					targets: '.leaf',
					rotate: 40,
					duration: 3000,
					loop: true,
					direction: 'alternate',
					easing: 'easeInOutQuad'
				});
				anime({
					targets: '.petals',
					scale: 1.05,
					duration: 6000,
					loop: true,
					direction: 'alternate',
					easing: 'easeInOutQuad'
				});
			}
		});
		timeline.add({
			targets: '.stem',
			scale: [0, 1],
		})
		timeline.add({
			targets: '.leaf',
			rotate: [0, 45],
		})
		timeline.add({
			targets: '.petals',
			scale: [0, 1],
		}, '-=1000');
		timeline.add({
			targets: '#bee',
			opacity: [0, 1],
		}, '-=750');
		anime({
			targets: '#bee',
			translateX: path('x'),
			translateY: path('y'),
			rotate: path('angle'),
			loop: true,
			duration: 12500,
			easing: 'linear'
		});
	}
}

rhit.ProfilePageController = class {
	constructor() {
		rhit.fbUserManager.beginListening(this.updateView.bind(this));
		document.querySelector("#submitUpdateNameButton").onclick = (event) => {
			rhit.fbUserManager.updateName(document.querySelector("#nameTextField").value);
		}
	}

	updateView() {
		document.querySelector("#profileName").innerHTML = `${rhit.fbUserManager.name}`;
		document.querySelector("#profileLibrariesFavorited").innerHTML = `Libraries Favorited: ${rhit.fbUserManager.favoriteLibraries.length}`;
	}
}

rhit.MainPageController = class {

	constructor() {
		this.searchStr = "";

		rhit.fbScriptsManager.beginListening(this.updateView.bind(this), null);
		rhit.fbUserManager.beginListening(this.updateFavoritesView.bind(this));

		document.querySelector("#searchButton").onclick = (event) => {
			this.searchStr = document.querySelector("#searchInput").value.toLowerCase();
			//rhit.fbScriptsManager.beginListening(this.updateView.bind(this), document.querySelector("#searchInput").value);
			this.updateView();
		}

		document.querySelector("#clearSearchButton").onclick = (event) => {
			document.querySelector("#searchInput").value = "";
			this.searchStr = "";
			//rhit.fbScriptsManager.beginListening(this.updateView.bind(this), null);
			this.updateView();
		}
	}

	updateFavoritesView() {
		const newList = htmlToElement(`<div id="favoriteScrollMenu" class="scrollmenu"></div>`);
		for (let i = 0; i < rhit.fbUserManager.favoriteLibraries.length; i++) {
			// console.log(rhit.fbUserManager.favoriteLibraries[i]);
			rhit.fbScriptsManager.getSingleScriptData(rhit.fbUserManager.favoriteLibraries[i]).then((data) => {
				console.log(data);
				const newCard = this.createFavoriteCard(data.name, data.photoUrl);
				newCard.onclick = (event) => {
					window.open(`/preview.html?id=${rhit.fbUserManager.favoriteLibraries[i]}`);
				}
				newList.appendChild(newCard);
			});
			//console.log(scriptData);
			//const newCard = this.createFavoriteCard(script, isFavorited);
			//newList.appendChild(newCard);
		}
		const oldList = document.querySelector("#favoriteScrollMenu");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.append(newList);
		oldList.remove();
	}

	updateView() {
		const newList = htmlToElement(`<div id="columns" class="row justify-content-start space-evenly"></div>`);
		for (let i = 0; i < rhit.fbScriptsManager.length; i++) {
			const script = rhit.fbScriptsManager.getScriptAtIndex(i);
			if (this.searchStr == "" || script.name.toLowerCase().includes(this.searchStr)) {
				let isFavorited = rhit.fbUserManager.favoriteLibraries.includes(script.id);
				const newCard = this.createCard(script, isFavorited);
				newList.appendChild(newCard);
			}
		}
		const oldList = document.querySelector("#columns");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.append(newList);
		oldList.remove();

		for (let i = 0; i < rhit.fbScriptsManager.length; i++) {
			const script = rhit.fbScriptsManager.getScriptAtIndex(i);
			if (this.searchStr == "" || script.name.toLowerCase().includes(this.searchStr)) {
				document.querySelector(`#preview_${script.id}`).onclick = (event) => {
					window.open(`/preview.html?id=${script.id}`);
				};
				document.querySelector(`#source_${script.id}`).onclick = (event) => {
					window.open(script.source);
				};
				document.querySelector(`#favorite_${script.id}`).onclick = (event) => {
					// console.log("Favorite");
					rhit.fbUserManager.favoriteScript(script.id);
					document.querySelector(`#favorite_icon_${script.id}`).innerHTML = document.querySelector(`#favorite_icon_${script.id}`).innerHTML == "star_border" ? "star" : "star_border";
				};
			}
		}
	}

	createFavoriteCard(name, photoUrl){
		return htmlToElement(`<div class="card">
								<img class="card-img-top" src="${photoUrl}" alt="Card image cap">
								<div class="card-body">
		  							<p class="card-title">${name}</p>
								</div>
	  						</div>`);
	}

	createCard(script, isFavorited) {
		return htmlToElement(`<div class="col-xs-6 col-md-4 col-lg-3 card" id="${script.id}">
								<div id="cardDropDownMenu" class="dropdown pull-xs-right">
									<button class="btn bmd-btn-icon dropdown-toggle" type="button" id="lr1" data-toggle="dropdown"
		  									aria-haspopup="true" aria-expanded="false">
		  								<i class="material-icons">more_vert</i>
									</button>
									<div class="dropdown-menu dropdown-menu-left" aria-labelledby="lr1">
		  							<button id="menuEdit" class="dropdown-item" type="button" data-toggle="modal"
											data-target="#editScriptDialog"><i class="material-icons">edit</i>&nbsp;&nbsp;&nbsp;Edit</button>
		  							<button id="menuDelete" class="dropdown-item" type="button" data-toggle="modal"
											data-target="#deleteScriptDialog"><i class="material-icons">delete</i>&nbsp;&nbsp;&nbsp;Delete</button>
									</div>
	  						</div>
							<img class="card-img-bot" src="${script.photoUrl}" alt="Script Photo">
							<div class="card-body">
		  						<h5 class="card-title">${script.name}</h5>
		  						<p class="truncate-overflow">${script.description}</p>
								<p>View Times: ${script.viewTimes}</p>
								<div class="row justify-content-center">
								<div class="col-4">
									<a id="preview_${script.id}" class="btn btn-primary cardIcon"><i class="material-icons">remove_red_eye</i></a>
								</div>
								<div class="col-4">
									<a id="source_${script.id}" class="btn btn-primary cardIcon"><i class="material-icons">public</i></a>
								</div>
								<div class="col-4">
									<a id="favorite_${script.id}" class="btn btn-primary cardIcon"><i id="favorite_icon_${script.id}" class="material-icons">${isFavorited ? "star" : "star_border"}</i></a>
								</div>
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

	addViewTimes() {
		this._ref.update({
				[rhit.FB_KEY_SCRIPT_VIEWTIMES]: this.viewTimes + 1,
			})
			.then(() => {
				console.log("Document written");
			})
			.catch(function (error) {
				console.error("Error updating document: ", error);
			})
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

	get source() {
		return this._documentSnapshot.get(rhit.FB_KEY_SCRIPT_SOURCE);
	}
}

rhit.FbScriptsManager = class {
	constructor() {
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_SCRIPTS);
		this._documentSnapshots = [];
		this._unsubscribe = null;
	}

	beginListening(changeListener, searchKeyword) {
		if (this._unsubscribe) {
			this.stopListening();
		}
		let query = this._ref.limit(50).orderBy(rhit.FB_KEY_SCRIPT_VIEWTIMES, "desc")
		// TODO: A Real Search
		// if (searchKeyword) {
		// 	query = query.where(rhit.FB_KEY_SCRIPT_NAME, '==', searchKeyword)
		// }
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		})
	}

	stopListening() {
		this._unsubscribe();
	}

	getSingleScriptData(id) {
		let docRef = this._ref.doc(id);
		return new Promise((resolve, reject) => {
			docRef.get().then((doc) => {
				let name = doc.get(rhit.FB_KEY_SCRIPT_NAME);
				let photoUrl = doc.get(rhit.FB_KEY_SCRIPT_PHOTOURL)
				resolve ({
					name,
					photoUrl
				});
			});
		});
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getScriptAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const script = new rhit.Script(docSnapshot.id, docSnapshot.get(rhit.FB_KEY_SCRIPT_NAME), docSnapshot.get(rhit.FB_KEY_SCRIPT_PHOTOURL),
			docSnapshot.get(rhit.FB_KEY_SCRIPT_DESCRIPTION), docSnapshot.get(rhit.FB_KEY_SCRIPT_FILEPATH), docSnapshot.get(rhit.FB_KEY_SCRIPT_EFFECTS),
			docSnapshot.get(rhit.FB_KEY_SCRIPT_VIEWTIMES), docSnapshot.get(rhit.FB_KEY_SCRIPT_SOURCE));
		return script;
	}
}

rhit.FbUserManager = class {
	constructor(uid) {
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_USERS).doc(uid);
		this._documentSnapshot = {};
		this._unsubscribe = null;
	}

	addNewUserMabye(uid, name, isAdmin) {
		return this._ref.get().then((doc) => {
			if (doc.exists) {
				console.log("There is already a user object");
			} else {
				console.log("Creating a new user.");
				return this._ref.set({
					[rhit.FB_KEY_USER_NAME]: name,
					[rhit.FB_KEY_USER_FAVORITELIBRARIES]: [],
					[rhit.FB_KEY_USER_ISADMIN]: isAdmin,
				}).then(() => {
					console.log("Created a new user!");
				});
			}
		}).catch((err) => {
			console.log("err adding new user", err);
		})
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

	updateName(newName) {
		this._ref.update({
			[rhit.FB_KEY_USER_NAME]: newName,
		})
		.then(() => {
			console.log("Document updated");
		})
		.catch(function (error) {
			console.error("Error updating document: ", error);
		})
	}

	favoriteScript(id) {
		let libraries = this.favoriteLibraries
		if (libraries.includes(id)) {
			//console.log("--- You have already favorited.");
			var index = libraries.indexOf(id);
			if (index !== -1) {
				libraries.splice(index, 1);
			}
		} else {
			//console.log("Not favorited.");
			libraries.push(id);
		}
		this._ref.update({
				[rhit.FB_KEY_USER_FAVORITELIBRARIES]: libraries,
			})
			.then(() => {
				console.log("Document updated");
			})
			.catch(function (error) {
				console.error("Error updating document: ", error);
			})
	}

	get name() {
		return this._documentSnapshot.get(rhit.FB_KEY_USER_NAME);
	}

	get favoriteLibraries() {
		return this._documentSnapshot.get(rhit.FB_KEY_USER_FAVORITELIBRARIES);
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
	constructor(id, name, photoUrl, description, filePath, effects, viewTimes, source) {
		this.id = id;
		this.name = name;
		this.photoUrl = photoUrl;
		this.description = description;
		this.filePath = filePath;
		this.effects = effects;
		this.viewTimes = viewTimes;
		this.source = source;
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

	if (document.querySelector("#indexPage")) {
		console.log("You are on the index page")
		new rhit.IndexPageController();
	}

	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page");
		this.startFirebaseUI();
		new rhit.LoginPageController();
	}

	if (document.querySelector("#favoritesPage")) {
		console.log("You are on the fav page");
		const uid = urlParam.get("uid");
		// TODO: Create fbSingleUserManager
		rhit.fbUserManager = new rhit.FbUserManager(rhit.fbAuthManager.uid);
		rhit.fbScriptsManager = new rhit.FbScriptsManager();
		new rhit.UserNavController();
		new rhit.FavoritesPageController();
	}

	if (document.querySelector("#mainPage")) {
		console.log("You are on the main page");
		rhit.fbScriptsManager = new rhit.FbScriptsManager();
		rhit.fbUserManager = new rhit.FbUserManager(rhit.fbAuthManager.uid);
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

	if (document.querySelector("#uploadPage")) {
		rhit.fbUserManager = new rhit.FbUserManager(rhit.fbAuthManager.uid);
		new rhit.UserNavController();
		new rhit.UploadPageController();
	}
}

rhit.createUserObjectIfNeeded = function () {
	return new Promise((resolve, reject) => {
		if (!rhit.fbAuthManager.isSignedIn) {
			resolve();
			return;
		}
		rhit.fbUserManager = new rhit.FbUserManager(rhit.fbAuthManager.uid);

		if (!document.querySelector("#loginPage")) {
			resolve();
			return;
		}

		rhit.fbUserManager.addNewUserMabye(
			rhit.fbAuthManager.uid,
			rhit.fbAuthManager.name,
			false,
		).then(() => {
			resolve();
		});
	});
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("isSignedIn=" + rhit.fbAuthManager.isSignedIn);
		rhit.createUserObjectIfNeeded().then(() => {
			rhit.checkForRedirects();
			rhit.initializePage();
		});
	});

};

rhit.main();