const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

// Load the session data
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" })
});

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    try {
        const chats = await client.getChats();
        const isGroupChat = await chats.some(chat => {
            return chat.id._serialized == msg.id.remote ? chat.isGroup : false
        });
        if (isGroupChat) {
            if (msg.body.startsWith('/chat')) {
                const chatMessage = msg.body.substring('/chat'.length).trim();
                const response = await axios.get('http://api.brainshop.ai/get', {
                    params: {
                        bid: 177847,
                        key: 'oxQoxF7odL8vzb6U',
                        uid: msg.author,
                        msg: chatMessage
                    }
                });
                msg.reply(response.data.cnt);
            }
        } else {
            const response = await axios.get('http://api.brainshop.ai/get', {
                params: {
                    bid: 177847,
                    key: 'oxQoxF7odL8vzb6U',
                    uid: msg.author,
                    msg: msg.body
                }
            });
            msg.reply(response.data.cnt);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
