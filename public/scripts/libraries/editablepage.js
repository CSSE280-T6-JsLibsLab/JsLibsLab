function startEffectEditablePage() {
    document.body.contentEditable = 'true';
    document.designMode = 'on';
    window.alert("Edit mode on. You can edit the texts on this page.");
}

function clearEffectEditablePage() {
    document.body.contentEditable = 'false';
    document.designMode = 'off';
}

// ------------------- The Code Below is just For Demostration on JS Libs Lab Website
var effectMap = effectMap || new Map();
effectMap.set("Editable", [startEffectEditablePage, clearEffectEditablePage])