const jwt = require("jsonwebtoken");

const key = "&*#&*!@@34";
const user = { name: "Alice", age: 22 };

const token = jwt.sign(user, key);
console.log(token);

console.log(" ");

const output = jwt.verify(token, key);
console.log(output);
