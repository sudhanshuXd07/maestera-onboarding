import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "./assets/logomaestera.jpeg";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

/**
 * Maestera – Teacher Onboarding (React + Tailwind)
 * Steps: Intro → Basic Info → Preferences → Submit
 * Storage: posts JSON (proxied via /api/submit)
 */

const SHEETS_SCRIPT_URL = "/api/submit";

const brand = {
  black: "#0a0a0a",
  red: "#e11d48",
  offwhite: "#fafafa",
};

const Section = ({ title, subtitle, children }) => (
  <div className="w-full max-w-3xl mx-auto">
    {/* Title centered with vertical red line */}
    <div className="flex items-center mb-2 ">
      <span className="inline-block h-6 w-1 rounded bg-rose-600 mr-2" />
      <h2 className="text-2xl font-semibold text-[#0a0a0a] tracking-tight">
        {title}
      </h2>
    </div>

    {/* Subtitle left aligned */}
    {subtitle && (
      <div className="w-full text-left">
        <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>
      </div>
    )}

    {/* Content left aligned */}
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

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <input
      type="checkbox"
      className="h-5 w-5 rounded-md border-neutral-300 text-rose-600 focus:ring-rose-600"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="text-sm text-neutral-800">{label}</span>
  </label>
);

const Radio = ({ name, value, current, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <input
      type="radio"
      name={name}
      value={value}
      checked={current === value}
      onChange={() => onChange(value)}
      className="h-5 w-5 border-neutral-300 text-rose-600 focus:ring-rose-600"
    />
    <span className="text-sm text-neutral-800">{label}</span>
  </label>
);

const StepNav = ({ step, total, onBack, onNext, canNext, submitting }) => (
  <div className="w-full max-w-3xl mx-auto mt-8 flex items-center justify-between">
    <button
      type="button"
      onClick={onBack}
      disabled={step === 0}
      className="px-5 py-2.5 rounded-xl border border-neutral-300 disabled:opacity-50"
    >
      Back
    </button>
    <div className="flex-1 px-6">
      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-600 transition-all"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
    </div>
    <button
      type="button"
      onClick={onNext}
      disabled={!canNext || submitting}
      className="px-6 py-2.5 rounded-xl text-white"
      style={{ backgroundColor: submitting ? "#78716c" : brand.black }}
    >
      {step + 1 === total ? (submitting ? "Submitting…" : "Submit") : "Next"}
    </button>
  </div>
);

export default function App() {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [basic, setBasic] = useState({
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    instruments: "",
    city: "",
    pincode: "",
  });

  const [assoc, setAssoc] = useState("Education/Teaching");


  const [multi, setMulti] = useState({
    classFormats: new Set(),
    exams: new Set(),
    additionalFormats: new Set(),
    learnerGroups: new Set(),
    performanceSettings: new Set(),
    collabProjects: new Set(),
  });

  const toggle = (group, value) => {
    setMulti((prev) => {
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
  };

  const basicValid = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(basic.email || "");
    const phoneOk = /^[0-9]{7,}$/.test((basic.phone || "").replace(/\D/g, ""));
    return (
      Boolean((basic.fullName || "").trim()) &&
      phoneOk &&
      emailOk &&
      Boolean((basic.city || "").trim()) &&
      Boolean((basic.pincode || "").trim())
    );
  }, [basic]);
  const multiValid = useMemo(() => {
    // Teaching
    const teachingOk =
      assoc !== "Performances" &&
      (multi.classFormats.size > 0 &&
        multi.exams.size > 0 &&
        multi.additionalFormats.size > 0 &&
        multi.learnerGroups.size > 0 &&
        (basic.teachingFee || "").trim() !== "");

    // Performances
    const performanceOk =
      assoc !== "Education/Teaching" &&
      (multi.performanceSettings.size > 0 &&
        (basic.performanceFee || "").trim() !== "");

    return teachingOk || performanceOk || assoc === "Both";
  }, [assoc, multi, basic]);


  const canNext = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return basicValid;
    if (step === 2) return multiValid;

    return true;
  }, [step, basicValid]);

  const payload = useMemo(() => ({
    fullName: basic.fullName || "",
    phone: basic.phone || "",
    email: basic.email || "",
    dob: basic.dob || "",
    instruments: basic.instruments || "",
    city: basic.city || "",
    pincode: basic.pincode || "",
    teachingFee: basic.teachingFee || "",
    performanceFee: basic.performanceFee || "",
    contribution: basic.contribution || "",
    association: assoc,
    classFormats: Array.from(multi.classFormats),
    exams: Array.from(multi.exams),
    additionalFormats: Array.from(multi.additionalFormats),
    learnerGroups: Array.from(multi.learnerGroups),
    performanceSettings: Array.from(multi.performanceSettings),
    collabProjects: Array.from(multi.collabProjects),
    timestamp: new Date().toISOString(),
  }), [basic, assoc, multi]);




  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      console.log("Submitting JSON:", JSON.stringify({ ...payload, contribution: basic.contribution || "" }));

      const res = await fetch(SHEETS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      console.log("Response from API:", result);

      if (!res.ok) throw new Error(result.message || "Submission failed");
      setSubmitted(true);
    } catch (e) {
      setError("There was a problem submitting the form. Please try again.");
      console.error("Submit error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const onNext = () => {
    // If we're on Basic Info step (step === 1) validate and show error
    if (step === 1 && !basicValid) {
      setError("⚠️ Please fill out all required fields before continuing.");
      // optional: scroll to top of form so error is visible
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (step === 2 && !multiValid) {
      setError("⚠️ Please complete all required fields before submitting.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }


    // clear any previous error before advancing
    setError("");

    if (step === totalSteps - 1) {
      submit();
    } else {
      setStep((s) => Math.min(s + 1, totalSteps - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.offwhite }}>

      <header className="w-full bg-black border-b-4 border-pink-600 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left + Mid (logo shifted a bit left) */}
          <div className="flex items-center justify-center gap-4 flex-grow">
            <img
              src={logo}
              alt="Maestera Logo"
              className="h-43 flex items-center justify-between object-contain"
            />
          </div>
        </div>
      </header>


      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-semibold text-neutral-900">
                Thank you for the response
              </h2>
              <p className="mt-3 text-neutral-700">
                For any queries, you can reach out to us through our website or social media platforms
              </p>
              <p className="mt-3 text-neutral-700">
                We will be in touch with you!
              </p>

              {/* ✅ Social Icons instead of Button */}
              <div className="mt-8 flex justify-center gap-8">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/9867229293" // replace with your number
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 text-4xl hover:scale-110 transition-transform"
                >
                  <FaWhatsapp />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/maestera.music?igsh=MWhocXIwa3d6cWQ0Nw==" // replace with your IG link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 text-4xl hover:scale-110 transition-transform"
                >
                  <FaInstagram />
                </a>
              </div>
            </motion.div>
          ) : step === 0 ? (

            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="p-8 text-center">
                  <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                    Welcome to Maestera
                  </h1>

                  <p className="mt-6 text-neutral-700 leading-relaxed">
                    Thank you for your passion for music and for contacting <br /> <strong>Maestera — India’s most flexible and inclusive platform for musicians</strong>.
                  </p>

                  <p className="mt-4 text-neutral-700 leading-relaxed">
                    While our core focus is helping students learn and grow, we know that many teachers also share their art through performances.
                  </p>
                  <p className="mt-4 text-neutral-700 leading-relaxed">
                    By being part of Maestera, you’ll have the chance to <strong>showcase not only your teaching but also your performing side </strong>— opening up opportunities with students, families, and event organizers alike.
                  </p>
                  <p className="mt-4 text-neutral-700 leading-relaxed">
                    This quick form will take just <strong>30–60 seconds to complete.</strong>
                  </p>

                  <p className="mt-4 text-neutral-700 leading-relaxed">
                    It helps us get to know you better so we can connect you with the right students and, where relevant, highlight your performance journey too.
                  </p>


                </div>
                <div className="h-1 w-full bg-rose-600" />
                <div className="p-6 flex items-center justify-between">
                  <div className="text-neutral-600 text-sm">Step 1 of {totalSteps}</div>
                  <button
                    className="px-6 py-2.5 rounded-xl text-white"
                    style={{ backgroundColor: brand.black }}
                    onClick={() => setStep(1)}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div
              key="basic"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Section
                title="Basic Information"

              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Full Name" required>
                    <Input
                      placeholder="Your full name"
                      value={basic.fullName}
                      onChange={(e) =>
                        setBasic({ ...basic, fullName: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field label="Phone Number" required>
                    <Input
                      placeholder="e.g. 9876543210"
                      value={basic.phone}
                      onChange={(e) =>
                        setBasic({ ...basic, phone: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field label="Email" required>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={basic.email}
                      onChange={(e) =>
                        setBasic({ ...basic, email: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field label="Date of Birth" required>
                    <Input
                      type="date"
                      value={basic.dob}
                      onChange={(e) =>
                        setBasic({ ...basic, dob: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field label="Instruments you teach or play" required>
                    <Input
                      placeholder="e.g. Tabla, Guitar, Piano"
                      value={basic.instruments}
                      onChange={(e) =>
                        setBasic({ ...basic, instruments: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field label="Current City" required>
                    <Input
                      placeholder="e.g. Mumbai"
                      value={basic.city}
                      onChange={(e) =>
                        setBasic({ ...basic, city: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field label="Pincode" required>
                    <Input
                      placeholder="e.g. 400001"
                      value={basic.pincode}
                      onChange={(e) =>
                        setBasic({ ...basic, pincode: e.target.value })
                      }
                      required
                    />
                  </Field>
                </div>
              </Section>
              {error && (
                <p className="mt-4 text-sm font-semibold text-rose-600 text-center">
                  {error}
                </p>
              )}

              <StepNav
                step={step}
                total={totalSteps}
                onBack={onBack}
                onNext={onNext}
                canNext={true}   // ✅ always clickable
                submitting={submitting}
              />
            </motion.div>
          ) : (
            <motion.div
              key="multi"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >


              {/* Association Card */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 mb-8">
                <div className="flex items-center mb-4">
                  <span className="inline-block h-6 w-1 rounded bg-rose-600 mr-2" />
                  <h2 className="text-lg font-semibold text-neutral-900">
                    How you'd like to engage with Maestera?
                  </h2>
                </div>

                <div className="flex flex-wrap gap-6">
                  {["Education/Teaching", "Performances", "Both"].map((v) => (
                    <Radio
                      key={v}
                      name="assoc"
                      value={v}
                      current={assoc}
                      onChange={setAssoc}
                      label={v}
                    />
                  ))}
                </div>
                {/* Collaborative Projects – common for all associations */}

                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <span className="inline-block h-6 w-1 rounded bg-[#D10043] mr-2" />
                    <h3 className="text-neutral-900 font-semibold">
                      Would you be open to participating in collaborative music projects as below?
                      <span className="text-neutral-500 ml-1">(multiple options can be selected)</span>
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {["Orchestra", "Choirs", "Theatre", "Ensembles", "Other"].map((label) => (
                      <Checkbox
                        key={label}
                        label={label}
                        checked={multi.collabProjects.has(label)}
                        onChange={() => toggle("collabProjects", label)}
                      />
                    ))}

                    {/* None of the above */}
                    <Checkbox
                      label="None of the above"
                      checked={multi.collabProjects.has("None")}
                      onChange={() => {
                        if (!multi.collabProjects.has("None")) {
                          // Clear all and only keep "None"
                          setMulti({ ...multi, collabProjects: new Set(["None"]) });
                        } else {
                          toggle("collabProjects", "None");
                        }
                      }}
                    />
                  </div>
                </div>

              </div>


              {/* Initialize question counter */}
              {(() => {
                let q = 1;
                return (
                  <>
                    {/* Education/Teaching or Both */}
                    {(assoc === "Education/Teaching" || assoc === "Both") && (
                      <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 mb-8">
                        <h3 className="text-neutral-900 font-semibold mb-2">Education / Teaching</h3>
                        <div className="space-y-6">
                          <div>
                            <p className="font-medium text-neutral-900 mb-2">{q++}. What class formats do you currently teach or would be open to?</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {[
                                "Individual classes - Online",
                                "Individual Classes - Teacher's Place",
                                "Individual Classes - Student's Place",
                                "Group classes - Online",
                                "Group Classes - Teacher's Place",
                                "None of the above - I don't teach",
                                "Other",
                              ].map((label) => (
                                <Checkbox
                                  key={label}
                                  label={label}
                                  checked={multi.classFormats.has(label)}
                                  onChange={() => toggle("classFormats", label)}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-neutral-900 mb-2">{q++}. Do you provide, or open to providing, training for any of these exams?</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {["Trinity", "ABRSM", "Rockschool", "NTB", "None of the above - I don't teach", "Other"].map((label) => (
                                <Checkbox
                                  key={label}
                                  label={label}
                                  checked={multi.exams.has(label)}
                                  onChange={() => toggle("exams", label)}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-neutral-900 mb-2">{q++}. Which additional formats would you like to be involved in with Maestera?</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {["Certificate Courses", "Workshops", "Masterclass", "Teach/Work at educational institutions", "Online classes - Students residing abroad", "None of the above - I don't teach", "Other"].map((label) => (
                                <Checkbox
                                  key={label}
                                  label={label}
                                  checked={multi.additionalFormats.has(label)}
                                  onChange={() => toggle("additionalFormats", label)}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-neutral-900 mb-2">{q++}. Which of these learner groups are you confident in teaching?</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {["Children", "Specially Abled", "Senior Citizen"].map((label) => (
                                <Checkbox
                                  key={label}
                                  label={label}
                                  checked={multi.learnerGroups.has(label)}
                                  onChange={() => toggle("learnerGroups", label)}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Teaching Fee */}
                          <div>
                            <p className="font-medium text-neutral-900 mb-2">Teaching fees per hour</p>
                            <Input
                              type="number"
                              className="max-w-xs"
                              placeholder="Fees in ₹"
                              value={basic.teachingFee || ""}
                              onChange={(e) =>
                                setBasic({ ...basic, teachingFee: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 mb-2">
                              Any other way you would like to contribute/associate?{" "}
                              <span className="text-neutral-500">(Optional)</span>
                            </p>
                            <input
                              type="text"
                              placeholder="Your answer"
                              className="w-full border border-neutral-300 rounded-lg p-2"
                              value={basic.contribution || ""}
                              onChange={(e) => {
                                const val = e.target.value.trimStart(); // optional: avoid leading spaces
                                setBasic((prev) => ({ ...prev, contribution: val }));
                                console.log("Contribution updated:", val); // live debug
                              }}
                            />
                          </div>

                        </div>
                      </div>
                    )}

                    {/* Performances or Both */}
                    {(assoc === "Performances" || assoc === "Both") && (
                      <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 mb-8">
                        <h3 className="text-neutral-900 font-semibold mb-2">Performances</h3>
                        <div className="space-y-6">
                          <div>
                            <p className="font-medium text-neutral-900 mb-2">{q++}. Please select the performance settings you are currently active in, or open to exploring?</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {["Corporates", "Restaurants/Hotels/Cafes", "Social gatherings", "Weddings", "Cultural events", "Religious"].map((label) => (
                                <Checkbox
                                  key={label}
                                  label={label}
                                  checked={multi.performanceSettings.has(label)}
                                  onChange={() => toggle("performanceSettings", label)}
                                />
                              ))}
                            </div>
                          </div>



                          {/* Performance Fee */}
                          <div>
                            <p className="font-medium text-neutral-900 mb-2">Performance fees per hour</p>
                            <Input
                              type="number"
                              className="max-w-xs"
                              placeholder="Fees in ₹"
                              value={basic.performanceFee || ""}
                              onChange={(e) =>
                                setBasic({ ...basic, performanceFee: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}


              {error && (
                <p className="mt-4 text-sm text-rose-600 text-center">{error}</p>
              )}

              <StepNav
                step={step}
                total={totalSteps}
                onBack={onBack}
                onNext={onNext}
                canNext={canNext}
                submitting={submitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-16">
        <div className="h-[5px] w-full bg-rose-600" />
        <div className="py-6 text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} Maestera • Made with ♫
        </div>
      </footer>
    </div>
  );
}
