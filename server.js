const express = require('express');
const axios = require('axios');
const qs = require('querystring');

const app = express();

// Use text body parser so we control JSON ourselves
app.use(express.text({ type: "*/*" }));

app.post('/pmc', async (req, res) => {
  try {
    let bodyData;

    // If incoming is JSON
    if (req.is('application/json')) {
      bodyData = JSON.parse(req.body);
    }
    // If incoming is form-urlencoded
    else if (req.is('application/x-www-form-urlencoded')) {
      const parsed = qs.parse(req.body);
      bodyData = JSON.parse(parsed.payload);
    } else {
      throw new Error("Unsupported content type");
    }

    console.log("Forwarding payload to Apps Script:", JSON.stringify(bodyData));

    // Send to Apps Script as form-urlencoded
    const response = await axios.post(
      "https://script.google.com/macros/s/AKfycbwcpoFjhgVr7kEKi7kdwCIzR_hSOcLetF1jqh8xbaBE7WpFQyv5b1xWi9L4JdcPPHd7/exec",
      qs.stringify({ payload: JSON.stringify(bodyData) }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding to Apps Script:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));

