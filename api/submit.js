// api/submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(process.env.SHEETS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    // Google Apps Script often responds with text, not JSON
    const text = await response.text();

    return res.status(200).json({ success: true, data: text });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
