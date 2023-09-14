const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const axios = require('axios');
// http://api.brainshop.ai/get?bid=177847&key=oxQoxF7odL8vzb6U&uid=[uid]&msg=[msg]

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

client.on('message', msg => {
    axios.get('http://api.brainshop.ai/get?bid=177847&key=oxQoxF7odL8vzb6U', {
        params: {
            uid: msg.from,
            msg: msg.body
        }
    })
        .then(function (response) {
            msg.reply(response.data.cnt)
        })
        .catch(function (error) {
            console.log(error);
        })
});
