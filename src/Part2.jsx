import React, { useState } from "react";
import logo from "./assets/logomaestera.jpeg";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

// BRAND COLORS
const brand = {
  black: "#0a0a0a",
  red: "#e11d48",
  offwhite: "#fafafa",
};

// SHARED COMPONENTS (copied from Part 1)
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
    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-600 placeholder-neutral-400 bg-white"
  />
);

// INSTRUMENT LIST (same as Part 1)
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

// SEARCHABLE MULTI DROPDOWN (same look as Part 1)
const SearchableDropdown = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [other, setOther] = useState("");

  const selected = value ? value.split(", ") : [];

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (item) => {
    let next;
    if (selected.includes(item)) {
      next = selected.filter((i) => i !== item);
    } else {
      next = [...selected, item];
    }
    onChange(next.join(", "));
  };

  const addOther = () => {
    if (!other.trim()) return;
    const next = [...selected, other.trim()];
    onChange(next.join(", "));
    setOther("");
  };

  return (
    <div className="relative w-full">
      <div
        className="border rounded-xl px-4 py-2.5 bg-white cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selected.length > 0 ? selected.join(", ") : "Select instruments"}
      </div>

      {open && (
        <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg max-h-56 overflow-y-auto p-3 z-20">
          <input
            className="w-full border rounded-lg p-2 mb-3"
            placeholder="Search instrument..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filtered.map((item) => (
            <div
              key={item}
              className="p-2 hover:bg-neutral-100 rounded cursor-pointer flex justify-between"
              onClick={() => toggle(item)}
            >
              <span>{item}</span>
              {selected.includes(item) && <span>✔</span>}
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
              onClick={addOther}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ⭐ FULLY STYLED PART 2 PAGE
export default function Part2() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [rows, setRows] = useState([
    {
      instruments: "",
      type: "",
      mode: "",
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
        instruments: "",
        type: "",
        mode: "",
        beginner: "",
        intermediate: "",
        advanced: "",
        performanceFee: "",
      },
    ]);
  };

  const updateRow = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;
    setRows(updated);
  };

  const submitForm = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: brand.offwhite }}>
        <h2 className="text-3xl font-semibold text-neutral-900">Thank you for your response</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.offwhite }}>
      {/* Header */}
      <header className="w-full bg-black border-b-4 border-pink-600 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center justify-center gap-4 flex-grow">
            <img src={logo} alt="Maestera Logo" className="h-43 object-contain" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5
