
window.addEventListener("DOMContentLoaded", function() {
	window.document.getElementById('button1').addEventListener('click', btn1);
});

function btn1() {
	browser.tabs.query({
	  active: true,
	  currentWindow: true,
	}).then(tabs => {
	browser.tabs.executeScript(tabs[0].id, {
    code: `
      document.execCommand("insertText", false, "Text to insert into message");
      document.execCommand("InsertImage", false, "http://placekitten.com/200/300");
      `
	})		
	});
}