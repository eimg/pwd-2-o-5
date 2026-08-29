const bcrypt = require("bcrypt");

async function app() {
    const password = "abc123xyz";
    const hash = await bcrypt.hash(password, 10);

	console.log(hash);
    console.log(" ");

    if(await bcrypt.compare("Abc123xyz", hash)) {
        console.log("Correct password");
    } else {
        console.log("Incorrect password!");
    }
}

app();
