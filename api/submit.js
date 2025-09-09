export default function handler(req, res) {
  if (req.method === "POST") {
    return res.status(200).json({ ok: true, message: "POST received" });
  }
  res.status(200).json({ ok: true, message: "API working" });
}
