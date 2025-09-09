export default function handler(req, res) {
  if (req.method === "POST") {
    return res.status(200).json({ ok: true, data: req.body });
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
