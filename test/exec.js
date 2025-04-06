const { exec, execSync } = require("child_process");

console.log(execSync("echo hi").toString());