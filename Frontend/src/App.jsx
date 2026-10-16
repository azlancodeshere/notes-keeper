import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import "./App.css";

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const home = (
    <ProtectedRoute>
      <HomePage
        selectedNoteId={selectedNoteId}
        setSelectedNoteId={setSelectedNoteId}
      />
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/home" element={home} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/notes/:id" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;