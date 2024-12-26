import React from "react";
import { useEffect } from "react"
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";

function App() {

  useEffect(() => {
    const targetPath = "/"; //
    if (window.location.pathname !== targetPath) {
      window.location.href = targetPath;
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lobby" element={<LobbyPage />} />
    </Routes>
  );
}

export default App;