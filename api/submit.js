export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    const response = await fetch(process.env.SHEETS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    // Read raw response text for debugging
    const text = await response.text();
    console.log("Raw response from Apps Script:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: "error", message: "Invalid JSON from Apps Script", raw: text };
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.ok ? 200 : 500).json(data);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ error: err.message });
  }
}
