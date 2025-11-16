// Integrated React file with searchable instrument dropdown
// (Only the instrument field is modified; all other fields unchanged)

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "./assets/logomaestera.jpeg";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const SHEETS_SCRIPT_URL = "/api/submit";

const brand = {
  black: "#0a0a0a",
  red: "#e11d48",
  offwhite: "#fafafa",
};

// ======================== INSTRUMENT LIST ========================
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

// ================= Searchable Dropdown Component =================
const SearchableDropdown = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [other, setOther] = useState("");

  const filtered = options.filter(o =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  const select = (v) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        className="border rounded-xl px-4 py-2.5 bg-white cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {value || "Select an instrument"}
      </div>

      {open && (
        <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg max-h-56 overflow-y-auto p-3 z-20">
          <input
            className="w-full border rounded-lg p-2 mb-3"
            placeholder="Search instrument..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filtered.map(item => (
            <div
              key={item}
              className="p-2 hover:bg-neutral-100 rounded cursor-pointer"
              onClick={() => select(item)}
            >
              {item}
            </div>
          ))}

          <div className="mt-3 border-t pt-3">
            <input
              className="w-full border rounded-lg p-2"
              placeholder="Other instrument"
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />

            <button
              className="mt-2 bg-black text-white py-1.5 w-full rounded-lg"
              onClick={() => {
                if (other.trim()) select(other.trim());
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= Existing Components =================
const Section = ({ title, subtitle, children }) => (
  <div className="w-full max-w-3xl mx-auto">
    <div className="flex items-center mb-2 ">
      <span className="inline-block h-6 w-1 rounded bg-rose-600 mr-2" />
      <h2 className="text-2xl font-semibold text-[#0a0a0a] tracking-tight">
        {title}
      </h2>
    </div>

    {subtitle && (
      <div className="w-full text-left">
        <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>
      </div>
    )}

    <div className="mt-5 space-y-4 text-left">{children}</div>
  </div>
);

const Field = ({ label, required, children }) => (
  <label className="block">
    <span className="text-sm font-medium text-neutral-800">
      {label} {required && <span className="text-rose-600">*</span>}
    </span>
    <div className="mt-2">{children}</div>
  </label>
);

const Input = (props) => (
  <input
    {...props}
    className={[
      "w-full rounded-xl border border-neutral-300 px-4 py-2.5",
      "focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-600",
      "placeholder-neutral-400 bg-white",
    ].join(" ")}
  />
);

// ============================ APP =============================
export default function App() {
  const [step, setStep] = useState(1);

  const [basic, setBasic] = useState({
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    instruments: "", // stays same for backend
    city: "",
    pincode: "",
  });

  return (
    <div className="min-h-screen p-10" style={{ backgroundColor: brand.offwhite }}>
      <Section title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Field label="Full Name" required>
            <Input
              placeholder="Your full name"
              value={basic.fullName}
              onChange={(e) => setBasic({ ...basic, fullName: e.target.value })}
            />
          </Field>

          <Field label="Phone Number" required>
            <Input
              placeholder="9876543210"
              value={basic.phone}
              onChange={(e) => setBasic({ ...basic, phone: e.target.value })}
            />
          </Field>

          <Field label="Email" required>
            <Input
              type="email"
              placeholder="you@example.com"
              value={basic.email}
              onChange={(e) => setBasic({ ...basic, email: e.target.value })}
            />
          </Field>

          <Field label="Date of Birth" required>
            <Input
              type="date"
              value={basic.dob}
              onChange={(e) => setBasic({ ...basic, dob: e.target.value })}
            />
          </Field>

          {/* ===== UPDATED INSTRUMENT FIELD ===== */}
          <Field label="Instrument you play or teach" required>
            <SearchableDropdown
              value={basic.instruments}
              onChange={(v) => setBasic({ ...basic, instruments: v })}
              options={INSTRUMENTS}
            />
          </Field>

          <Field label="Current City" required>
            <Input
              placeholder="e.g. Mumbai"
              value={basic.city}
              onChange={(e) => setBasic({ ...basic, city: e.target.value })}
            />
          </Field>

          <Field label="Pincode" required>
            <Input
              placeholder="400001"
              value={basic.pincode}
              onChange={(e) => setBasic({ ...basic, pincode: e.target.value })}
            />
          </Field>

        </div>
      </Section>
    </div>
  );
}
