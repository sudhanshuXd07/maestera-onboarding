import React, { useState } from "react";
import logo from "./assets/logomaestera.jpeg";

const INSTRUMENTS = [
  "Accordion","Acoustic Guitar","Alto Saxophone","Bagpipes","Banjo","Baritone Saxophone","Bass Clarinet","Bass Drum","Bass Guitar","Bassoon","Bhajan","Bongos","Cabasa","Cajón","Carnatic Vocals","Castanets","Celesta","Cello","Cello Banjo","Chalumeau","Cimbalom","Clarinet","Claves","Clavichord","Composition","Congas","Contrabassoon","Cornet","Cowbell","Crwth","Cymbals","Dholak","Dholki","Didgeridoo","Digital Piano","DJ","Djembe","Dotara","Double Bass","Drums","Dulcimer","Electric Bass","Electric Guitar","Electric Organ","Electric Piano","English Horn","Euphonium","Ewe Drum","Fife","Flugelhorn","Flute","Folk","French Horn","Ghazal","Glass Armonica","Glockenspiel","Grand Piano","Guiro","Guitar","Hang Drum","Hardanger Fiddle","Harmonica","Harmonium","Harp","Harpsichord","Hindustani Vocals","Jaltarang","Jaw Harp","Kalimba","Kantele","Keyboard","Koto","Lute","Mandolin","Marimba","Mbira","Mellotron","Melodica","Morin Khuur","Mridangam","Music Production","Music Theory","Musical Saw","Nyckelharpa","Oboe","Ocarina","Organ","Pan Flute","Percussion","Piano","Piccolo","Pipa","Rabindra Sangeet","Raga","Recorder","Sarod","Saxophone","Saz","Shamisen","Shofar","Sitar","Snare Drum","Sousaphone","Spoons","Steel Drum","Stroh Violin","Synthesizer","Tabla","Tambourine","Tenor Saxophone","Theremin","Timbales","Timpani","Tom-Tom","Triangle","Trombone","Trumpet","Tuba","Ukulele","Upright Piano","Veena","Vibraphone","Viola","Violin","Western Vocals","Xylophone","Zither"
];

