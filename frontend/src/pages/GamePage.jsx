import React from "react";
import { Hand } from "../components/Hand";
import { CardSelectionProvider } from '../contexts/CardSelectionContext';
import { ActionButtons } from "../components/ActionButtons";

function GamePage() {
  return(
    <CardSelectionProvider>
      <Hand></Hand>
      <ActionButtons></ActionButtons>
    </CardSelectionProvider>
  )
}

export default GamePage;