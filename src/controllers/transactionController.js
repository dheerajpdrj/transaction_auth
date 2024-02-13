const axios = require("axios");


const transcarion_url =
  process.env.TRANSACTION_SERVICE_URL || "http://localhost:3001/api";
console.log("Transaction URL:", transcarion_url);

exports.addNumbers = async (req, res) => {
  try {
    console.log("Request to Transaction Server:", req.body);
    const { num1, num2 } = req.body;

    const response = await axios.post(`${transcarion_url}/add`, {
      num1,
      num2,
    });
    console.log("Response from Transaction Server:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error:");
    res.json({ error: "Internal server error" });
  }
};
