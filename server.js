const express = require('express');
const axios = require('axios');
const qs = require('querystring');

const app = express();
app.use(express.json());

app.post('/pmc', async (req, res) => {
  try {
    // Convert the incoming JSON body to a string
    const jsonBody = JSON.stringify(req.body);
    console.log("Forwarding body to Apps Script:", jsonBody);

    // Send the payload as form-urlencoded to Google Apps Script
    const response = await axios.post(
      "https://script.google.com/macros/s/AKfycbwcpoFjhgVr7kEKi7kdwCIzR_hSOcLetF1jqh8xbaBE7WpFQyv5b1xWi9L4JdcPPHd7/exec",
      qs.stringify({ payload: jsonBody }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Return the response from Apps Script
    res.json(response.data);
  } catch (error) {
    console.error("Error response from Apps Script:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));

