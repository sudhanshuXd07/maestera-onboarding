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

  const validate = () => {
    if (!name.trim()) return "Full Name is required";
    if (!phone.trim()) return "Phone Number is required";
    for (let r of rows) {
      if (!r.instrument) return "Instrument is required";
      if (!r.action) return "Please choose Teach or Perform";
      if (r.action === "perform" && !r.performanceFee) return "Performance fee is required";
      if (r.action === "teach") {
        if (!r.offlineOnline) return "Please select Online or Offline";
        if (!r.beginner) return "Beginner fee is required";
        if (!r.intermediate) return "Intermediate fee is required";
        if (!r.advanced) return "Advanced fee is required";
      }
    }
    return null;
  };

  const submitForm = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    const payload = {
      name,
      phone,
      rows,
    };

    try {
      await fetch("/api/submit2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (error) {
      alert("Something went wrong. Try again");
    }
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

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-800 mb-1">Full Name</label>
              <input
                className="w-full border rounded-xl p-2.5"
                value={name}
                placeholder="Enter the same name as Part 1"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-800 mb-1">Phone Number</label>
              <input
                className="w-full border rounded-xl p-2.5"
                value={phone}
                placeholder="Enter the same phone number as Part 1"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {rows.map((row, i) => (
              <div key={i} className="border rounded-xl p-5 mb-6 bg-neutral-50">
                {/* Instrument */}
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

                {/* Teach or Perform */}
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
                      placeholder="Performance fee"
                      onChange={(e) => updateRow(i, "performanceFee", e.target.value)}
                    />
                  </div>
                )}

                {row.action === "teach" && (
                  <>
                    {/* Class Type */}
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
