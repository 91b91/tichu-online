import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "../contexts/UserContext";
import { useCardSelection } from '../contexts/CardSelectionContext';
import { getCardsByIds } from '@shared/game/cards';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DRAG_ACTIVATION_DISTANCE = 8;
const CARD_ASSET_PATH = './card-assets';

const createCardImagePath = (cardId) => `${CARD_ASSET_PATH}/tichu-card-${cardId}.png`;

// Renders a face-down card that can be clicked to flip
function StaticCard({ cardId, index }) {
  const { currentUser, flipCards } = useUser();

  async function handleStaticCardClick() {
    try {
      await flipCards(currentUser.userId);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div 
      className="card-wrapper static"
      data-index={index}
      onClick={handleStaticCardClick}
    >
      <img
        src={`${CARD_ASSET_PATH}/tichu-card-back-red.png`}
        alt="Card Back"
        className="card-image"
        draggable="false"
      />
    </div>
  );
}

// Renders a face-up card that can be dragged, selected, and clicked
function SortableCard({ cardId, card, index, onCardClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cardId });

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`card-wrapper ${card.selected ? 'selected' : ''} ${
        isDragging ? 'dragging' : ''
      }`}
      style={cardStyle}
      data-index={index}
    >
      <img
        src={createCardImagePath(cardId)}
        alt={`${card.suit} ${card.value}`}
        className="card-image"
        draggable="false"
        onClick={(e) => onCardClick(e)}
      />
    </div>
  );
}

// Main component that manages the player's hand of cards
export function Hand() {
  const { currentUser } = useUser();
  const [faceUpCards, setFaceUpCards] = useState([]);
  const { 
    selectCards, 
    clearSelection, 
    lastSelectedIndex, 
    updateLastSelectedIndex 
  } = useCardSelection();
  
  // Maintains the order of cards after drag and drop operations
  const localOrderRef = useRef([]);

  // Update face-up cards when they change, maintaining drag-and-drop order
  useEffect(() => {
    if (!currentUser?.faceUpCardIds) return;

    const cards = getCardsByIds(currentUser.faceUpCardIds).map(card => ({
      ...card,
      selected: false,
    }));

    // Initialize local order if it's empty
    if (localOrderRef.current.length === 0) {
      localOrderRef.current = cards.map(card => card.id);
    }

    // Add any new cards to the end of the local order
    cards.forEach(card => {
      if (!localOrderRef.current.includes(card.id)) {
        localOrderRef.current.unshift(card.id);
      }
    });

    // Remove any cards that no longer exist
    localOrderRef.current = localOrderRef.current.filter(id =>
      cards.some(card => card.id === id)
    );

    // Apply the local order to the cards
    const orderedCards = localOrderRef.current
      .map(id => cards.find(card => card.id === id))
      .filter(Boolean);

    setFaceUpCards(orderedCards);
  }, [currentUser?.faceUpCardIds]);

  // Handle escape key to clear card selection
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setFaceUpCards(cards => cards.map(card => ({
          ...card,
          selected: false,
        })));
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_ACTIVATION_DISTANCE,
      },
    })
  );

  // Update card order after drag and drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFaceUpCards((cards) => {
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over.id);
      const newCards = arrayMove(cards, oldIndex, newIndex);

      // Update local order reference to match new arrangement
      localOrderRef.current = newCards.map(card => card.id);
      return newCards;
    });
  };

  // Handle card selection with shift-click support for multiple selection
  const handleCardClick = (visibleIndex, event) => {
    if (event.detail === 0) return; // Ignore artificial clicks from drag end

    setFaceUpCards(cards => {
      const targetCard = cards[visibleIndex];

      let newCards = cards.map(card => ({
        ...card,
        selected: card.id === targetCard.id ? !card.selected : card.selected,
      }));

      // Handle shift-click range selection
      if (event.shiftKey && lastSelectedIndex !== null) {
        const start = Math.min(visibleIndex, lastSelectedIndex);
        const end = Math.max(visibleIndex, lastSelectedIndex);

        newCards = cards.map((card, idx) => ({
          ...card,
          selected: idx >= start && idx <= end ? true : card.selected,
        }));
      }

      selectCards(newCards.filter(card => card.selected));
      return newCards;
    });

    updateLastSelectedIndex(visibleIndex);
  };

  return (
    <div className="hand-container">
      <div className="cards-area">
        <div className="cards-group face-down">
          {currentUser.faceDownCardIds.map((id, index) => (
            <StaticCard 
              key={id} 
              cardId={id} 
              index={index}
            />
          ))}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={faceUpCards.map(card => card.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className={`cards-group face-up ${currentUser.faceDownCardIds.length === 0 ? 'no-face-down' : ''}`}>
              {faceUpCards.map((card, index) => (
                <SortableCard
                  key={card.id}
                  cardId={card.id}
                  card={card}
                  index={index}
                  onCardClick={(e) =>
                    handleCardClick(
                      faceUpCards.findIndex(c => c.id === card.id),
                      e
                    )
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}