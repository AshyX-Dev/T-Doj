const token = "6109425451:AAFRw5GseSxOQgIHpnoShI86sfIujmFM5X0";

const TelegramBot = require("node-telegram-bot-api");
const { Network } = require("./network/net");
const crypto = require("crypto");
const fs = require("fs");

const bot = new TelegramBot(token, { polling: true });
const network = new Network();

const transes = {
    chats   : [],
    tids    : [],
};

const regex = /^https:\/\/tronscan\.org\/#\/transaction\/([a-f0-9]{64})$/;
const regexId = /\d+/;
const regexMoreId = /\d+/g;

if (!fs.existsSync("trns.json")){
    fs.writeFileSync("trns.json", JSON.stringify({
        tokens: []
    }))
}

const append = async (info) => {
    fs.readFile("trns.json", (err, data) => {
        let dx = JSON.parse(data);
        if (dx.tokens.includes(info.token)){}
        else {
            dx.tokens.push(info.token);
            Object.defineProperty(dx, info.token, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: info
            })
            fs.writeFile("trns.json", JSON.stringify(dx), (err) => {})
        }
    })
}

const capture = async (hash, clback = () => {}) => {
    fs.readFile("trns.json", (err, data) => {
        let dx = JSON.parse(data);
        if (!dx.tokens.includes(hash)){ clback({ status: "ERROR" });return; }
        else { 
            clback({
                status: "OK",
                result: dx[hash]
            });
        }
    })
}

const createHash = async () => {
    const hash = crypto.createHash("md5").update(
        (Math.floor(Math.random() * 99999999999999) - 100000000).toString()
    ).digest("hex");

    const formattedHash = `D-${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`;
    return formattedHash;
}

