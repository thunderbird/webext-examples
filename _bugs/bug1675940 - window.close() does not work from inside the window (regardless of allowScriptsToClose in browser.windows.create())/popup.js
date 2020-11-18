async function closeV1 () {
	window.close();
}

async function closeV2 () {
	let win = await browser.windows.getCurrent();
	await browser.windows.remove(win.id);
}

window.addEventListener("DOMContentLoaded", function() {
	window.document.getElementById('closeButton1').addEventListener('click', closeV1);
	window.document.getElementById('closeButton2').addEventListener('click', closeV2);
});

