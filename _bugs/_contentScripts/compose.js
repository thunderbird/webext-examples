// async sleep function using Promise
function sleep (delay) {
    return new Promise(function(resolve, reject) {
        window.setTimeout(resolve, delay);
    });
}

console.log("loaded 1");
sleep(3000).then(() => {
	console.log("loaded 2");
});

async function run() {
	console.log("loaded 3");
	await sleep(3000);
	console.log("loaded 4");
}

run();