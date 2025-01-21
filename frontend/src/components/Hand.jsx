// Types (could be moved to separate types.ts file)
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "../contexts/UserContext";
import { useCardSelection } from '../contexts/CardSelectionContext';
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

// Constants
const DRAG_ACTIVATION_DISTANCE = 8;
const CARD_ASSET_PATH = './card-assets';

// Utility functions
const createCardImagePath = (cardId) => `${CARD_ASSET_PATH}/tichu-card-${cardId}.png`;

const createCardMap = (cards) => new Map(cards.map(card => [card.id, card]));

const enrichCard = (card) => ({
  ...card,
  imagePath: createCardImagePath(card.id),
  selected: false,
  name: `${card.suit} ${card.value}`
});

function SortableCard({ card, index, totalCards, onCardClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onCardClick(e);
  };

  // Determine the image to render
  const imagePath = card.isFaceUp
    ? card.imagePath
    : `${CARD_ASSET_PATH}/tichu-card-back-red.png`;

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
        src={imagePath}
        alt={card.isFaceUp ? card.name : 'Card Back'}
        className="card-image"
        draggable="false"
        onClick={handleClick}
      />
    </div>
  );
};

// Main component
export function Hand() {
  const { currentUser } = useUser();
  const [cards, setCards] = useState([]);
  const { 
    selectCards, 
    clearSelection, 
    lastSelectedIndex, 
    updateLastSelectedIndex 
  } = useCardSelection();
  const localOrderRef = useRef([]);

  console.log(currentUser);

  // Card synchronization effect
  useEffect(() => {
    if (!currentUser?.hand) return;

    const serverCards = currentUser.hand;
    
    if (localOrderRef.current.length === 0) {
      localOrderRef.current = serverCards.map(card => card.id);
    }

    const serverCardsMap = createCardMap(serverCards);

    // Maintain order and sync with server
    localOrderRef.current = localOrderRef.current
      .filter(id => serverCardsMap.has(id));

    serverCards.forEach(card => {
      if (!localOrderRef.current.includes(card.id)) {
        localOrderRef.current.push(card.id);
      }
    });

    const orderedCards = localOrderRef.current
      .map(id => serverCardsMap.get(id))
      .filter(Boolean)
      .map(enrichCard);

    setCards(orderedCards);
  }, [currentUser?.hand]);

  // Keyboard handler effect
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setCards(cards => cards.map(card => ({
          ...card,
          selected: false
        })));
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

  // DnD configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_ACTIVATION_DISTANCE,
      },
    })
  );

  // Event handlers
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    setCards((cards) => {
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over.id);
      const newCards = arrayMove(cards, oldIndex, newIndex);
      
      localOrderRef.current = newCards.map(card => card.id);
      return newCards;
    });
  };

  const handleCardClick = (index, event) => {
    if (event.detail === 0) return;

    setCards(cards => {
      let newCards;
      if (event.shiftKey && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        
        newCards = cards.map((card, i) => ({
          ...card,
          selected: i >= start && i <= end ? true : card.selected
        }));
      } else {
        newCards = cards.map((card, i) => ({
          ...card,
          selected: i === index ? !card.selected : card.selected
        }));
      }

      selectCards(newCards.filter(card => card.selected));
      return newCards;
    });

    updateLastSelectedIndex(index);
  };

  // Render
  return (
    <div className="hand-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cards.map(card => card.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="cards-row">
            {cards.map((card, index) => (
              <SortableCard
                key={card.id}
                card={card}
                index={index}
                totalCards={cards.length}
                onCardClick={(e) => handleCardClick(index, e)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}