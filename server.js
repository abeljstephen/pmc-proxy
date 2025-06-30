const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/pmc', async (req, res) => {
  try {
    const response = await axios.post(
      'https://script.google.com/macros/s/AKfycbwcpoFjhgVr7kEKi7kdwCIzR_hSOcLetF1jqh8xbaBE7WpFQyv5b1xWi9L4JdcPPHd7/exec',
      JSON.stringify(req.body),
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));

