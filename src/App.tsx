import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SmoothScroll } from "./components/SmoothScroll";
import { CursorGlow } from "./components/UI/CursorGlow";
import { HomePage } from "./pages/HomePage";
import { ProjectPage } from "./pages/ProjectPage";

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <CursorGlow />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  );
}
