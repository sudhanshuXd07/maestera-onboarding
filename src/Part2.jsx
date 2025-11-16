import React, { useState } from "react";
import logo from "./assets/logomaestera.jpeg";

const INSTRUMENTS = [
  "Accordion","Acoustic Guitar","Alto Saxophone","Bagpipes","Banjo","Baritone Saxophone","Bass Clarinet","Bass Drum","Bass Guitar","Bassoon","Bhajan","Bongos","Cabasa","Cajón","Carnatic Vocals","Castanets","Celesta","Cello","Cello Banjo","Chalumeau","Cimbalom","Clarinet","Claves","Clavichord","Composition","Congas","Contrabassoon","Cornet","Cowbell","Crwth","Cymbals","Dholak","Dholki","Didgeridoo","Digital Piano","DJ","Djembe","Dotara","Double Bass","Drums","Dulcimer","Electric Bass","Electric Guitar","Electric Organ","Electric Piano","English Horn","Euphonium","Ewe Drum","Fife","Flugelhorn","Flute","Folk","French Horn","Ghazal","Glass Armonica","Glockenspiel","Grand Piano","Guiro","Guitar","Hang Drum","Hardanger Fiddle","Harmonica","Harmonium","Harp","Harpsichord","Hindustani Vocals","Jaltarang","Jaw Harp","Kalimba","Kantele","Keyboard","Koto","Lute","Mandolin","Marimba","Mbira","Mellotron","Melodica","Morin Khuur","Mridangam","Music Production","Music Theory","Musical Saw","Nyckelharpa","Oboe","Ocarina","Organ","Pan Flute","Percussion","Piano","Piccolo","Pipa","Rabindra Sangeet","Raga","Recorder","Sarod","Saxophone","Saz","Shamisen","Shofar","Sitar","Snare Drum","Sousaphone","Spoons","Steel Drum","Stroh Violin","Synthesizer","Tabla","Tambourine","Tenor Saxophone","Theremin","Timbales","Timpani","Tom-Tom","Triangle","Trombone","Trumpet","Tuba","Ukulele","Upright Piano","Veena","Vibraphone","Viola","Violin","Western Vocals","Xylophone","Zither"
];

export default function Part2() {
  const [submitted, setSubmitted] = useState(false);
  const [rows, setRows] = useState([
    { instrument: "", action: "", offlineOnline: "", beginner: "", intermediate: "", advanced: "", performanceFee: "" }
  ]);

  const addRow = () => {
    setRows([...rows, { instrument: "", action: "", offlineOnline: "", beginner: "", intermediate: "", advanced: "", performanceFee: "" }]);
  };

  const updateRow = (i, key, value) => {
    const next = [...rows];
    next[i][key] = value;
    setRows(next);
  };

  const submitForm = async () => {
    await fetch("/api/submit2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="w-full bg-black border-b-4 border-pink-600 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <img src={logo} alt="Maestera Logo" className="h-20 object-contain" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {submitted ? (
          <div className="bg-white border rounded-2xl p-10 text-center shadow-md">
            <h2 className="text-3xl font-semibold text-neutral-900">Thank you for your response!</h2>
            <p className="mt-4 text-neutral-700">We will be in touch with you shortly.</p>
          </div>
        ) : (
          <div className="bg-white border rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Additional Details</h2>

            {rows.map((row, i) => (
              <div key={i} className="border rounded-xl p-5 mb-6 bg-neutral-50">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-800 mb-1">Instrument</label>
                  <select
                    className="w-full border rounded-xl p-2.5"
                    value={row.instrument}
                    onChange={(e) => updateRow(i, "instrument", e.target.value)}
                  >
                    <option value="">Select Instrument</option>
                    {INSTRUMENTS.map((inst) => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-800 mb-1">Teach or Perform?</label>
                  <select
                    className="w-full border rounded-xl p-2.5"
                    value={row.action}
                    onChange={(e) => updateRow(i, "action", e.target.value)}
                  >
                    <option value="">Select Option</option>
                    <option value="teach">Teach</option>
                    <option value="perform">Perform</option>
                  </select>
                </div>

                {row.action === "perform" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-800 mb-1">Performance Fee (per hour)</label>
                    <input
                      type="number"
                      className="w-full border rounded-xl p-2.5"
                      value={row.performanceFee}
                      onChange={(e) => updateRow(i, "performanceFee", e.target.value)}
                    />
                  </div>
                )}

                {row.action === "teach" && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-800 mb-1">Class Type</label>
                      <select
                        className="w-full border rounded-xl p-2.5"
                        value={row.offlineOnline}
                        onChange={(e) => updateRow(i, "offlineOnline", e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                    </div>

                    <div className="flex gap-4 mb-4">
                      <input
                        type="number"
                        className="w-full border rounded-xl p-2.5"
                        placeholder="Beginner Fee"
                        value={row.beginner}
                        onChange={(e) => updateRow(i, "beginner", e.target.value)}
                      />
                      <input
                        type="number"
                        className="w-full border rounded-xl p-2.5"
                        placeholder="Intermediate Fee"
                        value={row.intermediate}
                        onChange={(e) => updateRow(i, "intermediate", e.target.value)}
                      />
                      <input
                        type="number"
                        className="w-full border rounded-xl p-2.5"
                        placeholder="Advanced Fee"
                        value={row.advanced}
                        onChange={(e) => updateRow(i, "advanced", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            <button
              className="w-full bg-neutral-900 text-white py-3 rounded-xl mb-6"
              onClick={addRow}
            >
              + Add Another Instrument
            </button>

            <button
              className="w-full bg-rose-600 text-white py-3 rounded-xl"
              onClick={submitForm}
            >
              Submit
            </button>
          </div>
        )}
      </main>

      <footer className="mt-16">
        <div className="h-[5px] w-full bg-rose-600" />
        <div className="py-6 text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} Maestera • Made with ♫
        </div>
      </footer>
    </div>
  );
}
