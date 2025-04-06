// const { Network } = require("./network/net");

// new Network().getTransactionInfo("8817b8db027261def0a7652ad4af5b37b164b28a42b2f7d4ac5b3522e14977fd", (a) => {
//     console.log(a)
// })
// const text = "[ 📥 ] - شروع کننده: 123456}\n534345345\n[ 👀 ] - منتظر طرف دوم قرارداد ...";
// const regex = /\d+/g; // This regex matches one or more digits
// const result = text.match(regex);

// if (result) {
//     console.log(`Extracted number: ${typeof result[1]}`); // Output: Extracted number: 123456
// } else {
//     console.log("No number found.");
// }

// const crypto = require("crypto");

// const createHash = async () => {
//     const hash = crypto.createHash("md5").update(
//         (Math.floor(Math.random() * 99999999999999) - 100000000).toString()
//     ).digest("hex");

//     // Format the hash into the desired output
//     const formattedHash = `D-${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`;
//     return formattedHash;
// }

// createHash().then((a) => {
//     console.log(a);
// });

const regex = /^https:\/\/tronscan\.org\/#\/transaction\/([a-f0-9]{64})$/;
let text1 = "https://tronscan.org/#/transaction/3884511adfd3b33db7e185bad7ec978587435767e041da5a5d4ab78076f0acc3";
let text2 = "https://tronscan.org/#/transaction/";
let text3 = "hello world";

let mtch = text1.match(regex);
// let mtch = text2.match(regex);
// let mtch = text3.match(regex);

console.log(mtch)