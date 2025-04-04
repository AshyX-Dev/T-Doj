// const { Network } = require("./network/net");

// new Network().getTransactionInfo("8817b8db027261def0a7652ad4af5b37b164b28a42b2f7d4ac5b3522e14977fd", (a) => {
//     console.log(a)
// })
const text = "[ 📥 ] - شروع کننده: 123456}\n[ 👀 ] - منتظر طرف دوم قرارداد ...";
const regex = /\d+/; // This regex matches one or more digits
const result = text.match(regex);

if (result) {
    console.log(`Extracted number: ${result[0]}`); // Output: Extracted number: 123456
} else {
    console.log("No number found.");
}
