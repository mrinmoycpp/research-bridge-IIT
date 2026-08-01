import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import { MainLayout } from "./layouts/MainLayout";
import { DisclaimerPopup } from "./components/DisclaimerPopup";
import { Landing } from "./pages/Landing";
import { Discover } from "./pages/Discover";
import { ProfessorProfile } from "./pages/ProfessorProfile";
import { IITExplorer } from "./pages/IITExplorer";
import { IITDetail } from "./pages/IITDetail";
import { ResearchAreas } from "./pages/ResearchAreas";
import { ResearchAreaDetail } from "./pages/ResearchAreaDetail";
import { Publications } from "./pages/Publications";
import { Opportunities } from "./pages/Opportunities";
import { Saved } from "./pages/Saved";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DisclaimerPopup />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/professors" element={<Discover />} />
              <Route path="/professors/:slug" element={<ProfessorProfile />} />
              <Route path="/iits" element={<IITExplorer />} />
              <Route path="/iits/:id" element={<IITDetail />} />
              <Route path="/research-areas" element={<ResearchAreas />} />
              <Route path="/research-areas/:slug" element={<ResearchAreaDetail />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
