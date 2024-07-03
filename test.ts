import * as fs from "fs";
console.log("fs:", fs);

// create a random file in the root directory
fs.writeFileSync("random.txt", "Hello, World!");