bot.on("message", async (message) => {
    message.text == undefined ? message.text = "" : true;
    if (transes.chats.includes(Buffer.from(message.chat.id.toString()).toString())){
        let x = 0;
        if (!Object.keys(transes[message.chat.id]).includes("objects")){
            transes[message.chat.id]['objects'] = [];
        }
        for (let obj of transes[message.chat.id]['objects']){
            x += 1;
            if (obj['to'] !== null){
                if (obj['from'] == message.from.id){
                    if (obj['settings']['from_hash'] == null){
                        await bot.deleteMessage(message.chat.id, message.message_id);
                        await bot.sendMessage(
                            message.chat.id,
                            "[ 🌐 ] - درحال پردازش ...",
                        ).then(async (lmsg) => {
                            await network.getAccountInfo(message.text, async (account) => {
                                if (account.balance == undefined && account.date_created == undefined && account.address == undefined){
                                    await bot.editMessageText("[ ❌ ] - هش ارسال شده اشتباه میباشد, دوباره ارسال کنید", {
                                        chat_id: lmsg.chat.id,
                                        message_id: lmsg.message_id
                                    })
                                } else {
                                    obj['text'] = obj['text'].replace('[ ⌨ ] - از: ...', `[ ⌨ ] - از: ${message.text}`) // EDIT ( REPLACE )
                                    obj['settings']['from_hash'] = message.text;
                                    await bot.editMessageText(obj['text'], {
                                        chat_id: message.chat.id,
                                        message_id: obj['message_id']
                                    })
                                    await bot.editMessageText("[ 📌 ] - هش ارسالی درسته و ذخیره شده است", {
                                        chat_id: lmsg.chat.id,
                                        message_id: lmsg.message_id
                                    })
                                    if (obj['settings']['translink'] == null && obj['settings']['to_hash'] != null && obj['settings']['from_hash'] != null){
                                        await bot.sendMessage(message.chat.id, `[ 🎛 ] - کاربر ${obj['from']} هش تراکنشو ارسال کنه`)
                                    }
                                }
                            })
                        })
                    }
                } else if (obj['to'] == message.from.id){
                    if (obj['settings']['to_hash'] == null){
                        await bot.deleteMessage(message.chat.id, message.message_id);
                        await bot.sendMessage(
                            message.chat.id,
                            "[ 🌐 ] - درحال پردازش ...",
                        ).then(async (lmsg) => {
                            await network.getAccountInfo(message.text, async (account) => {
                                if (account.balance == undefined && account.date_created == undefined && account.address == undefined){
                                    await bot.editMessageText("[ ❌ ] - هش ارسال شده اشتباه میباشد, دوباره ارسال کنید", {
                                        chat_id: lmsg.chat.id,
                                        message_id: lmsg.message_id
                                    })
                                } else {
                                    obj['text'] = obj['text'].replace('[ 🎟 ] - به: ...', `[ 🎟 ] - به: ${message.text}`) // EDIT ( REPLACE )
                                    obj['settings']['to_hash'] = message.text;
                                    await bot.editMessageText(obj['text'], {
                                        chat_id: message.chat.id,
                                        message_id: obj['message_id']
                                    })
                                    await bot.editMessageText("[ 📌 ] - هش ارسالی درسته و ذخیره شده است", {
                                        chat_id: lmsg.chat.id,
                                        message_id: lmsg.message_id
                                    })
                                    if (obj['settings']['translink'] == null && obj['settings']['to_hash'] != null && obj['settings']['from_hash'] != null){
                                        await bot.sendMessage(message.chat.id, `[ 🎛 ] - کاربر ${obj['from']} هش تراکنشو ارسال کنه`)
                                    }
                                }
                            })
                        })
                    }
                } 

                if (message.text.startsWith("https://tronscan.org/#/transaction/") && message.from.id == obj['from']){
                    await bot.deleteMessage(message.chat.id, message.message_id);
                    await bot.sendMessage(
                        message.chat.id,
                        "[ 🌐 ] - در حال پردازش ..."
                    ).then(async (rmsg) => {
                        await network.getTransactionInfo(message.text.replace('https://tronscan.org/#/transaction/', ''), async (trans) => {
                            if (trans.timestamp == undefined && trans.toAddress == undefined && trans.ownerAddress == undefined){
                                await bot.editMessageText("[ ❌ ] - هش ارسال شده اشتباه میباشد, دوباره ارسال کنید", {
                                    chat_id: rmsg.chat.id,
                                    message_id: rmsg.message_id
                                })
                            } else {
                                obj['settings']['translink'] = message.text;
                                let stat = false;
                                let lts = obj;
                                createHash().then(async (hash) => {
                                    lts.token = hash;
                                    await append(lts)
                                    let text = `[ 🕷 ] - از: ${obj['from']}\n[ 🦋 ] - به: ${obj['to']}\n\n[ 🎁 ] - ارسال کننده: <code>${obj['settings']['from_hash']}</code>\n\n[ 👔 ] - دریافت کننده: <code>${obj['settings']['to_hash']}</code>\n\n[ 💵 ] - بالانس: ${trans.balance}\n`;
                                    if (trans.ownerAddress == obj['settings']['from_hash'] && trans.toAddress == obj['settings']['to_hash']){
                                        text += `[ ✅ ] - ارسال کننده و دریافت کننده مچ هستن\n[ 🔰 ] - <a href="${trans.urlHash}">لینک تراکنش</a>\n[ 🏁 ] - توکن: <code>${hash}</code>`;
                                        stat = true;
                                    } else {
                                        text += `[ ❌ ] - ارسال کننده و دریافت کننده مچ نیستند\n[ 🔰 ] - <a href="${trans.urlHash}">لینک تراکنش</a>\n[ 🏁 ] - توکن: <code>${hash}</code>`;
                                    }
                                    await bot.editMessageText(text, {
                                        chat_id: rmsg.chat.id,
                                        message_id: rmsg.message_id,
                                        parse_mode: "HTML"
                                    })
                                    stat === true ? lts['success'] = true : lts['success'] = false;
                                    const fm = Buffer.from(obj['from'].toString()).toString("base64");
                                    const tp = Buffer.from(obj['to'].toString()).toString("base64");
                                    transes[message.chat.id]['objects'].splice(x, 1);
                                    transes.tids.splice(transes.tids.indexOf(fm), 1);
                                    transes.tids.splice(transes.tids.indexOf(tp), 1);
                                    if (transes[message.chat.id]['objects'].length == 0){
                                        delete transes[message.chat.id];
                                        delete transes.chats.splice(transes.chats.indexOf(message.chat.id), 1);
                                    }
                                })
                            }
                        })
                    })
                }
            }
        }
    }

    /* if (message.text == "واسطه"){
        if (transes.tids.includes(Buffer.from(message.from.id.toString()).toString("base64"))){
            await bot.sendMessage(
                message.chat.id,
                "[ ❌ ] - معامله ای برای شمال تحت انجام است",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "بستن 🍬",
                                    callback_data: `close_${message.from.id}`
                                }
                            ]
                        ]
                    }
                }
            )
        } else {
            await bot.sendMessage(
                message.chat.id,
                `[ 📥 ] - شروع کننده: ${message.from.id}\n[ 👀 ] - منتظر طرف دوم قرارداد ...`,
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "ثبت 👥",
                                    callback_data: `signFor_${message.from.id}`
                                }
                            ]
                        ]
                    }
                }
            ).then((rmsg) => {

                if (!transes.chats.includes(message.chat.id)) transes.chats.push(message.chat.id);
                transes.tids.push(Buffer.from(message.from.id.toString()).toString("base64"));

                if (!Object.keys(transes).includes(Buffer.from(message.chat.id.toString()).toString())){
                    transes[message.chat.id] = {};
                    transes[message.chat.id]['objects'] = [];
                }
                transes[message.chat.id]['objects'].push({
                    from: message.from.id,
                    to: null,
                    message_id: rmsg.message_id,
                    end: new Date().getTime() + 300000,
                    text: "",
                    settings: {
                        from_hash: null,
                        to_hash: null,
                        translink: null
                    }
                });
            })
        }
    */
    if (message.text == "واسطه"){
        if (transes.tids.includes(Buffer.from(message.from.id.toString()).toString("base64"))){
            await bot.sendMessage(
                message.chat.id,
                "[ ❌ ] - معامله ای برای شمال تحت انجام است",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "بستن 🍬",
                                    callback_data: `close_${message.from.id}`
                                }
                            ]
                        ]
                    }
                }
            )
        } else {
            if (message.reply_to_message){
                await bot.sendMessage(
                    message.chat.id,
                    `[ 💎 ] - توجه داشته باش که طرف مقابلت ${message.reply_to_message.from.id} هس و خودت ${message.from.id}\n\n<b>نقش ها ♻</b>\n[ 🔐 ] - دریافت کننده: کسی که قراره پول رو دریافت بکنه\n[ 🔓 ] - ارسال کننده: کسی که قراره پولو بزنه`,
                    {
                        parse_mode: "HTML",
                        reply_to_message_id: message.message_id,
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "دریافت کننده 📪",
                                        callback_data: `get_${message.from.id}`
                                    },
                                    {
                                        text: "ارسال کننده 🍬",
                                        callback_data: `send_${message.from.id}`
                                    }
                                ]
                            ]
                        }
                    }
                ).then(async (rmsg) => {
                    let cis = Buffer.from(message.chat.id.toString()).toString();
                    if (!transes.chats.includes(cis)) { transes.chats.push(cis);transes[message.chat.id] = {};transes[message.chat.id]['objects'] = [] }
                    transes.tids.push(Buffer.from(message.from.id.toString()).toString("base64"));

                    if (!Object.keys(transes).includes(cis)){
                        transes[message.chat.id] = {};
                        transes[message.chat.id]['objects'] = [];
                    }
                    /*
                    {
                                        text: "لغو ❌",
                                        callback_data: `cancel`
                                    }
                     */
                    transes[message.chat.id]['objects'].push({
                        from: null,
                        to: null,
                        message_id: rmsg.message_id,
                        end: new Date().getTime() + 300000,
                        text: "",
                        settings: {
                            from_hash: null,
                            to_hash: null,
                            translink: null
                        }
                    });
                    await bot.editMessageText(
                        `[ 💎 ] - توجه داشته باش که طرف مقابلت ${message.reply_to_message.from.id} هس و خودت ${message.from.id}\n\n<b>نقش ها ♻</b>\n[ 🔐 ] - دریافت کننده: کسی که قراره پول رو دریافت بکنه\n[ 🔓 ] - ارسال کننده: کسی که قراره پولو بزنه`,
                        {
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: "دریافت کننده 📪",
                                            callback_data: `get_${message.from.id}`
                                        },
                                        {
                                            text: "ارسال کننده 🍬",
                                            callback_data: `send_${message.from.id}`
                                        }
                                    ],
                                    [
                                        {
                                            text: "لغو ❌",
                                            callback_data: `cancel_${rmsg.message_id}`
                                        }
                                    ]
                                ]
                            }
                        }
                    )
                })
            } else {
                await bot.sendMessage(
                    message.chat.id,
                    "[ ❌ ] - روی شخص مورد نظر ریپلای کن",
                    {
                        reply_to_message_id: message.message_id,
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "بستن 🍬",
                                        callback_data: `close_${message.from.id}`
                                    }
                                ]
                            ]
                        }
                    }
                )
            }
        }
    }
})

