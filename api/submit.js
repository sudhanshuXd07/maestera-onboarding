export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbx8DZgIpM92kk1jQm1-oLtIfQuYm2NzAsmInBZ6rtx_cLGXQMPkr6bhvo7PzKDhCJQp/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
        }
      );

      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
