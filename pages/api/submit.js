export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const scriptUrl = process.env.SHEETS_SCRIPT_URL;

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text(); // Apps Script sometimes returns plain text
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { result: text }; // fallback if not JSON
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