export default function Part2() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [rows, setRows] = useState([
    {
      instrument: "",
      action: "", // 'teach' or 'perform'
      offlineOnline: "", // 'online' | 'offline' (for teach)
      beginner: "",
      intermediate: "",
      advanced: "",
      performanceFee: "",
    },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        instrument: "",
        action: "",
        offlineOnline: "",
        beginner: "",
        intermediate: "",
        advanced: "",
        performanceFee: "",
      },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    const next = rows.slice();
    next.splice(index, 1);
    setRows(next);
  };

  const updateRow = (i, key, value) => {
    const next = rows.slice();
    next[i] = { ...next[i], [key]: value };
    setRows(next);
  };

  const validate = () => {
    if (!name.trim()) return "Full Name is required.";
    if (!phone.trim()) return "Phone Number is required.";

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.instrument) return `Instrument is required for item ${i + 1}.`;
      if (!r.action) return `Please choose Teach or Perform for item ${i + 1}.`;

      if (r.action === "perform") {
        if (!String(r.performanceFee).trim())
          return `Performance fee is required for ${r.instrument || "item " + (i + 1)}.`;
      }

      if (r.action === "teach") {
        if (!r.offlineOnline)
          return `Please select Online or Offline for ${r.instrument || "item " + (i + 1)}.`;
        if (!String(r.beginner).trim())
          return `Beginner fee is required for ${r.instrument || "item " + (i + 1)}.`;
        if (!String(r.intermediate).trim())
          return `Intermediate fee is required for ${r.instrument || "item " + (i + 1)}.`;
        if (!String(r.advanced).trim())
          return `Advanced fee is required for ${r.instrument || "item " + (i + 1)}.`;
      }
    }

    return null;
  };

  const submitForm = async () => {
    const err = validate();
    if (err) {
      // simple alert is fine for now
      alert(err);
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      instrumentRows: rows,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/submit2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Optional: check response
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("submit2 error", res.status, text);
        alert("Submission failed. Try again.");
        return;
      }

      setSubmitted(true);
    } catch (e) {
      console.error("submit2 fetch error", e);
      alert("Submission failed. Check console.");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafafa" }}>
      {/* Header */}
      <header className="w-full bg-black border-b-4 border-pink-600 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <img src={logo} alt="Maestera Logo" className="h-20 object-contain" />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {submitted ? (
          <div className="w-full max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
              <h2 className="text-3xl font-semibold text-neutral-900">
                Thank you for your response
              </h2>
              <p className="mt-3 text-neutral-700">
                We have received your details — we’ll be in touch shortly.
              </p>

              <div className="mt-8 flex justify-center gap-8">
                <a
                  href="https://wa.me/9867229293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 text-4xl hover:scale-110 transition-transform"
                >
                  {/* just decorative icons — keep markup minimal */}
                  ☎️
                </a>
                <a
                  href="https://www.instagram.com/maestera.music"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 text-4xl hover:scale-110 transition-transform"
                >
                  ✨
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Additional Details</h2>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 placeholder-neutral-400 bg-white"
                value={name}
                placeholder="Enter the same name as Part 1"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Phone Number <span className="text-rose-600">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 placeholder-neutral-400 bg-white"
                value={phone}
                placeholder="Enter the same phone number as Part 1"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Instrument rows */}
            {rows.map((row, i) => (
              <div key={i} className="border border-neutral-200 rounded-2xl p-5 mb-6 bg-neutral-50">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-neutral-900 font-semibold">Instrument #{i + 1}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-sm px-3 py-1 rounded-lg border border-neutral-300 disabled:opacity-50"
                      onClick={() => removeRow(i)}
                      disabled={rows.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Instrument select */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-800 mb-1">Instrument</label>
                  <select
                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 bg-white"
                    value={row.instrument}
                    onChange={(e) => updateRow(i, "instrument", e.target.value)}
                  >
                    <option value="">Select Instrument</option>
                    {INSTRUMENTS.map((inst) => (
                      <option key={inst} value={inst}>
                        {inst}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teach or Perform */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-800 mb-1">Teach or Perform?</label>
                  <select
                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 bg-white"
                    value={row.action}
                    onChange={(e) => updateRow(i, "action", e.target.value)}
                  >
                    <option value="">Select Option</option>
                    <option value="teach">Teach</option>
                    <option value="perform">Perform</option>
                  </select>
                </div>

                {/* Perform flow */}
                {row.action === "perform" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-800 mb-1">Performance Fee (per hour)</label>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 bg-white"
                      value={row.performanceFee}
                      onChange={(e) => updateRow(i, "performanceFee", e.target.value)}
                      placeholder="Enter performance fee in ₹"
                    />
                  </div>
                )}

                {/* Teach flow */}
                {row.action === "teach" && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-800 mb-1">Class Type</label>
                      <select
                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 bg-white"
                        value={row.offlineOnline}
                        onChange={(e) => updateRow(i, "offlineOnline", e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-800 mb-1">Beginner Fee/hr</label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 bg-white"
                          value={row.beginner}
                          onChange={(e) => updateRow(i, "beginner", e.target.value)}
                          placeholder="e.g. 300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-800 mb-1">Intermediate Fee/hr</label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 bg-white"
                          value={row.intermediate}
                          onChange={(e) => updateRow(i, "intermediate", e.target.value)}
                          placeholder="e.g. 500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-800 mb-1">Advanced Fee/hr</label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 bg-white"
                          value={row.advanced}
                          onChange={(e) => updateRow(i, "advanced", e.target.value)}
                          placeholder="e.g. 800"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="button"
                onClick={addRow}
                className="flex-1 px-6 py-2.5 rounded-xl text-white"
                style={{ backgroundColor: "#0a0a0a" }}
              >
                + Add Another Instrument
              </button>

              <button
                type="button"
                onClick={submitForm}
                className="flex-1 px-6 py-2.5 rounded-xl text-white"
                style={{ backgroundColor: "#e11d48" }}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16">
        <div className="h-[5px] w-full bg-rose-600" />
        <div className="py-6 text-center text-xs text-neutral-600">© {new Date().getFullYear()} Maestera • Made with ♫</div>
      </footer>
    </div>
  );
}
