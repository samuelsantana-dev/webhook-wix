const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

async function sendMessage(phoneNumber, message) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com/');
  
    // ... (código para logar no WhatsApp Web)
  
    const chatSelector = `//span[contains(@title, "${phoneNumber}")]`;
    await page.waitForSelector(chatSelector);
    await page.click(chatSelector);
  
    await page.type('div[class*="input"]', message);
    await page.keyboard.press('Enter');
  
    await browser.close();
  }

app.post('/webhook', (req, res) => {
  console.log('Received request body:', req.body);

  if (typeof req.body !== 'object' || req.body === null) {
    return res.status(400).send('Invalid request body');
  }

  const { to, body } = req.body;

  if (!to || !body) {
    return res.status(400).send('Missing required fields: "to" and "body"');
  }

  sendMessage(to, body);

  res.status(200).send('Message received successfully');
});

app.listen(3000, () => console.log('Server is running on port 3000'));