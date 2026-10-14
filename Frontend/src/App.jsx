
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NoteEditor from "./pages/NoteEditor.jsx";

import "./App.css";

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/home"
        element={
          <HomePage
            selectedNoteId={selectedNoteId}
            setSelectedNoteId={setSelectedNoteId}
          />
        }
      />

      <Route
        path="/"
        element={
          <HomePage
            selectedNoteId={selectedNoteId}
            setSelectedNoteId={setSelectedNoteId}
          />
        }
      />

      
      <Route path="/notes/:id" element={<Navigate to="/home" replace />} />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