bot.on("callback_query", async (call) => {
    if (call.data.startsWith("close")){
        const spl = call.data.split("_");
        const uid = parseInt(spl[1]);
        if (uid == call.from.id){
            try{ await bot.deleteMessage(call.message.chat.id, call.message.message_id); } catch (e){}
        }
    } else if (call.data.startsWith("signFor")){
        const spl = call.data.split("_");
        const uid = parseInt(spl[1]);
        if (transes.tids.includes(Buffer.from(call.from.id.toString()).toString("base64"))){}
        else {
            const fmid = call.message.text.match(regexId);
            for (let obj of transes[call.message.chat.id]['objects']){
                if (obj['from'] == fmid && obj['message_id'] == call.message.message_id){
                    obj['to'] = call.from.id;
                    let txt = `[ 🍷 ] - آغاز از سمت: ${uid}\n[ 🎾 ] - به: ${call.from.id}\n\n[ ⌨ ] - از: ...\n\n[ 🎟 ] - به: ...\n\n[ 📃 ] - لطفا هش اکانتاتون رو ارسال کنید`;
                    obj['text'] = txt;
                    await bot.editMessageText(txt, {
                        chat_id: call.message.chat.id,
                        message_id: call.message.message_id
                    })
                    break
                }
            }
        }
    } else if (call.data.startsWith("get")){
        if (transes.tids.includes(Buffer.from(call.from.id.toString()).toString("base64"))){}
        else {
            const iids = call.message.text.match(regexMoreId);
            const fmid = iids[1];
            const toid = iids[0];
            if (transes.chats.includes(Buffer.from(call.message.chat.id.toString()).toString())){
                for (let obj of transes[call.message.chat.id]['objects']){
                    if (obj['message_id'] == call.message.message_id){
                        obj['from'] = parseInt(fmid);
                        obj['to'] = parseInt(toid);
                        let txt = `[ 🍷 ] - آغاز از سمت: ${fmid}\n[ 🎾 ] - به: ${toid}\n\n[ ⌨ ] - از: ...\n\n[ 🎟 ] - به: ...\n\n[ 📃 ] - لطفا هش اکانتاتون رو ارسال کنید`;
                        obj['text'] = txt;
                        await bot.editMessageText(txt, {
                            chat_id: call.message.chat.id,
                            message_id: call.message.message_id
                        })
                        break
                    }
                }
            }
        }
    } else if (call.data.startsWith("send")){
        if (transes.tids.includes(Buffer.from(call.from.id.toString()).toString("base64"))){}
        else {
            const iids = call.message.text.match(regexMoreId);
            const fmid = iids[1];
            const toid = iids[0];
            if (transes.chats.includes(Buffer.from(call.message.chat.id.toString()).toString())){
                for (let obj of transes[call.message.chat.id]['objects']){
                    if (obj['message_id'] == call.message.message_id){
                        obj['from'] = parseInt(toid);
                        obj['to'] = parseInt(fmid);
                        let txt = `[ 🍷 ] - آغاز از سمت: ${toid}\n[ 🎾 ] - به: ${fmid}\n\n[ ⌨ ] - از: ...\n\n[ 🎟 ] - به: ...\n\n[ 📃 ] - لطفا هش اکانتاتون رو ارسال کنید`;
                        obj['text'] = txt;
                        await bot.editMessageText(txt, {
                            chat_id: call.message.chat.id,
                            message_id: call.message.message_id
                        })
                        break
                    }
                }
            }
        }
    }
})

