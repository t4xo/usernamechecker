const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

// Kullanıcı token'ını buraya gir
const token = 'KULLANICI_TOKENIN';

// Wordlist dosyasından kullanıcı adlarını oku
const usernames = fs.readFileSync('wordlist.txt', 'utf-8').split('\n').map(u => u.trim()).filter(Boolean);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const checkUsername = async (username) => {
  try {
    await axios.patch(
      'https://discord.com/api/v10/users/@me',
      { username },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`[+] BOŞTA: ${username}`);
    fs.appendFileSync('available.txt', username + '\n');
  } catch (error) {
    const msg = error.response?.data?.errors?.username?._errors?.[0]?.message;
    if (msg?.includes('already taken')) {
      console.log(`[-] DOLU: ${username}`);
    } else {
      console.log(`[!] ${username} - Hata: ${msg || error.message}`);
    }
  }
};

const run = async () => {
  console.log(`[+] ${usernames.length} kullanıcı adı kontrol edilecek...`);
  for (const username of usernames) {
    await checkUsername(username);
    await delay(3000); // 3 saniye delay (rate limit için)
  }
  console.log('[✓] Kontrol tamamlandı.');
};

run();
