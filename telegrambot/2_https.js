const https = require('https');

// Sizning tokeningizni bu yerga qo'ying
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const apiUrl = `https://api.telegram.org/bot${token}`;

// Xabar yuborish funktsiyasi
function sendMessage(chatId, text) {
  const url = `${apiUrl}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;

  https.get(url, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  }).on('error', (e) => {
    console.error('Error sending message:', e);
  });
}

// Yangilanishlarni qayta ishlash funktsiyasi
function handleUpdates(updates) {
  if (updates && updates.result) {
    updates.result.forEach((update) => {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      // Agar /start komandasini yuborsa
      if (text && text.toLowerCase() === '/start') {
        sendMessage(chatId, 'Salom! Men sizning botim.');
      } else if (text) {
        sendMessage(chatId, `Siz xabar yubordingiz: ${text}`);
      }
    });
  } else {
    console.log('Yangilanishlar mavjud emas:', updates);
  }
}

// Yangilanishlarni olish funktsiyasi
function getUpdates(offset = 0) {
  const url = `${apiUrl}/getUpdates?offset=${offset}`;

  https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const updates = JSON.parse(data);
        handleUpdates(updates);

        // Keyingi yangilanishlar uchun offsetni yangilash
        if (updates.result && updates.result.length > 0) {
          const lastUpdateId = updates.result[updates.result.length - 1].update_id;
          getUpdates(lastUpdateId + 1);
        }
      } catch (e) {
        console.error('JSON Parsing Error:', e);
      }
    });
  }).on('error', (e) => {
    console.error('HTTP Error:', e);
  });
}

// Botni doimiy ishga tushirish uchun interval qo'shish
setInterval(() => {
  getUpdates();
}, 1000); // Har 1 soniyada yangilanishlarni tekshirish
