//npm install node-telegram-bot-api

const TelegramBot = require('node-telegram-bot-api');

// Sizning tokeningizni bu yerga qo'ying
const token = 'TELEGRAM_BOT_TOKEN';

// Botni yaratish (polling usulida ishlash)
const bot = new TelegramBot(token, { polling: true });

// /start komandasiga javob berish
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Salom! Men sizning botim.');
});

// Har qanday matnga javob berish
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text.toLowerCase() !== '/start') {
    bot.sendMessage(chatId, 'Siz xabar yubordingiz: ' + msg.text);
  }
});
