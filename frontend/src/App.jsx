import React from "react";
import { useEffect } from "react"
import { Routes, Route } from "react-router-dom";
import JoinPage from "./pages/JoinPage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import { testSharedCode } from '@shared/game/play-validation';
import { useUser } from "./contexts/UserContext";

function App() {

  console.log('Frontend test:', testSharedCode());

  useEffect(() => {
    const targetPath = "/"; //
    if (window.location.pathname !== targetPath) {
      window.location.href = targetPath;
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<JoinPage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}

export default App;