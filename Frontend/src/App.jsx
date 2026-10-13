
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";

import "./App.css";

function App() {
  return (
    <Routes>
      
      <Route path="/signup" element={<SignUpPage />} />
       <Route path="/login" element={<LoginPage />} />
       <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