bot.on("inline_query", async (inline) => {
    await capture(inline.query, async (data) => {
        if (data['status'] == "OK"){
            let date = new Date(data['result']['end']);
		console.log(data)
            await bot.answerInlineQuery(
                inline.id,
                [
                    {
                        type: "article",
                        id: '1',
                        title: "👁 Token Found",
                        input_message_content: {
                            message_text: `[ 🎫 ] - token: ${inline.query}\n[ 🌊 ] - from, to: ${data['result']['from']} -> ${data['result']['to']}\n\n[ 🕸 ] - from wallet: ${data['result']['settings']['from_hash']}\n\n[ 🦋 ] - to wallet: ${data['result']['settings']['to_hash']}\n\n[ 🍬 ] - link: ${data['result']['settings']['translink']}\n[ ⌛ ] - finished in ${date.getFullYear()}/${date.getMonth()}/${date.getDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
                        }
                    }
                ]
            )
        } else {
            await bot.answerInlineQuery(
                inline.id,
                [
                    {
                        type: "article",
                        id: '1',
                        title: "❌ Token Not Found",
                        input_message_content: {
                            message_text: `[ ❌ ] - token not found`
                        }
                    }
                ]
            )
        }
    })
})

setInterval(() => {
    for (let chat of transes.chats){
        let now = new Date().getTime();
        let x = 0;
        for (let obj of transes[chat]['objects']){
            x += 1;
            if (obj['end'] <= now){
                let fm = null;
                let tp = null;
                try{
                    fm = Buffer.from(obj['from'].toString()).toString("base64");
                } catch (e) {}
                try {
                    tp = Buffer.from(obj['to'].toString()).toString("base64");
                } catch (e) {}
                
                transes[chat]['objects'].splice(x, 1);
                if (transes.tids.includes(fm)){
                    transes.tids.splice(transes.tids.indexOf(fm),1);
                }
                
                if (transes.tids.includes(tp)){
                    transes.tids.splice(transes.tids.indexOf(tp), 1);
                }

                if (transes[chat]['objects'].length == 0){
                    delete transes[chat];
                    delete transes.chats.splice(transes.chats.indexOf(chat), 1);
                }
            }
        }
    }
}, 3000)
