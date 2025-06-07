const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json()); // for parsing JSON body
app.use(express.static('public'));


app.post('/calculate-units', async (req, res) => {
  try {
    const { currentReading } = req.body;
    if (typeof currentReading !== 'number' || currentReading < 0) {
      return res.status(400).json({ error: 'Invalid current reading' });
    }

    const refNo = "11132281778951"; // aapka ref no
    const url = `https://fesco-bill.pk/complete-bill/?refno=${refNo}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(response.data);

    let previousReading = null;
    const rows = $('tr');

    rows.each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length > 0 && cells.toArray().some(td => $(td).text().trim().toUpperCase() === 'PRESENT READING')) {
        let presentReadingIndex = -1;
        cells.each((idx, td) => {
          if ($(td).text().trim().toUpperCase() === 'PRESENT READING') presentReadingIndex = idx;
        });

        const nextRow = rows.eq(i + 1);
        if (nextRow.length > 0) {
          const valCell = nextRow.find('td').eq(presentReadingIndex);
          const valText = valCell.text().trim();
          previousReading = parseInt(valText.replace(/\D/g, ''));
        }
      }
    });

    if (previousReading === null) {
      return res.json({ error: 'Previous reading not found' });
    }

    const unitsConsumed = currentReading - previousReading;

    res.json({ previousReading, currentReading, unitsConsumed });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(3000, () => console.log('Server started at http://localhost:3000'));
