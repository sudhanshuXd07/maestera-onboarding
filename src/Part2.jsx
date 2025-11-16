import React, { useState } from "react";

// ================= INSTRUMENT LIST (same as onboarding) =================
const INSTRUMENTS = [
  "Accordion","Acoustic Guitar","Alto Saxophone","Bagpipes","Banjo","Baritone Saxophone",
  "Bass Clarinet","Bass Drum","Bass Guitar","Bassoon","Bhajan","Bongos","Cabasa","Cajón",
  "Carnatic Vocals","Castanets","Celesta","Cello","Cello Banjo","Chalumeau","Cimbalom",
  "Clarinet","Claves","Clavichord","Composition","Congas","Contrabassoon","Cornet",
  "Cowbell","Crwth","Cymbals","Dholak","Dholki","Didgeridoo","Digital Piano","DJ","Djembe",
  "Dotara","Double Bass","Drums","Dulcimer","Electric Bass","Electric Guitar",
  "Electric Organ","Electric Piano","English Horn","Euphonium","Ewe Drum","Fife",
  "Flugelhorn","Flute","Folk","French Horn","Ghazal","Glass Armonica","Glockenspiel",
  "Grand Piano","Guiro","Guitar","Hang Drum","Hardanger Fiddle","Harmonica",
  "Harmonium","Harp","Harpsichord","Hindustani Vocals","Jaltarang","Jaw Harp","Kalimba",
  "Kantele","Keyboard","Koto","Lute","Mandolin","Marimba","Mbira","Mellotron","Melodica",
  "Morin Khuur","Mridangam","Music Production","Music Theory","Musical Saw","Nyckelharpa",
  "Oboe","Ocarina","Organ","Pan Flute","Percussion","Piano","Piccolo","Pipa",
  "Rabindra Sangeet","Raga","Recorder","Sarod","Saxophone","Saz","Shamisen","Shofar",
  "Sitar","Snare Drum","Sousaphone","Spoons","Steel Drum","Stroh Violin","Synthesizer",
  "Tabla","Tambourine","Tenor Saxophone","Theremin","Timbales","Timpani","Tom-Tom",
  "Triangle","Trombone","Trumpet","Tuba","Ukulele","Upright Piano","Veena","Vibraphone",
  "Viola","Violin","Western Vocals","Xylophone","Zither"
];

// ================= SEARCHABLE DROPDOWN =================
const SearchableDropdown = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div
        className="border rounded-xl px-4 py-2.5 bg-white cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {value || placeholder}
      </div>

      {open && (
        <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg max-h-56 overflow-y-auto p-3 z-20">
          <input
            className="w-full border rounded-lg p-2 mb-3"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filtered.map((item) => (
            <div
              key={item}
              className="p-2 hover:bg-neutral-100 rounded cursor-pointer"
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ================= MAIN FORM =================
export default function OnboardingPart2() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [instrumentRows, setInstrumentRows] = useState([
    {
      instrument: "",
      type: "", // Perform or Teach
      mode: "", // Offline / Online (only if Teach)
      beginner: "",
      intermediate: "",
      advanced: "",
      performanceFee: "",
    },
  ]);

  const updateRow = (index, field, value) => {
    const updated = [...instrumentRows];
    updated[index][field] = value;
    setInstrumentRows(updated);
  };

  const addRow = () => {
    setInstrumentRows([
      ...instrumentRows,
      {
        instrument: "",
        type: "",
        mode: "",
        beginner: "",
        intermediate: "",
        advanced: "",
        performanceFee: "",
      },
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-semibold">Onboarding — Part 2</h1>

      {/* USER IDENTIFICATION */}
      <div className="space-y-4">
        <div>
          <label className="font-medium">Full Name</label>
          <input
            className="w-full border px-4 py-2 rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">Phone Number</label>
          <input
            className="w-full border px-4 py-2 rounded-xl"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* INSTRUMENT ENTRIES */}
      {instrumentRows.map((row, idx) => (
        <div key={idx} className="border rounded-2xl p-5 space-y-4 bg-white shadow-sm">
          <h3 className="font-semibold text-lg">Instrument #{idx + 1}</h3>

          {/* Select Instrument */}
          <SearchableDropdown
            value={row.instrument}
            onChange={(v) => updateRow(idx, "instrument", v)}
            options={INSTRUMENTS}
            placeholder="Select instrument"
          />

          {/* Perform or Teach */}
          <div>
            <label className="font-medium">Do you want to Perform or Teach?</label>
            <select
              className="w-full border px-4 py-2 rounded-xl mt-2"
              value={row.type}
              onChange={(e) => updateRow(idx, "type", e.target.value)}
            >
              <option value="">Select option</option>
              <option value="Perform">Perform</option>
              <option value="Teach">Teach</option>
            </select>
          </div>

          {/* If Perform */}
          {row.type === "Perform" && (
            <div>
              <label className="font-medium">Performance Fee per hour</label>
              <input
                className="w-full border px-4 py-2 rounded-xl mt-2"
                type="number"
                value={row.performanceFee}
                onChange={(e) => updateRow(idx, "performanceFee", e.target.value)}
              />
            </div>
          )}

          {/* If Teach */}
          {row.type === "Teach" && (
            <div className="space-y-4">
              <div>
                <label className="font-medium">Mode</label>
                <select
                  className="w-full border px-4 py-2 rounded-xl mt-2"
                  value={row.mode}
                  onChange={(e) => updateRow(idx, "mode", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div>
                <label className="font-medium">Beginner Fee/hr</label>
                <input
                  className="w-full border px-4 py-2 rounded-xl"
                  type="number"
                  value={row.beginner}
                  onChange={(e) => updateRow(idx, "beginner", e.target.value)}
                />
              </div>
              <div>
                <label className="font-medium">Intermediate Fee/hr</label>
                <input
                  className="w-full border px-4 py-2 rounded-xl"
                  type="number"
                  value={row.intermediate}
                  onChange={(e) => updateRow(idx, "intermediate", e.target.value)}
                />
              </div>
              <div>
                <label className="font-medium">Advanced Fee/hr</label>
                <input
                  className="w-full border px-4 py-2 rounded-xl"
                  type="number"
                  value={row.advanced}
                  onChange={(e) => updateRow(idx, "advanced", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* ADD ANOTHER INSTRUMENT */}
      <button
        className="px-6 py-3 bg-black text-white rounded-xl"
        onClick={addRow}
      >
        + Add Another Instrument
      </button>
    </div>
  );
}
