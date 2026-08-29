function a() {
	return "Function A...";
}

function b() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve("Function B...");
		}, 2000);
	});
}

function c() {
	return "Function C...";
}

async function app() {
    console.log( a() );
    console.log( await b() );
    console.log( c() );
}

app();