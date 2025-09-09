export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const response = await fetch(process.env.SHEETS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text(); // Google Apps Script may not send JSON
    return res.status(200).json({ success: true, text });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
