function startEffectEditablePage() {
    document.body.contentEditable = 'true';
    document.designMode = 'on';
    window.alert("Edit mode on. You can edit the texts on this page.");
}

function clearEffectEditablePage() {
    document.body.contentEditable = 'false';
    document.designMode = 'off';
}