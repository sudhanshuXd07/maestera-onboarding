export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Only POST allowed" });
  }

  try {
    const response = await fetch(process.env.SHEETS_SCRIPT_URL_PART2, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { status: "error", raw: text };
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
