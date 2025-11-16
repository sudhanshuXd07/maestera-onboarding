import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Part2 from "./Part2";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/part2" element={<Part2 />} />
      </Routes>
    </BrowserRouter>
  );
}
