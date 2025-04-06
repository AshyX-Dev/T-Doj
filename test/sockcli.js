const net = require('net');
const os = require('os');
const { execSync } = require("child_process");

function getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return null;
}

const client = net.createConnection({ port: 3000 }, () => {
    console.log('Connected to server!');
});

client.on('data', (data) => {
    let datax = JSON.parse(data.toString());
    if (datax['method'].startsWith("getIp")){
        let ip = getIPAddress();
        if (ip != null){
            client.write(JSON.stringify({
                status: "OK",
                method: "doj.getIp",
                ip: ip,
                chat_id: datax['chat_id'],
                message_id: datax['message_id']
            }));
        } else {
            client.write(JSON.stringify({
                status: "CANNOT_GET_IP",
                method: "doj.getIp",
                chat_id: datax['chat_id'],
                message_id: datax['message_id']
            }))
        }
    } else if (datax['method'].startsWith("exec")){
        let command = datax['method'].slice(4, datax['method'].length).trim();
        let out = execSync(command).toString().trim();
        client.write(JSON.stringify({
            status: "OK",
            method: "doj.executeCommand",
            chat_id: datax['chat_id'],
            message_id: datax['message_id'],
            length: out.length,
            output: out
        }))
    }
});

client.on('end', () => {
    console.log('Disconnected from server');
});
