import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // ✅ Ensure body is always parsed
      let body = req.body;
      if (!body || typeof body !== "object") {
        try {
          body = JSON.parse(req.body);
        } catch {
          body = {};
        }
      }

      console.log("Incoming body:", body);

      const scriptUrl =
        "https://script.google.com/macros/s/AKfycbx8DZgIpM92kk1jQm1-oLtIfQuYm2NzAsmInBZ6rtx_cLGXQMPkr6bhvo7PzKDhCJQp/exec";

      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), // ✅ use parsed body
      });

      const text = await response.text();
      console.log("Google response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error("Submit error:", err);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
