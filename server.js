const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/pmc", async (req, res) => {
  try {
    const jsonBody = req.body;
    console.log("Forwarding payload to Apps Script as x-www-form-urlencoded...");
    console.log(JSON.stringify(jsonBody, null, 2));

    // Build URL-encoded body
    const formData = new URLSearchParams();
    formData.append("payload", JSON.stringify(jsonBody));

    // Send to Apps Script
    const response = await axios.post(
      "https://script.google.com/macros/s/AKfycbwcpoFjhgVr7kEKi7kdwCIzR_hSOcLetF1jqh8xbaBE7WpFQyv5b1xWi9L4JdcPPHd7/exec",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        maxRedirects: 0
      }
    );

    console.log("Received response from Apps Script:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error response from Apps Script:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
